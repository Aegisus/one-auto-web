import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
} from "@heroui/dropdown";
import { Button } from "@heroui/button";

interface DropdownItemProps {
  key: string;
  label: string;
}

interface DropdownMenuProps {
  items: DropdownItemProps[];
  buttonLabel: string;
}

export default function DashboardDropdown({
  items,
  buttonLabel,
}: DropdownMenuProps) {
  return (
    <Dropdown>
      <DropdownTrigger>
        <Button variant="bordered">{buttonLabel}</Button>
      </DropdownTrigger>
      <DropdownMenu aria-label="Dynamic Actions" items={items}>
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
  );
}
