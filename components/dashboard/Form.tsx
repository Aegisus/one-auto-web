import React from "react";
import { Form } from "@heroui/form";
import { Input } from "@heroui/input";
import { Button } from "@heroui/button";

interface FormProps {
  label: string;
  placeholder: string;
  submitLabel: string;
  function: string; // This represents the function name from the data
}

const CustomForm: React.FC<FormProps> = ({
  label,
  placeholder,
  submitLabel,
  function: functionName,
}) => {
  const [submitted, setSubmitted] = React.useState(null);

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const data = Object.fromEntries(new FormData(e.currentTarget));

    setSubmitted(data);
  };
  return (
    <Form
      className="w-full max-w-xs"
      validationBehavior="native"
      onSubmit={onSubmit}
    >
      <Input
        isRequired
        errorMessage={`Please enter a valid ${label.toLowerCase()}`}
        label={label}
        labelPlacement="outside"
        name={functionName} // Name matches function key from data
        placeholder={placeholder}
        type="text"
      />

      <Button type="submit" variant="bordered">
        {submitLabel}
      </Button>
      {submitted && (
        <div className="text-small text-default-500">
          You submitted: <code>{JSON.stringify(submitted)}</code>
        </div>
      )}
    </Form>
  );
};

export default CustomForm;
