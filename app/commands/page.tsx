"use client";
import { useEffect, useState } from "react";
import ListBox from "../../components/commands/listbox";
import InputArea from "../../components/commands/input";
import { Button } from "@nextui-org/button";
import {
  useDeviceCommandsStore,
  useDeviceCommands,
  updateCommands,
} from "@/stores/useDeviceCommandsStore";
import { useSelectedKeysStore } from "@/config/store";
import { type DeviceCommandsArray } from "@/db/zod/zodDeviceCommandsSchema";
import type { ItemListType } from "@/components/commands/listbox";
import Notifications from "@/components/commands/notifications";
import * as jsYaml from "js-yaml";

function convertDevicesToListBoxItems(
  deviceCommands: DeviceCommandsArray
): ItemListType {
  const listBoxItems: ItemListType = deviceCommands.map((deviceCommand) => {
    return { key: deviceCommand.uid, value: deviceCommand.name };
  });

  return listBoxItems;
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

function getDeviceCommandbyUID(
  uid: string,
  deviceCommands: DeviceCommandsArray
): string {
  // console.log(uid);
  // console.log(deviceCommands);
  const deviceCommand = deviceCommands.find(
    (deviceCommand) => deviceCommand.uid === uid
  );

  return deviceCommand?.commands == undefined
    ? ""
    : jsonToYaml(deviceCommand.commands);
}

export default function DeviceCommands() {
  const [notification, setNotification] = useState<{
    type: "success" | "fail" | "warning";
    content: string;
  } | null>(null);

  const handleUpdateCommands = async () => {
    try {
      await updateCommands(selectedKeysString, yamlToJson(deviceCommand));
      setNotification({
        type: "success",
        content: "Commands updated successfully",
      });
    } catch (error) {
      setNotification({ type: "fail", content: "Failed to update commands" });
    }
  };

  const handleCloseNotification = () => {
    setNotification(null);
  };

  const { isLoading, error, isValidating } = useDeviceCommands();
  const { deviceCommands } = useDeviceCommandsStore();
  // useEffect(() => {
  //   console.log("deviceCommands database:", deviceCommands);
  // }, [deviceCommands]);
  const listBoxItems = convertDevicesToListBoxItems(deviceCommands);

  // selected device uid
  const selectedKeys = useSelectedKeysStore((state) => state.selectedKeys);
  const selectedKeysString = Array.from(selectedKeys).join(", ");

  // get single object by device uid
  const [deviceCommand, setDeviceCommand] = useState("");

  useEffect(() => {
    const command = getDeviceCommandbyUID(selectedKeysString, deviceCommands);
    setDeviceCommand(command);
  }, [selectedKeysString, deviceCommands]);

  useEffect(() => {
    console.log(selectedKeysString);
  }, [selectedKeysString]);

  return (
    <div className="flex gap-x-5">
      <ListBox items={listBoxItems} />
      {selectedKeys.has("") ? (
        <h2>Please select a device</h2>
      ) : (
        <div className="w-full">
          <InputArea commands={deviceCommand} setCommands={setDeviceCommand} />
          <div className="flex justify-center">
            <Button onClick={handleUpdateCommands} className="w-46">
              Save
            </Button>
          </div>
        </div>
      )}
      {notification && (
        <Notifications
          type={notification.type}
          content={notification.content}
          onClose={handleCloseNotification}
        />
      )}
    </div>
  );
}
