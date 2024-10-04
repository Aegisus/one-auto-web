"use client";
import { useEffect } from "react";
import ListBox from "../../components/commands/listbox";
import InputArea from "../../components/commands/input";
// import { Button, ButtonGroup } from "@nextui-org/button";
import {
  useDBDeviceStore,
  useDBDevices,
  // fetchDevices,
} from "@/stores/useDeviceStore";
import { type DBDevicesArray } from "@/db/zodDBDeviceSchema";
import type { ItemListType } from "@/components/commands/listbox";
// import {
//   type ComportDeviceType,
//   type PyvisaDeviceType,
// } from "@/db/zodDeviceSchema";

const deviceList = [
  {
    key: "CQT_Laser_driver_QO_024",
    value: "Laser_driver",
  },
  {
    key: "Centre_for_Quantum_Technologies_VOA_Driver_VOAD-QO05",
    value: "VOA_Driver",
  },
];

// const dbDevices: DBDevicesArray = [
//   {
//     id: 1,
//     name: "Laser driver",
//     description: "LDC from CQT. Supplies current",
//     data: {
//       com_port: "ttyUSB0",
//       ID_MODEL: "Laser_driver",
//       ID_SERIAL: "CQT_Laser_driver_QO_024",
//       ID_FROM_DATABASE: "FT232 Serial (UART) IC",
//     },
//     created_at: null,
//     updated_at: null,
//   },
// ];

function convertDevicesToListBoxItems(dbDevices: DBDevicesArray): ItemListType {
  const listBoxItems: ItemListType = dbDevices.map((device) => {
    const { data, name } = device;
    let key = "";
    let value = name;

    if ("IDN" in data) {
      key = data.IDN;
    } else if ("ID_SERIAL" in data) {
      key = data.ID_SERIAL;
    }

    return { key, value };
  });

  return listBoxItems;
}

export default function DeviceCommands() {
  const { isLoading, error, isValidating } = useDBDevices();
  const { dbDevices } = useDBDeviceStore();
  useEffect(() => {
    console.log("dbDevices:", dbDevices);
  }, [dbDevices]);
  const listBoxItems = convertDevicesToListBoxItems(dbDevices);

  // useEffect(() => {
  //   console.log("useDBDevices:", { isLoading, error, isValidating });
  //   console.log("useDBDeviceStore:", dbDevices);
  // }, [isLoading, error, isValidating, dbDevices]);

  // useEffect(() => {
  //   async function getDevices() {
  //     const devices = await fetchDevices();
  //     console.log("Fetched Devices:", devices);
  //   }
  //   getDevices();
  // }, []);

  return (
    <div className="flex gap-x-5">
      <ListBox items={listBoxItems} />
      <InputArea />
    </div>
  );
}
