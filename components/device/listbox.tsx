"use client";
import { ReactNode, useState, useMemo } from "react";
import { Listbox, ListboxSection, ListboxItem } from "@heroui/listbox";
import { useSelectedKeysStore } from "../../config/store";

export type ItemListType = {
  key: string;
  value: string;
}[];

export const ListboxWrapper = ({ children }: { children: ReactNode }) => (
  <div className="w-[260px] border-small px-1 py-2 rounded-small border-default-200 dark:border-default-100">
    {children}
  </div>
);

export default function ListBox({
  items,
  title,
}: {
  items: ItemListType;
  title: string;
}) {
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
      <ListboxWrapper>
        <Listbox
          aria-label="Single selection example"
          variant="flat"
          disallowEmptySelection
          selectionMode="single"
          selectedKeys={selectedKeys}
          onSelectionChange={handleSelectionChange}
          onAction={(key) => alert(key)}
        >
          <ListboxSection title={title}>
            {items.map((item) => (
              <ListboxItem key={item.key}>{item.value}</ListboxItem>
            ))}
          </ListboxSection>
        </Listbox>
      </ListboxWrapper>
    </div>
  );
}
