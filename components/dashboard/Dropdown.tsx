import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
} from "@heroui/dropdown";
// import type { Selection } from "@heroui/select";
import { Button } from "@heroui/button";
import { useState, useMemo } from "react";

interface DropdownItemProps {
  key: string;
  label: string;
}

interface DropdownMenuProps {
  items: DropdownItemProps[];
  initialSelectedItem: string;
  title: string;
}

export default function DashboardDropdown({
  items,
  initialSelectedItem,
  title,
}: DropdownMenuProps) {
  const [selectedKeys, setSelectedKeys] = useState(
    new Set([initialSelectedItem])
  );

  const selectedValue = useMemo(
    () => Array.from(selectedKeys).join(", ").replace(/_/g, ""),
    [selectedKeys]
  );

  const handleSelectionChange = (keys: any) => {
    setSelectedKeys(new Set(keys));
  };

  return (
    <div>
      <h2 className="text-lg mb-2 font-semibold">{title}</h2>
      <Dropdown>
        <DropdownTrigger>
          <Button variant="bordered" className="capitalize">
            {selectedValue ? selectedValue : initialSelectedItem}
          </Button>
        </DropdownTrigger>
        <DropdownMenu
          disallowEmptySelection
          aria-label="Pick your choice"
          items={items}
          selectionMode="single"
          selectedKeys={selectedKeys}
          onSelectionChange={handleSelectionChange}
        >
          {(item) => (
            <DropdownItem
              key={item.key}
              className={item.key === "delete" ? "text-danger" : ""}
              color={item.key === "delete" ? "danger" : "default"}
            >
              {item.label}
            </DropdownItem>
          )}
        </DropdownMenu>
      </Dropdown>
    </div>
  );
}
