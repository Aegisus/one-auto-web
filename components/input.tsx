import { Textarea } from "@nextui-org/input";

export default function InputArea() {
  return (
    <div className="flex w-full flex-wrap md:flex-nowrap mb-6 md:mb-0 gap-4">
      <Textarea
        // minRows={2}
        maxRows={30}
        label="Commands"
        placeholder="Enter your device commands with YAML format"
      />
    </div>
  );
}
