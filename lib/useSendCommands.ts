import { useState, useMemo } from "react";
import { SendCommands } from "@/stores/useSendCommandsStore";

export const useSendCommands = () => {
  const [submitted, setSubmitted] = useState<any>(null);
  const [response, setResponse] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [selectedKeys, setSelectedKeys] = useState<Set<string>>(new Set());

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

  return {
    submitted,
    response,
    error,
    selectedKeys,
    setSelectedKeys,
    onSubmit,
  };
};
