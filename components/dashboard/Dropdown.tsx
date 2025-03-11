import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
} from "@heroui/dropdown";
// import type { Selection } from "@heroui/select";
import { Button } from "@heroui/button";
import { useMultiDropdownStore } from "@/config/zustand/DropdownKeys"; // Import the new Zustand store
import { useEffect } from "react";

interface DropdownItemProps {
  key: string;
  label: string;
}

interface DropdownMenuProps {
  dropdownID: string;
  items: DropdownItemProps[];
  initialSelectedItem: string;
  title: string;
}

export default function DashboardDropdown({
  dropdownID,
  items,
  initialSelectedItem,
  title,
}: DropdownMenuProps) {
  const { dropdowns, setDropdownKeys } = useMultiDropdownStore(); // Use new Zustand store
  const dropdownSelectedKeys = dropdowns[dropdownID] || new Set();

  useEffect(() => {
    if (!dropdownSelectedKeys.size && initialSelectedItem) {
      setDropdownKeys(dropdownID, new Set([initialSelectedItem]));
    }
  }, [dropdownID, initialSelectedItem, setDropdownKeys, dropdownSelectedKeys]);

  const selectedValue = Array.from(dropdownSelectedKeys)
    .join(", ")
    .replace(/_/g, "");

  const handleSelectionChange = (keys: any) => {
    setDropdownKeys(dropdownID, new Set(keys));
  };

  // useEffect(() => {
  //   console.log(`Dropdown ${dropdownID} value:`, selectedValue);
  // }, [dropdownSelectedKeys, dropdownID, selectedValue]);

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
          selectedKeys={dropdownSelectedKeys}
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
