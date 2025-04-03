import { Switch } from "@heroui/switch";
import { useState, useEffect } from "react";
import { useDeviceExecutionStore } from "@/stores/useDeviceExecutionStore";

interface DashboardSwitchProps {
  switchLabel: string;
  defaultSelected: boolean;
  deviceUID: string;
  deviceType: string; // Add deviceType here
}

export default function DashboardSwitch({
  switchLabel,
  defaultSelected,
  deviceUID,
  deviceType, // Destructure deviceType
}: DashboardSwitchProps) {
  const [isSelected, setIsSelected] = useState(defaultSelected);
  const executeFunction = useDeviceExecutionStore(
    (state) => state.executeFunction
  );

  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | null = null;

    if (isSelected) {
      interval = setInterval(() => {
        // Pass deviceType when calling executeFunction
        executeFunction(deviceUID, "measure_power", deviceType);
      }, 1000);
    } else if (interval) {
      clearInterval(interval);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isSelected, deviceUID, executeFunction, deviceType]); // Add deviceType to dependencies

  return (
    <Switch isSelected={isSelected} onChange={() => setIsSelected(!isSelected)}>
      {switchLabel}
    </Switch>
  );
}
