"use client";
import { useState, useMemo } from "react";
import { Listbox, ListboxItem } from "@nextui-org/listbox";

const items = [
  {
    key: "CQT_Laser_driver_QO_024",
    label: "Laser_driver",
  },
  {
    key: "Centre_for_Quantum_Technologies_VOA_Driver_VOAD-QO05",
    label: "VOA_Driver",
  },
];

export default function ListBox() {
  const [selectedKeys, setSelectedKeys] = useState(new Set(["text"]));

  const selectedValue = useMemo(
    () => Array.from(selectedKeys).join(", "),
    [selectedKeys]
  );

  const handleSelectionChange = (keys: any) => {
    setSelectedKeys(new Set(keys));
  };

  return (
    <div className="flex flex-col gap-2">
      <div className="w-[260px] border-small px-1 py-2 rounded-small border-default-200 dark:border-default-100">
        <Listbox
          aria-label="Single selection example"
          variant="flat"
          disallowEmptySelection
          selectionMode="single"
          selectedKeys={selectedKeys}
          onSelectionChange={handleSelectionChange}
          items={items}
          onAction={(key) => alert(key)}
        >
          {(item) => (
            <ListboxItem
              key={item.key}
              //   color={item.key === "delete" ? "danger" : "default"}
              //   className={item.key === "delete" ? "text-danger" : ""}
            >
              {item.label}
            </ListboxItem>
          )}
        </Listbox>
      </div>
    </div>
  );
}
