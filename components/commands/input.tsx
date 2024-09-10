import { Textarea } from "@nextui-org/input";
import { useState, useMemo } from "react";
import { useSelectedKeysStore } from "../../config/store";

export default function InputArea() {
  const selectedKeys = useSelectedKeysStore((state) => state.selectedKeys);

  const selectedValue = useMemo(
    () => Array.from(selectedKeys).join(", "),
    [selectedKeys]
  );

  return (
    <div className="flex w-full flex-wrap md:flex-nowrap mb-6 md:mb-0 gap-4">
      <Textarea
        // minRows={2}
        maxRows={30}
        label={"Commands for " + selectedValue}
        placeholder="Enter your device commands in YAML format"
      />
    </div>
  );
}
