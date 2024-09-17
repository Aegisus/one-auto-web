"use client";
// import { useEffect, useState } from "react";
import ListBox from "../../components/commands/listbox";
import InputArea from "../../components/commands/input";
import { Button, ButtonGroup } from "@nextui-org/button";
import { runScript } from "@/app/api/flaskAPI/commands/get/route";

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

export default function DeviceCommands() {
  //   const [data, setData] = useState<Record<string, Device> | null>(null);
  const handleRunScript = async () => {
    try {
      const result = await runScript();
      console.log(result); // You can now use the result
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <div className="flex gap-x-5">
      <ListBox items={deviceList} />
      <InputArea />
      <Button onClick={handleRunScript}>Button</Button>
    </div>
  );
}
