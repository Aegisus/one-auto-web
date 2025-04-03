import { create } from "zustand";
import { useDeviceActionsStore } from "@/stores/useDeviceActionsStore";
import { SendCommands } from "@/stores/useSendCommandsStore";
import * as jsYaml from "js-yaml";

interface DeviceFunction {
  description: string;
  parameters?: {
    type: string;
    unit: string;
    description: string;
  };
  steps: {
    command: string;
    interval?: number;
  }[];
}

interface DeviceStore {
  functions: Record<string, DeviceFunction>;
  executeFunction: (
    deviceUID: string,
    functionName: string,
    deviceType: string, // Add deviceType here
    params?: Record<string, any>
  ) => Promise<void>; // Update return type to Promise<void> since the implementation is async
  getSCPICommand: (deviceUID: string, commandKey: string) => string | null;
  fetchDeviceFunctions: () => void;
}

export const useDeviceExecutionStore = create<DeviceStore>((set, get) => ({
  functions: {},
  executeFunction: async (
    deviceUID: string,
    functionName: string,
    deviceType: string, // Accept deviceType as a parameter here
    params: Record<string, any> = {} // Explicitly type params as a Record
  ) => {
    const deviceFunctions = get().functions;
    const functionDef = deviceFunctions[functionName];

    if (!functionDef) {
      console.error(`Function "${functionName}" not found.`);
      return;
    }

    for (const step of functionDef.steps) {
      const commandKey = step.command;
      let command = get().getSCPICommand(deviceUID, commandKey);

      if (!command) {
        console.error(`SCPI command not found for "${commandKey}"`);
        continue;
      }

      // Replace placeholders if any
      Object.keys(params).forEach((key) => {
        if (command) {
          command = command.replace(`{${key}}`, params[key]);
        }
      });

      try {
        if (command) {
          await SendCommands({
            address: deviceUID,
            content: command,
            deviceType: deviceType, // Pass deviceType here
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

    // Convert commands to a string if it's an array
    const commandsString = Array.isArray(deviceAction.commands)
      ? JSON.stringify(deviceAction.commands)
      : deviceAction.commands;

    const commands = jsYaml.load(commandsString) as Record<string, string>;
    return commands[commandKey] || null;
  },

  fetchDeviceFunctions: () => {
    const { deviceActions } = useDeviceActionsStore.getState();

    const functions: Record<string, DeviceFunction> = {};

    deviceActions.forEach((action) => {
      if (action.functions) {
        action.functions.forEach((func) => {
          // Validate that func has the required properties of DeviceFunction
          if (
            typeof func.description === "string" &&
            Array.isArray(func.steps) &&
            func.steps.every(
              (step) =>
                typeof step.command === "string" &&
                (typeof step.interval === "undefined" ||
                  typeof step.interval === "number")
            )
          ) {
            functions[func.name as string] = func as unknown as DeviceFunction; // Safely cast after validation
          } else {
            console.error(
              "Invalid function object: missing or invalid properties",
              func
            );
          }
        });
      }
    });

    set({ functions });
  },
}));

// Fetch functions on app load
useDeviceExecutionStore.getState().fetchDeviceFunctions();
