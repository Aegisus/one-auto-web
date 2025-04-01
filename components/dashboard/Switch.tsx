import { Switch } from "@heroui/switch";
import { useState, useEffect } from "react";
import { SendCommands } from "@/stores/useSendCommandsStore";
import { useOutputStore } from "@/config/zustand/OutputStore";

interface DashboardSwitchProps {
  switchLabel: string;
  initialState: string;
  defaultSelected: boolean;
  deviceType: string;
  deviceAddress: string;
  deviceUID: string;
}

export default function DashboardSwitch({
  switchLabel,
  defaultSelected,
  deviceType,
  deviceAddress,
  deviceUID,
}: DashboardSwitchProps) {
  const [isSelected, setIsSelected] = useState(defaultSelected);

  const [submitted, setSubmitted] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const addOutput = useOutputStore((state) => state.addOutput);

  const [currentDeviceType, setCurrentDeviceType] = useState<
    string | undefined
  >(undefined);

  useEffect(() => {
    if (deviceType) {
      setCurrentDeviceType(deviceType);
    }
  }, [deviceType]);

  const handleSwitchChange = () => {
    setIsSelected(!isSelected);
  };

  const measure_power = async () => {
    const data = {
      address: deviceAddress,
      command: "MEAS:POWER?", // For now
    };

    try {
      const result = await SendCommands({
        address: data.address,
        content: data.command,
        deviceType: deviceType,
      });

      addOutput(deviceUID + "|measure_power", JSON.stringify(result)); // Ensure result is a string
      setError(null);
    } catch (err: any) {
      const errorOutput = {
        error: true,
        message: err.message,
      };
      setError(err.message);
      addOutput(deviceUID + "|measure_power_err", JSON.stringify(errorOutput)); // Set output with error details
    }

    setSubmitted(data);
  };

  // useEffect(() => {
  //   let interval: ReturnType<typeof setInterval> | null = null;
  //   if (isSelected) {
  //     set_wavelength().then(() => {
  //       interval = setInterval(measure_power, 1000); // Submit every second
  //     });
  //   } else if (interval) {
  //     clearInterval(interval);
  //   }
  //   return () => {
  //     if (interval) {
  //       clearInterval(interval);
  //     }
  //   };
  // }, [isSelected, selectedValue]);

  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | null = null;
    if (isSelected) {
      interval = setInterval(measure_power, 1000); // Measure power every second
    } else if (interval) {
      clearInterval(interval);
    }
    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [isSelected]); // Removed `selectedValue` dependency

  return (
    <Switch
      isSelected={isSelected}
      isDisabled={!currentDeviceType}
      onChange={handleSwitchChange}
    >
      {switchLabel}
    </Switch>
  );
}
