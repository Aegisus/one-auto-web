import { Textarea } from "@heroui/input";

interface DashboardTextAreaProps {
  label: string;
  placeholder: string;
  defaultValue: string;
}

export default function DashboardTextArea({
  label,
  placeholder,
  defaultValue,
}: DashboardTextAreaProps) {
  return (
    <Textarea
      className="max-w-xs"
      isClearable
      label={label}
      placeholder={placeholder}
      defaultValue={defaultValue}
    />
  );
}
