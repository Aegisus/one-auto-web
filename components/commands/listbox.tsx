"use client";
import { useState, useMemo } from "react";
import { Listbox, ListboxItem } from "@nextui-org/listbox";
import { useSelectedKeysStore } from "../../config/store";

type ItemListType = {
  key: string;
  value: string;
}[];

export default function ListBox({ items }: { items: ItemListType }) {
  // const [selectedKeys, setSelectedKeys] = useState(new Set([""]));
  const selectedKeys = useSelectedKeysStore((state) => state.selectedKeys);
  const setSelectedKeys = useSelectedKeysStore(
    (state) => state.setSelectedKeys
  );

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
              {item.value}
            </ListboxItem>
          )}
        </Listbox>
      </div>
    </div>
  );
}
