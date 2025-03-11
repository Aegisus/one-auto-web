import { Textarea } from "@heroui/input";
import { useOutputStore } from "@/config/zustand/OutputStore";
import { useEffect, useState } from "react";

interface DashboardTextAreaProps {
  label: string;
  placeholder: string;
  defaultValue: string;
  outputId: string;
}

export default function DashboardTextArea({
  label,
  placeholder,
  defaultValue,
  outputId,
}: DashboardTextAreaProps) {
  const setOutput = useOutputStore((state) => state.setOutput);
  // const outputs = useOutputStore((state) => state.outputs);
  const output = useOutputStore((state) => state.outputs[outputId] || "");

  const [textAreaValue, setTextAreaValue] = useState(output);

  useEffect(() => {
    const newOutput = textAreaValue + output;
    setTextAreaValue(newOutput);
  }, [output]);

  // useEffect(() => {
  //   setOutput(outputId, defaultValue);
  // }, [defaultValue, outputId, setOutput]);

  // const handleChange = (value: string) => {
  //   setOutput(outputId, output + value);
  // };

  return (
    <Textarea
      className="max-w-xs"
      isClearable
      label={label}
      placeholder={placeholder}
      value={textAreaValue}
    />
  );
}
