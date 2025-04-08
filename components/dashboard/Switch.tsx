import { Switch } from "@heroui/switch";
import { useEffect } from "react";
import { useDeviceExecutionStore } from "@/stores/useDeviceFunctionGetStore";
import { executeFunctionSteps } from "@/lib/executeFunctionHelper";
import { useSwitchStateStore } from "@/config/zustand/SwitchKeys";

interface DashboardSwitchProps {
  switchLabel: string;
  defaultSelected: boolean;
  deviceUID: string;
  deviceType: string;
  layoutExeFunction: string;
  deviceAddress: string;
}

export default function DashboardSwitch({
  switchLabel,
  defaultSelected,
  deviceUID,
  deviceType,
  layoutExeFunction,
  deviceAddress,
}: DashboardSwitchProps) {
  // const [isSelected, setIsSelected] = useState(defaultSelected);
  const { isSelected, setIsSelected } = useSwitchStateStore();
  // Access store
  const { exeFunctions, fetchDeviceExeFunctions, setDeviceUID } =
    useDeviceExecutionStore();

  // Function to handle errors
  const setError = (error: string | null) => {
    if (error) {
      console.error("Error:", error);
    }
  };

  // Set the deviceUID in the zustand store when the component mounts or updates
  useEffect(() => {
    setDeviceUID(deviceUID);
    fetchDeviceExeFunctions();
  }, [deviceUID, setDeviceUID, fetchDeviceExeFunctions]);

  // Execute the function
  useEffect(() => {
    const func = exeFunctions[layoutExeFunction];
    if (func) {
      executeFunctionSteps(
        deviceUID,
        deviceAddress,
        func,
        deviceType,
        setError
      );
    } else {
      console.log(
        "Cannnot find function. Layout exeFunction: " + layoutExeFunction
      );
    }
  }, [
    isSelected,
    exeFunctions,
    layoutExeFunction,
    deviceUID,
    deviceType,
    deviceAddress,
  ]);

  return (
    <Switch
      isSelected={isSelected}
      onChange={() => setIsSelected(!isSelected)}
      defaultChecked={defaultSelected}
    >
      {switchLabel}
    </Switch>
  );
}
