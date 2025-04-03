import { Switch } from "@heroui/switch";
import { useState, useEffect } from "react";
import { SendCommands } from "@/stores/useSendCommandsStore";
import { useOutputStore } from "@/config/zustand/OutputStore";
import {
  useDeviceActionsStore,
  useDeviceActions,
} from "@/stores/useDeviceActionsStore";
import { type DeviceActionsArray } from "@/db/zod/zodDeviceActionsSchema";
import * as jsYaml from "js-yaml";

interface DashboardSwitchProps {
  switchLabel: string;
  initialState: string;
  defaultSelected: boolean;
  deviceType: string;
  deviceAddress: string;
  deviceUID: string;
}

function jsonToYaml(json: object): string {
  try {
    const yamlStr = jsYaml.dump(json);
    return yamlStr;
  } catch (e) {
    console.error("Error converting JSON to YAML:", e);
    throw e;
  }
}

function yamlToJson(yamlStr: string): object {
  try {
    const jsonObj = jsYaml.load(yamlStr) as object;
    return jsonObj;
  } catch (e) {
    console.error("Error converting YAML to JSON:", e);
    throw e;
  }
}

export default function DashboardSwitch({
  switchLabel,
  defaultSelected,
  deviceType,
  deviceAddress,
  deviceUID,
}: DashboardSwitchProps) {
  // commands
  const { deviceActions, setDeviceActions } = useDeviceActionsStore();
  const [deviceCommands, setDeviceCommands] = useState("");

  function getDeviceCommandsbyUID(
    uid: string,
    deviceActions: DeviceActionsArray
  ): string {
    // console.log(uid);
    // console.log(deviceActions);
    const deviceAction = deviceActions.find(
      (deviceAction) => deviceAction.uid === uid
    );

    return deviceAction?.commands == undefined
      ? ""
      : jsonToYaml(deviceAction.commands);
  }

  useEffect(() => {
    const deviceCommands = getDeviceCommandsbyUID(deviceUID, deviceActions);
    setDeviceCommands(deviceCommands);
  }, [deviceUID, deviceActions]);

  console.log(deviceCommands);

  // switch

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
