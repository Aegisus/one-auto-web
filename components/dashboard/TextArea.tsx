import { Textarea } from "@heroui/input";
import { useOutputStore } from "@/config/zustand/OutputStore";
import { useEffect, useState } from "react";

interface DashboardTextAreaProps {
  label: string;
  placeholder: string;
  defaultValue: string;
  deviceUID: string;
}

export default function DashboardTextArea({
  label,
  placeholder,
  defaultValue,
  deviceUID,
}: DashboardTextAreaProps) {
  const clearOutput = useOutputStore((state) => state.clearOutput);

  // Access the "all" category for the given deviceUID
  const output = useOutputStore((state) => state.outputs[deviceUID]?.all || "");

  const [textAreaValue, setTextAreaValue] = useState(output);

  useEffect(() => {
    setTextAreaValue(output); // Update the local state when the output changes
  }, [output]);

  const handleClear = () => {
    clearOutput(deviceUID); // Clear all outputs for the deviceUID in the store
    setTextAreaValue(""); // Reset the local state
  };

  return (
    <Textarea
      className="w-full md:w-96 lg:w-[600px]"
      isClearable
      label={label}
      placeholder={placeholder}
      value={textAreaValue.replace(/\\n/g, "\n")} // Ensure newlines are rendered
      onClear={handleClear}
    />
  );
}
