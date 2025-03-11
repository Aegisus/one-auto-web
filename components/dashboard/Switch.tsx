import { Switch } from "@heroui/switch";
import { useState, useEffect } from "react";
import { useMultiDropdownStore } from "@/config/zustand/DropdownKeys";
import { SendCommands } from "@/stores/useSendCommandsStore";
import { useOutputStore } from "@/config/zustand/OutputStore";

interface DashboardSwitchProps {
  switchLabel: string;
  initialState: string;
  defaultSelected: boolean;
  deviceType: string;
  dropdownID: string;
  deviceAddress: string;
  outputID: string;
}

export default function DashboardSwitch({
  switchLabel,
  defaultSelected,
  deviceType,
  dropdownID,
  deviceAddress,
  outputID,
}: DashboardSwitchProps) {
  const [isSelected, setIsSelected] = useState(defaultSelected);

  const [submitted, setSubmitted] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const setOutput = useOutputStore((state) => state.setOutput);

  const [currentDeviceType, setCurrentDeviceType] = useState<
    string | undefined
  >(undefined);

  useEffect(() => {
    if (deviceType) {
      setCurrentDeviceType(deviceType);
    }
  }, [deviceType]);

  const { dropdowns } = useMultiDropdownStore();
  const dropdownSelectedKeys = dropdowns[dropdownID] || new Set();
  const selectedValue = Array.from(dropdownSelectedKeys)
    .join(", ")
    .replace(/_/g, "");

  const handleSwitchChange = () => {
    setIsSelected(!isSelected);
  };

  const set_wavelength = async () => {
    const data = {
      address: deviceAddress,
      command: `SENS:CORR:WAV ${selectedValue}`, // Command to set wavelength
    };

    try {
      const result = await SendCommands({
        address: data.address,
        content: data.command,
        deviceType: deviceType,
      });

      // console.log(`Wavelength set result: ${JSON.stringify(result)}`);
      // setOutput(outputID, selectedValue);
      setOutput(outputID, `Wavelength set result: ${JSON.stringify(result)}`);
      setError(null);
    } catch (err: any) {
      setError(err.message);
      console.log(`Error setting wavelength: ${err.message}`);
    }

    setSubmitted(data);
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

      setOutput(outputID, JSON.stringify(result)); // Ensure result is a string
      setError(null);
    } catch (err: any) {
      setError(err.message);
      setOutput(outputID, "");
    }

    setSubmitted(data);
  };

  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | null = null;
    if (isSelected) {
      set_wavelength().then(() => {
        interval = setInterval(measure_power, 1000); // Submit every second
      });
    } else if (interval) {
      clearInterval(interval);
    }
    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [isSelected, selectedValue]);

  return (
    <Switch
      isSelected={isSelected}
      isDisabled={!selectedValue}
      onChange={handleSwitchChange}
    >
      {switchLabel}
    </Switch>
  );
}
