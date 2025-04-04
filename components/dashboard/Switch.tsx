import { Switch } from "@heroui/switch";
import { useState, useEffect } from "react";
import { useDeviceExecutionStore } from "@/stores/useDeviceFunctionGetStore";
import { executeFunctionSteps } from "@/lib/executeFunctionHelper";
import { useOutputStore } from "@/config/zustand/OutputStore";

interface DashboardSwitchProps {
  switchLabel: string;
  defaultSelected: boolean;
  deviceUID: string;
  deviceType: string;
  exeFunction: string;
}

export default function DashboardSwitch({
  switchLabel,
  defaultSelected,
  deviceUID,
  deviceType,
  exeFunction,
}: DashboardSwitchProps) {
  const [isSelected, setIsSelected] = useState(defaultSelected);

  // Access zustand store
  const { exeFunctions, fetchDeviceExeFunctions, setDeviceUID } =
    useDeviceExecutionStore();

  // Function to handle output
  const addOutput = (key: string, value: string) => {
    console.log(`Output [${key}]:`, value);
  };

  // Function to handle errors
  const setError = (error: string | null) => {
    if (error) {
      console.error("Error:", error);
    } else {
      console.log("No errors.");
    }
  };

  useEffect(() => {
    // Set the deviceUID in the zustand store when the component mounts or updates
    setDeviceUID(deviceUID);
    fetchDeviceExeFunctions();
  }, [deviceUID, setDeviceUID, fetchDeviceExeFunctions]);

  useEffect(() => {
    if (isSelected) {
      const func = exeFunctions[exeFunction];
      if (func) {
        // Log the entire function object to inspect its details
        console.log(`Function details for ${exeFunction}:`, func);
        // Execute the function
        executeFunctionSteps(deviceUID, func, deviceType, addOutput, setError);
      }
    }
  }, [isSelected, exeFunctions, exeFunction, deviceUID, deviceType]);

  return (
    <Switch isSelected={isSelected} onChange={() => setIsSelected(!isSelected)}>
      {switchLabel}
    </Switch>
  );
}
