import { Switch } from "@heroui/switch";
import { useState, useEffect } from "react";
import { useDeviceExecutionStore } from "@/stores/useDeviceFunctionGetStore";
import { executeFunctionSteps } from "@/lib/executeFunctionHelper";
import { useOutputStore } from "@/config/zustand/OutputStore";
import { useSwitchStateStore } from "@/config/zustand/SwitchKeys";

interface DashboardSwitchProps {
  switchLabel: string;
  defaultSelected: boolean;
  deviceUID: string;
  deviceType: string;
  exeFunction: string;
  deviceAddress: string;
}

export default function DashboardSwitch({
  switchLabel,
  defaultSelected,
  deviceUID,
  deviceType,
  exeFunction,
  deviceAddress,
}: DashboardSwitchProps) {
  // const [isSelected, setIsSelected] = useState(defaultSelected);
  const { isSelected, setIsSelected } = useSwitchStateStore();
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
    }
  };

  useEffect(() => {
    // Set the deviceUID in the zustand store when the component mounts or updates
    setDeviceUID(deviceUID);
    fetchDeviceExeFunctions();
  }, [deviceUID, setDeviceUID, fetchDeviceExeFunctions]);

  useEffect(() => {
    const func = exeFunctions[exeFunction];
    if (func) {
      // Log the entire function object to inspect its details
      // console.log(`Function details for ${exeFunction}:`, func);
      // console.log(isSelected);
      // Execute the function
      executeFunctionSteps(
        deviceUID,
        deviceAddress,
        func,
        deviceType,
        setError
      );
    }
  }, [
    isSelected,
    exeFunctions,
    exeFunction,
    deviceUID,
    deviceType,
    deviceAddress,
  ]);
  return (
    <Switch isSelected={isSelected} onChange={() => setIsSelected(!isSelected)}>
      {switchLabel}
    </Switch>
  );
}
