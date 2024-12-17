"use client";
import { useEffect, useMemo, useState } from "react";
import { Button } from "@nextui-org/button";
import { Input } from "@nextui-org/input";
import { Form } from "@nextui-org/form";
import { SendCommands } from "@/stores/useSendCommandsStore";
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
} from "@nextui-org/dropdown";
import { Textarea } from "@nextui-org/input";

export default function SendCommandsPage() {
  const [submitted, setSubmitted] = useState<any>(null);
  const [response, setResponse] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [selectedKeys, setSelectedKeys] = useState<Set<string>>(
    new Set(["comport"])
  );

  const selectedValue = useMemo(
    () => Array.from(selectedKeys).join(", ").replace(/_/g, ""),
    [selectedKeys]
  );

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData.entries()) as {
      address: string;
      command: string;
    };

    try {
      const result = await SendCommands({
        address: data.address,
        content: data.command,
        deviceType: selectedValue,
      });
      setResponse(result);
      setError(null);
    } catch (err: any) {
      setError(err.message);
      setResponse(null);
    }

    setSubmitted(data);
  };

  const handleSelectionChange = (keys: "all" | Set<React.Key>) => {
    setSelectedKeys(new Set(keys as Set<string>));
  };

  return (
    <div className="flex justify-center gap-10">
      <Form
        className="w-full max-w-xs"
        validationBehavior="native"
        onSubmit={onSubmit}
      >
        <Input
          isRequired
          label="Address"
          labelPlacement="outside"
          name="address"
          placeholder="Enter your port or pyvisa address"
          type="text"
        />

        <Input
          isRequired
          label="Command"
          labelPlacement="outside"
          name="command"
          placeholder="Enter serial command"
          type="text"
        />

        <Dropdown>
          <DropdownTrigger>
            <Button className="capitalize" variant="bordered">
              {selectedValue}
            </Button>
          </DropdownTrigger>
          <DropdownMenu
            disallowEmptySelection
            aria-label="Device type"
            selectedKeys={selectedKeys}
            selectionMode="single"
            variant="solid"
            onSelectionChange={handleSelectionChange}
          >
            <DropdownItem key="comport">Comport</DropdownItem>
            <DropdownItem key="pyvisa">Pyvisa</DropdownItem>
          </DropdownMenu>
        </Dropdown>

        <Button type="submit" variant="bordered">
          Submit
        </Button>
        {submitted && (
          <div className="text-small text-default-500">
            You submitted: <code>{JSON.stringify(submitted)}</code>
          </div>
        )}
        {response && (
          <div className="text-small text-default-500">
            Device response: <code>{JSON.stringify(response)}</code>
          </div>
        )}
        {error && (
          <div className="text-small text-error-500">
            Error: <code>{error}</code>
          </div>
        )}
      </Form>
      <Textarea
        className="max-w-md"
        label="Device Response"
        placeholder="You will see device responses here"
        value={response ? JSON.stringify(response) : ""}
      />
    </div>
  );
}
