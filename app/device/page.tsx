"use client";
import { useEffect, useState } from "react";
import ListBox from "../../components/device/listbox";
import FunctionsInputArea from "../../components/device/functionsInput";
import CommandsInputArea from "../../components/device/commandsInput";
import LayoutInputArea from "../../components/device/layoutInput";
import { Button } from "@heroui/button";
import {
  useDeviceActionsStore,
  useDeviceActions,
  updateFunctions,
  updateCommands,
  updateLayout,
} from "@/stores/useDeviceActionsStore";
import { useSelectedKeysStore } from "@/config/zustand/ListboxKeys";
import {
  type DeviceActionsArray,
  type DynamicObjectArray,
} from "@/db/zod/zodDeviceActionsSchema";
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

function getDeviceLayoutbyUID(
  uid: string,
  deviceActions: DeviceActionsArray
): string {
  // console.log(uid);
  // console.log(deviceActions);
  const deviceAction = deviceActions.find(
    (deviceAction) => deviceAction.uid === uid
  );

  return deviceAction?.layout == undefined
    ? ""
    : jsonToYaml(deviceAction.layout);
}

export default function DeviceActions() {
  const [notification, setNotification] = useState<{
    type: "success" | "fail" | "warning";
    content: string;
  } | null>(null);

  const handleCloseNotification = () => {
    setNotification(null);
  };

  const { isLoading, error, isValidating } = useDeviceActions();
  const { deviceActions, setDeviceActions } = useDeviceActionsStore();

  const handleUpdateFunctions = async () => {
    try {
      const updatedFunctions = yamlToJson(
        deviceFunctions
      ) as DynamicObjectArray;

      await updateFunctions(selectedKeysString, updatedFunctions);

      const updatedDeviceActions = deviceActions.map((deviceAction) => {
        if (deviceAction.uid === selectedKeysString) {
          return { ...deviceAction, functions: updatedFunctions };
        }
        return deviceAction;
      });

      setDeviceActions(updatedDeviceActions);

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
      const updatedCommands = yamlToJson(deviceCommands) as DynamicObjectArray;

      await updateCommands(selectedKeysString, updatedCommands);

      const updatedDeviceActions = deviceActions.map((deviceAction) => {
        if (deviceAction.uid === selectedKeysString) {
          return { ...deviceAction, commands: updatedCommands };
        }
        return deviceAction;
      });

      setDeviceActions(updatedDeviceActions);

      setNotification({
        type: "success",
        content: "Commands updated successfully",
      });
    } catch (error) {
      setNotification({ type: "fail", content: "Failed to update Commands" });
    }
  };

  const handleUpdateLayout = async () => {
    try {
      const updatedLayout = yamlToJson(deviceLayout) as DynamicObjectArray;

      await updateLayout(selectedKeysString, updatedLayout);

      const updatedDeviceActions = deviceActions.map((deviceAction) => {
        if (deviceAction.uid === selectedKeysString) {
          return { ...deviceAction, layout: updatedLayout };
        }
        return deviceAction;
      });

      setDeviceActions(updatedDeviceActions);

      setNotification({
        type: "success",
        content: "Layout updated successfully",
      });
    } catch (error) {
      setNotification({ type: "fail", content: "Failed to update Layout" });
    }
  };

  const listBoxItems = convertDevicesToListBoxItems(deviceActions);

  // selected device uid
  const selectedKeys = useSelectedKeysStore((state) => state.selectedKeys);
  const selectedKeysString = Array.from(selectedKeys).join(", ");

  // get single object by device uid
  const [deviceFunctions, setDeviceFunctions] = useState("");
  const [deviceCommands, setDeviceCommands] = useState("");
  const [deviceLayout, setDeviceLayout] = useState("");

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

  useEffect(() => {
    const deviceLayout = getDeviceLayoutbyUID(
      selectedKeysString,
      deviceActions
    );
    setDeviceLayout(deviceLayout);
  }, [selectedKeysString, deviceActions]);

  // useEffect(() => {
  //   console.log(selectedKeysString);
  // }, [selectedKeysString]);

  return (
    <div className="py-6 space-y-6">
      <h1 className="text-2xl font-bold">Device Configuration</h1>
      <div className="flex gap-x-5">
        <ListBox items={listBoxItems} title={"Devices"} />
        {selectedKeys.has("") ? (
          <h2>Please select a device</h2>
        ) : (
          <div className="w-full">
            <FunctionsInputArea
              functions={deviceFunctions}
              setFunctions={setDeviceFunctions}
            />
            <div className="flex justify-center mb-5">
              <Button onPress={handleUpdateFunctions} className="w-46">
                Save
              </Button>
            </div>
            <CommandsInputArea
              commands={deviceCommands}
              setCommands={setDeviceCommands}
            />
            <div className="flex justify-center mb-5">
              <Button onPress={handleUpdateCommands} className="w-46">
                Save
              </Button>
            </div>
            <LayoutInputArea
              layout={deviceLayout}
              setLayout={setDeviceLayout}
            />
            <div className="flex justify-center">
              <Button onPress={handleUpdateLayout} className="w-46">
                Save
              </Button>
            </div>
          </div>
        )}
      </div>
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
