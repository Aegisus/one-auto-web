"use client";

import DashboardRenderer from "./DashboardRender";
import { useDeviceActions } from "@/stores/useDeviceActionsStore";
import {
  type DeviceActionsType,
  type DeviceActionsArray,
  type DynamicObjectArray,
} from "@/db/zod/zodDeviceActionsSchema";
import type { ItemListType } from "@/components/device/listbox";
import ListBox from "@/components/device/listbox";
import { useSelectedKeysStore } from "@/config/zustand/ListboxKeys";

function convertDevicesToListBoxItems(
  deviceActions: DeviceActionsArray
): ItemListType {
  const listBoxItems: ItemListType = deviceActions.map((deviceAction) => {
    return { key: deviceAction.uid, value: deviceAction.name };
  });

  return listBoxItems;
}

export default function Page() {
  const { data: deviceActions, isLoading, error } = useDeviceActions();
  // selected device uid
  const selectedKeys = useSelectedKeysStore((state) => state.selectedKeys);

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Error loading device actions.</p>;

  // Extract layouts from device actions while filtering out functions and commands
  // const layouts = deviceActions
  //   ?.map((device: DeviceActionsType) => device.layout)
  //   .filter((layout) => layout !== null && layout.length > 0) // Ensure valid layouts exist
  //   .flat(); // Flatten nested arrays if any
  // console.log(layouts);

  // const layouts: NonNullable<LayoutType> = deviceActions
  // ?.map((device) => device.layout)
  // .filter((layout): layout is NonNullable<LayoutType> => layout !== null && layout.length > 0)
  // .flat();

  const layouts: DynamicObjectArray =
    deviceActions?.flatMap((device: DeviceActionsType) =>
      Array.isArray(device.layout) && device.layout.length > 0
        ? (device.layout as DynamicObjectArray)
        : []
    ) ?? [];

  // console.log(layouts);

  const listBoxItems = convertDevicesToListBoxItems(deviceActions);
  // const selectedKeysString = Array.from(selectedKeys).join(", ");
  // console.log(selectedKeysString);
  return (
    <div className="py-6 space-y-6">
      <h1 className="text-2xl font-bold">Device Dashboard</h1>

      <div className="flex gap-x-5">
        <ListBox items={listBoxItems} title={"Devices"} />
        {selectedKeys.has("") ? (
          <h2>Please select a device</h2>
        ) : layouts.length > 0 ? (
          <DashboardRenderer layouts={layouts} />
        ) : (
          <p>No layouts available.</p>
        )}
      </div>
    </div>
  );
}
