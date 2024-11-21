"use client";
// import { useEffect } from "react";
import ListBox from "../../components/commands/listbox";
import InputArea from "../../components/commands/input";
import {
  useDeviceCommandsStore,
  useDeviceCommands,
} from "@/stores/useDeviceCommandsStore";
import { useSelectedKeysStore } from "@/config/store";
import { type DeviceCommandsArray } from "@/db/zod/zodDeviceCommandsSchema";
import type { ItemListType } from "@/components/commands/listbox";

function convertDevicesToListBoxItems(
  deviceCommands: DeviceCommandsArray
): ItemListType {
  const listBoxItems: ItemListType = deviceCommands.map((deviceCommand) => {
    return { key: deviceCommand.uid, value: deviceCommand.name };
  });

  return listBoxItems;
}
export default function DeviceCommands() {
  const { isLoading, error, isValidating } = useDeviceCommands();
  const { deviceCommands } = useDeviceCommandsStore();
  // useEffect(() => {
  //   console.log("dbDevices:", dbDevices);
  // }, [dbDevices]);
  const listBoxItems = convertDevicesToListBoxItems(deviceCommands);

  const selectedKeys = useSelectedKeysStore((state) => state.selectedKeys);

  return (
    <div className="flex gap-x-5">
      <ListBox items={listBoxItems} />
      {selectedKeys.has("") ? <h2>Please select a device</h2> : <InputArea />}
    </div>
  );
}
