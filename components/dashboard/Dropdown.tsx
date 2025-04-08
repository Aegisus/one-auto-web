import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
} from "@heroui/dropdown";
import { Button } from "@heroui/button";
import { useMultiDropdownStore } from "@/config/zustand/DropdownKeys"; // Import the new Zustand store
import { SendCommands } from "@/stores/useSendCommandsStore";
import { useOutputStore } from "@/config/zustand/OutputStore";
import { useEffect, useState } from "react";
import { executeFunctionSteps } from "@/lib/executeFunctionHelper";
import { useDeviceExecutionStore } from "@/stores/useDeviceFunctionGetStore";

interface DropdownItemProps {
  key: string;
  label: string;
}

interface DropdownMenuProps {
  dropdownID: string;
  items: DropdownItemProps[];
  initialSelectedItem: string;
  deviceAddress: string;
  deviceType: string;
  deviceUID: string;
  title: string;
  layoutExeFunction: string;
}

export default function DashboardDropdown({
  dropdownID,
  items,
  initialSelectedItem,
  deviceAddress,
  deviceType,
  deviceUID,
  title,
  layoutExeFunction,
}: DropdownMenuProps) {
  const addOutput = useOutputStore((state) => state.addOutput);
  const [error, setError] = useState<string | null>(null);

  const { dropdowns, setDropdownKeys } = useMultiDropdownStore(); // Use new Zustand store
  const dropdownSelectedKeys = dropdowns[dropdownID] || new Set();

  const selectedValue = Array.from(dropdownSelectedKeys)
    .join(", ")
    .replace(/_/g, "");

  // Access store
  const { exeFunctions, fetchDeviceExeFunctions, setDeviceUID } =
    useDeviceExecutionStore();

  // Set the deviceUID in the zustand store when the component mounts or updates
  useEffect(() => {
    setDeviceUID(deviceUID);
    fetchDeviceExeFunctions();
  }, [deviceUID, setDeviceUID, fetchDeviceExeFunctions]);

  const set_wavelength = async (value: string, deviceAddress: string) => {
    try {
      const func = exeFunctions[layoutExeFunction];
      if (func) {
        executeFunctionSteps(
          deviceUID,
          deviceAddress,
          func,
          deviceType,
          setError,
          value
        );
      } else {
        console.log(
          "Cannnot find function. Layout exeFunction: " + layoutExeFunction
        );
      }
      // addOutput(deviceUID, `Wavelength set result: ${JSON.stringify(result)}`);
      // checkwave_length(deviceAddress);
      setError(null);
    } catch (err: any) {
      setError(err.message);
      addOutput(deviceUID + "|set_wavelength", JSON.stringify(err.message)); // Set output with error details
    }
  };

  // const checkwave_length = async (deviceAddress: string) => {
  //   const data = {
  //     address: deviceAddress,
  //     command: `SENS:CORR:WAV?`, // Command to set wavelength
  //   };
  //   try {

  //     const func = exeFunctions[layoutExeFunction];
  //     if (func) {
  //       executeFunctionSteps(
  //         deviceUID,
  //         deviceAddress,
  //         func,
  //         deviceType,
  //         setError
  //       );
  //     } else {
  //       console.log(
  //         "Cannnot find function. Layout exeFunction: " + layoutExeFunction
  //       );
  //     }

  //     addOutput(
  //       deviceUID + "|check_wavelength",
  //       `Wavelength set result: ${JSON.stringify(result)}`
  //     );
  //     setError(null);
  //   } catch (err: any) {
  //     setError(err.message);
  //     addOutput(deviceUID + "|check_wavelength", JSON.stringify(err.message)); // Set output with error details
  //   }
  // };

  useEffect(() => {
    if (!dropdownSelectedKeys.size && initialSelectedItem && deviceAddress) {
      setDropdownKeys(dropdownID, new Set([initialSelectedItem]));
      set_wavelength(initialSelectedItem, deviceAddress); // Set wavelength for initialSelectedItem
    }
  }, [dropdownID, initialSelectedItem, setDropdownKeys, dropdownSelectedKeys]);

  const handleSelectionChange = (keys: any) => {
    const newSelectedValue = Array.from(keys).join(", ").replace(/_/g, "");
    setDropdownKeys(dropdownID, new Set(keys));
    set_wavelength(newSelectedValue, deviceAddress); // Set wavelength for the newly selected value
  };

  return (
    <div>
      <h2 className="text-lg mb-2 font-semibold">{title}</h2>
      <Dropdown>
        <DropdownTrigger>
          <Button variant="bordered" className="capitalize">
            {selectedValue ? selectedValue : initialSelectedItem}
          </Button>
        </DropdownTrigger>
        <DropdownMenu
          disallowEmptySelection
          aria-label="Pick your choice"
          items={items}
          selectionMode="single"
          selectedKeys={dropdownSelectedKeys}
          onSelectionChange={handleSelectionChange}
        >
          {(item) => (
            <DropdownItem
              key={item.key}
              className={item.key === "delete" ? "text-danger" : ""}
              color={item.key === "delete" ? "danger" : "default"}
            >
              {item.label}
            </DropdownItem>
          )}
        </DropdownMenu>
      </Dropdown>
    </div>
  );
}
