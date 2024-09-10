"use client";
// import { useEffect, useState } from "react";
import ListBox from "../../components/commands/listbox";
import InputArea from "../../components/commands/input";

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

const DeviceCommands = () => {
  //   const [data, setData] = useState<Record<string, Device> | null>(null);

  return (
    <div className="flex gap-x-5">
      <ListBox items={deviceList} />
      <InputArea />
    </div>
  );
};

export default DeviceCommands;
