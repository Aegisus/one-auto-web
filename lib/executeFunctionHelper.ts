import yaml from "js-yaml";
import { useDeviceActionsStore } from "@/stores/useDeviceActionsStore";
import { SendCommands } from "@/stores/useSendCommandsStore";
import { useOutputStore } from "@/config/zustand/OutputStore";
import { Step, FunctionDetails } from "@/lib/types"; // Import the shared type
import { useSwitchStateStore } from "@/config/zustand/SwitchKeys";

// interface Step {
//   command?: string;
//   loop?: {
//     type: string; // "periodic" or "ramp"
//     interval?: number; // For periodic loops
//     start?: number; // For ramp loops
//     end?: number; // For ramp loops
//     step?: number; // For ramp loops
//     delay?: number; // Delay between steps in ramp loops
//     command?: string; // Command to execute within the loop
//   };
// }

// interface FunctionDetails {
//   name: string;
//   steps: Step[];
//   parameters?: Record<string, any>;
//   description?: string;
// }

export const executeFunctionSteps = async (
  deviceUID: string,
  deviceAddress: string,
  func: FunctionDetails,
  deviceType: string,
  setError: (error: string | null) => void,
  value: string = ""
) => {
  const addOutput = useOutputStore.getState().addOutput;

  if (!func || !func.steps || func.steps.length === 0) {
    console.error("Invalid function or steps are missing.");
    return;
  }

  // Get the commands from the DeviceActionsStore
  const { deviceActions } = useDeviceActionsStore.getState();

  // Define the type of the commands object
  interface Commands {
    general?: Record<string, string>;
  }

  // Find the device actions for the given deviceUID
  const deviceAction = deviceActions.find((action) => action.uid === deviceUID);
  if (!deviceAction || !deviceAction.commands) {
    console.error(`No commands found for deviceUID: ${deviceUID}`);
    return;
  }

  const commands = deviceAction.commands as Commands; // Explicitly cast to Commands

  // If commands is an array, find the `general` section
  let generalCommands: Record<string, string> | undefined;
  if (Array.isArray(commands)) {
    const generalSection = commands.find(
      (section: any) => section.general && typeof section.general === "object"
    );
    generalCommands = generalSection?.general;
  } else if (commands.general && typeof commands.general === "object") {
    // If commands is an object, directly access the `general` property
    generalCommands = commands.general;
  }

  if (!generalCommands) {
    console.error("The 'general' section is missing or invalid in commands.");
    return;
  }

  // Extract all function keys from the `general` section
  const functionKeys = Object.keys(generalCommands);
  // console.log("Available functions in 'general':", functionKeys);

  // Overload signatures
  function resolveCommand(
    commandKey: string,
    singleCommand: true
  ): string | null;
  function resolveCommand(
    commandKey: string,
    singleCommand?: false
  ): string[] | null;

  // Helper to resolve a command from the `general` section
  function resolveCommand(
    commandKey: string,
    singleCommand = false
  ): string | string[] | null {
    if (!generalCommands) {
      console.error("The 'general' section is missing or invalid in commands.");
      return "";
    }
    const command = generalCommands[commandKey] || null;
    if (!command) return null;

    // Split the command by "|" to handle chaining
    const commands = command.split("|").map((cmd) => {
      if (cmd.includes("{value}")) {
        return cmd.replace("{value}", value); // Replace {value} with the provided value
      }
      return cmd;
    });

    return singleCommand ? commands[0] || null : commands;
  }

  // Process each step in the function
  for (let index = 0; index < func.steps.length; index++) {
    const step = func.steps[index];
    if (step.command) {
      // Handle simple or chained commands
      const commands = resolveCommand(step.command);
      if (commands) {
        const commandArray = Array.isArray(commands) ? commands : [commands]; // Ensure commands is an array
        for (const cmd of commandArray) {
          try {
            const result = await SendCommands({
              address: deviceAddress,
              content: cmd,
              deviceType,
            });

            addOutput(deviceUID + `|${cmd}`, JSON.stringify(result));
            setError(null);
          } catch (err: any) {
            const errorOutput = {
              error: true,
              message: err.message,
            };
            setError(err.message);
            addOutput(deviceUID + `|${cmd}_err`, JSON.stringify(errorOutput));
          }
        }
      } else {
        console.error(`Command "${step.command}" not found.`);
      }
    } else if (step.loop) {
      // Handle loops
      const loop = step.loop;
      if (loop.type === "periodic" && loop.interval) {
        if (!loop.command) {
          console.error(
            `Step ${index + 1}: Periodic loop is missing a command.`
          );
          continue;
        }
        // console.log(
        //   `Step ${index + 1}: Starting periodic loop with interval ${loop.interval}ms`
        // );
        await executePeriodicLoop(
          loop.command,
          loop.interval,
          resolveCommand,
          deviceAddress,
          deviceUID,
          deviceType,
          setError
        );
      } else if (
        loop.type === "ramp" &&
        loop.start !== undefined &&
        loop.end !== undefined &&
        loop.step !== undefined
      ) {
        if (!loop.command) {
          console.error(`Step ${index + 1}: Ramp loop is missing a command.`);
          continue;
        }
        console.log(
          `Step ${index + 1}: Starting ramp loop from ${loop.start} to ${loop.end} with step ${loop.step}`
        );
        await executeRampLoop(
          loop,
          (key) => resolveCommand(key, true) as string | null,
          deviceAddress,
          deviceUID,
          deviceType,
          setError
        );
      } else {
        console.error(`Step ${index + 1}: Invalid loop configuration.`);
      }
    } else {
      console.error(`Step ${index + 1}: Invalid step format.`);
    }
  }
};

// Handle periodic loops (while-like)
const executePeriodicLoop = async (
  commandKey: string,
  interval: number,
  resolveCommand: (commandKey: string, singleCommand: true) => string | null, // Updated type
  deviceAddress: string,
  deviceUID: string,
  deviceType: string,
  setError: (error: string | null) => void
) => {
  const addOutput = useOutputStore.getState().addOutput;

  if (!commandKey) {
    console.error("Periodic loop is missing a command.");
    return;
  }

  const command = resolveCommand(commandKey, true); // Explicitly set singleCommand: true
  if (!command) {
    console.error(`Command "${commandKey}" not found.`);
    return;
  }

  const loop = async () => {
    const { isSelected } = useSwitchStateStore.getState();
    if (!isSelected) {
      return; // Exit the loop if isSelected is false
    }
    console.log(commandKey);
    try {
      const result = await SendCommands({
        address: deviceAddress,
        content: command,
        deviceType,
      });

      addOutput(deviceUID + `|${commandKey}`, JSON.stringify(result));
      setError(null);
    } catch (err: any) {
      const errorOutput = {
        error: true,
        message: err.message,
      };
      setError(err.message);
      addOutput(deviceUID + `|${commandKey}_err`, JSON.stringify(errorOutput));
    }

    // Schedule the next iteration only if isSelected is still true
    if (isSelected) {
      setTimeout(loop, interval);
    }
  };

  // Start the loop
  loop();
};

// Handle ramp loops (for-like)
const executeRampLoop = async (
  loop: Step["loop"],
  resolveCommand: (commandKey: string, singleCommand: boolean) => string | null,
  deviceAddress: string,
  deviceUID: string,
  deviceType: string,
  setError: (error: string | null) => void
) => {
  const addOutput = useOutputStore.getState().addOutput;

  if (!loop || !loop.command) {
    console.error("Ramp loop is missing a command.");
    return;
  }

  const commandTemplate = resolveCommand(loop.command, true); // Get only the first command
  if (!commandTemplate) {
    console.error(`Command "${loop.command}" not found.`);
    return;
  }

  const { start, end, step, delay = 1000 } = loop;
  if (start === undefined || end === undefined || step === undefined) {
    console.error("Ramp loop is missing start, end, or step values.");
    return;
  }

  console.log(
    `Executing ramp loop for command "${loop.command}" from ${start} to ${end} with step ${step} and delay ${delay}ms`
  );

  for (let value = start; value <= end; value += step) {
    const command = commandTemplate.replace("{value}", value.toString());
    try {
      const result = await SendCommands({
        address: deviceAddress,
        content: command,
        deviceType,
      });

      addOutput(
        deviceUID + `|${loop.command}_${value}`,
        JSON.stringify(result)
      );
      setError(null);
    } catch (err: any) {
      const errorOutput = {
        error: true,
        message: err.message,
      };
      setError(err.message);
      addOutput(
        deviceUID + `|${loop.command}_${value}_err`,
        JSON.stringify(errorOutput)
      );
    }

    await new Promise((resolve) => setTimeout(resolve, delay));
  }

  console.log("Ramp loop execution completed.");
};
