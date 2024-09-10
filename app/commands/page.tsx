"use client";
import { useEffect, useState } from "react";
import { createEventSource } from "../server/fetch"; // Adjust the import path as necessary
import ListBox from "../../components/listbox";
import InputArea from "../../components/input";

const DeviceCommands = () => {
  //   const [data, setData] = useState<Record<string, Device> | null>(null);

  return (
    <div className="flex gap-x-5">
      <ListBox />
      <InputArea />
    </div>
  );
};

export default DeviceCommands;
