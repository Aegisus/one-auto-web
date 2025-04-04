import { create } from "zustand";
import { useDeviceActionsStore } from "@/stores/useDeviceActionsStore";
import { SendCommands } from "@/stores/useSendCommandsStore";
import { DeviceActionsType } from "@/db/zod/zodDeviceActionsSchema";

export interface DeviceStore {
  exeFunctions: Record<
    string,
    Required<DeviceActionsType>["functions"][number]
  >;
  fetchDeviceExeFunctions: () => void;
  executeFunction: (
    deviceUID: string,
    functionName: string,
    deviceType: string,
    params?: Record<string, any>
  ) => Promise<void>;
  getSCPICommand: (deviceUID: string, commandKey: string) => string | null;
}

export const useDeviceExecutionStore = create<DeviceStore>((set, get) => {
  const fetchDeviceExeFunctions = () => {
    const { deviceActions } = useDeviceActionsStore.getState();
    const exeFunctions: Record<
      string,
      Required<DeviceActionsType>["functions"][number]
    > = {};

    deviceActions.forEach((action) => {
      action.functions?.forEach((func) => {
        if (typeof func === "object" && typeof func.name === "string") {
          exeFunctions[func.name] =
            func as Required<DeviceActionsType>["functions"][number];
        }
      });
    });

    set({ exeFunctions }); // ✅ Updates the store safely
  };

  return {
    exeFunctions: {},
    fetchDeviceExeFunctions, // Store the function in Zustand, but don't run it immediately
    executeFunction: async (
      deviceUID,
      functionName,
      deviceType,
      params = {}
    ) => {
      let { exeFunctions } = get();

      // Ensure functions are loaded before proceeding
      if (Object.keys(exeFunctions).length === 0) {
        console.warn(`exeFunctions is empty. Fetching device functions...`);
        fetchDeviceExeFunctions();
        await new Promise((resolve) => setTimeout(resolve, 100)); // Small delay before retrying
        exeFunctions = get().exeFunctions;
      }

      const exeFunctionDef = exeFunctions[functionName];
      if (!exeFunctionDef) {
        console.error(`Function "${functionName}" not found.`);
        return;
      }

      for (const step of exeFunctionDef.steps) {
        const commandKey = step.command;
        let command = get().getSCPICommand(deviceUID, commandKey);

        if (!command) {
          console.error(`SCPI command not found for "${commandKey}"`);
          continue;
        }

        Object.entries(params).forEach(([key, value]) => {
          command = command.replace(`{${key}}`, String(value));
        });

        try {
          if (command) {
            await SendCommands({
              address: deviceUID,
              content: command,
              deviceType,
            });
          }

          if (step.interval) {
            await new Promise((resolve) => setTimeout(resolve, step.interval));
          }
        } catch (error) {
          console.error(`Error executing "${functionName}":`, error);
        }
      }
    },

    getSCPICommand: (deviceUID, commandKey) => {
      const { deviceActions } = useDeviceActionsStore.getState();
      const deviceAction = deviceActions.find(
        (device) => device.uid === deviceUID
      );

      if (!deviceAction || !deviceAction.commands) return null;

      let commandsArray: any[];
      try {
        commandsArray = Array.isArray(deviceAction.commands)
          ? deviceAction.commands
          : JSON.parse(deviceAction.commands);
      } catch (error) {
        console.error("Error parsing SCPI commands:", error);
        return null;
      }

      for (const commandGroup of commandsArray) {
        if (typeof commandGroup !== "object") continue;

        if (commandGroup.general && commandGroup.general[commandKey]) {
          return commandGroup.general[commandKey];
        }
      }

      console.error(`SCPI command not found for "${commandKey}"`);
      return null;
    },
  };
});

// Fetch functions on app load
useDeviceExecutionStore.getState().fetchDeviceExeFunctions();
