"use client";
import { useEffect, useState } from "react";
import ListBox from "../../components/device/listbox";
import FunctionsInputArea from "../../components/device/functionsInput";
import CommandsInputArea from "../../components/device/commandsInput";
import { Button } from "@nextui-org/button";
import {
  useDeviceActionsStore,
  useDeviceActions,
  updateFunctions,
  updateCommands,
} from "@/stores/useDeviceActionsStore";
import { useSelectedKeysStore } from "@/config/store";
import { type DeviceActionsArray } from "@/db/zod/zodDeviceActionsSchema";
import type { ItemListType } from "@/components/device/listbox";
import Notifications from "@/components/device/notifications";
import * as jsYaml from "js-yaml";

function convertDevicesToListBoxItems(
  deviceActions: DeviceActionsArray
): ItemListType {
  const listBoxItems: ItemListType = deviceActions.map((deviceAction) => {
    return { key: deviceAction.uid, value: deviceAction.name };
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

function getDeviceFunctionsbyUID(
  uid: string,
  deviceActions: DeviceActionsArray
): string {
  // console.log(uid);
  // console.log(deviceActions);
  const deviceAction = deviceActions.find(
    (deviceAction) => deviceAction.uid === uid
  );

  return deviceAction?.functions == undefined
    ? ""
    : jsonToYaml(deviceAction.functions);
}

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

export default function DeviceActions() {
  const [notification, setNotification] = useState<{
    type: "success" | "fail" | "warning";
    content: string;
  } | null>(null);

  const handleCloseNotification = () => {
    setNotification(null);
  };

  const handleUpdateFunctions = async () => {
    try {
      await updateFunctions(selectedKeysString, yamlToJson(deviceFunctions));
      setNotification({
        type: "success",
        content: "Functions updated successfully",
      });
    } catch (error) {
      setNotification({ type: "fail", content: "Failed to update Functions" });
    }
  };

  const handleUpdateCommands = async () => {
    try {
      await updateCommands(selectedKeysString, yamlToJson(deviceCommands));
      setNotification({
        type: "success",
        content: "Commands updated successfully",
      });
    } catch (error) {
      setNotification({ type: "fail", content: "Failed to update Commands" });
    }
  };

  const { isLoading, error, isValidating } = useDeviceActions();
  const { deviceActions } = useDeviceActionsStore();
  // useEffect(() => {
  //   console.log("deviceActions database:", deviceActions);
  // }, [deviceActions]);
  const listBoxItems = convertDevicesToListBoxItems(deviceActions);

  // selected device uid
  const selectedKeys = useSelectedKeysStore((state) => state.selectedKeys);
  const selectedKeysString = Array.from(selectedKeys).join(", ");

  // get single object by device uid
  const [deviceFunctions, setDeviceFunctions] = useState("");
  const [deviceCommands, setDeviceCommands] = useState("");

  useEffect(() => {
    const deviceFunctions = getDeviceFunctionsbyUID(
      selectedKeysString,
      deviceActions
    );
    setDeviceFunctions(deviceFunctions);
  }, [selectedKeysString, deviceActions]);

  useEffect(() => {
    const deviceCommands = getDeviceCommandsbyUID(
      selectedKeysString,
      deviceActions
    );
    setDeviceCommands(deviceCommands);
  }, [selectedKeysString, deviceActions]);

  // useEffect(() => {
  //   console.log(selectedKeysString);
  // }, [selectedKeysString]);

  return (
    <div className="flex gap-x-5">
      <ListBox items={listBoxItems} />
      {selectedKeys.has("") ? (
        <h2>Please select a device</h2>
      ) : (
        <div className="w-full">
          <FunctionsInputArea
            functions={deviceFunctions}
            setFunctions={setDeviceFunctions}
          />
          <div className="flex justify-center mb-5">
            <Button onClick={handleUpdateFunctions} className="w-46">
              Save
            </Button>
          </div>
          <CommandsInputArea
            commands={deviceCommands}
            setCommands={setDeviceCommands}
          />
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
