"use client";
import { useEffect, useState } from "react";
import ListBox from "../../components/device/listbox";
import InputArea from "../../components/device/functionInput";
import { Button } from "@nextui-org/button";
import {
  useDeviceFunctionsStore,
  useDeviceFunctions,
  updateFunctions,
} from "@/stores/useDeviceFunctionsStore";
import { useSelectedKeysStore } from "@/config/store";
import { type DeviceFunctionsArray } from "@/db/zod/zodDeviceFunctionsSchema";
import type { ItemListType } from "@/components/device/listbox";
import Notifications from "@/components/device/notifications";
import * as jsYaml from "js-yaml";

function convertDevicesToListBoxItems(
  deviceFunctions: DeviceFunctionsArray
): ItemListType {
  const listBoxItems: ItemListType = deviceFunctions.map((deviceFunction) => {
    return { key: deviceFunction.uid, value: deviceFunction.name };
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
  deviceFunctions: DeviceFunctionsArray
): string {
  // console.log(uid);
  // console.log(deviceFunctions);
  const deviceFunction = deviceFunctions.find(
    (deviceFunction) => deviceFunction.uid === uid
  );

  return deviceFunction?.functions == undefined
    ? ""
    : jsonToYaml(deviceFunction.functions);
}

export default function DeviceFunctions() {
  const [notification, setNotification] = useState<{
    type: "success" | "fail" | "warning";
    content: string;
  } | null>(null);

  const handleUpdateFunctions = async () => {
    try {
      await updateFunctions(selectedKeysString, yamlToJson(deviceFunction));
      setNotification({
        type: "success",
        content: "Functions updated successfully",
      });
    } catch (error) {
      setNotification({ type: "fail", content: "Failed to update functions" });
    }
  };

  const handleCloseNotification = () => {
    setNotification(null);
  };

  const { isLoading, error, isValidating } = useDeviceFunctions();
  const { deviceFunctions } = useDeviceFunctionsStore();
  // useEffect(() => {
  //   console.log("deviceFunctions database:", deviceFunctions);
  // }, [deviceFunctions]);
  const listBoxItems = convertDevicesToListBoxItems(deviceFunctions);

  // selected device uid
  const selectedKeys = useSelectedKeysStore((state) => state.selectedKeys);
  const selectedKeysString = Array.from(selectedKeys).join(", ");

  // get single object by device uid
  const [deviceFunction, setDeviceFunction] = useState("");

  useEffect(() => {
    const deviceFunction = getDeviceFunctionsbyUID(
      selectedKeysString,
      deviceFunctions
    );
    setDeviceFunction(deviceFunction);
  }, [selectedKeysString, deviceFunctions]);

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
          <InputArea
            functions={deviceFunction}
            setFunctions={setDeviceFunction}
          />
          <div className="flex justify-center">
            <Button onClick={handleUpdateFunctions} className="w-46">
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
