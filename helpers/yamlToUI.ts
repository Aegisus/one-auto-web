import yaml from "js-yaml";
import fs from "fs";

// Function to convert YAML to React form
const yamlToReactForm = (yamlFilePath: string): string => {
  const yamlData: any = yaml.load(fs.readFileSync(yamlFilePath, "utf8"));

  const generateFormFields = (variables: Record<string, any>): string => {
    return Object.entries(variables)
      .map(([key, value]) => {
        if (value.options) {
          // Generate a dropdown field
          return `
            <label htmlFor="${key}" className="block text-sm font-medium text-gray-700">${key}</label>
            <select id="${key}" name="${key}" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm">
              ${value.options
                .map(
                  (option: string) =>
                    `<option value="${option}">${option}</option>`
                )
                .join("")}
            </select>
          `;
        } else {
          // Generate a text input field
          return `
            <label htmlFor="${key}" className="block text-sm font-medium text-gray-700">${key}</label>
            <input type="text" id="${key}" name="${key}" defaultValue="${
            value.value || ""
          }" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" />
          `;
        }
      })
      .join("");
  };

  return `
    import React from 'react';

    const DeviceForm: React.FC = () => {
      const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const payload = Object.fromEntries(formData.entries());
        console.log('Submitted Data:', payload);
        // Add your API call here to process the payload
      };

      return (
        <div className="max-w-lg mx-auto p-4">
          <h1 className="text-2xl font-bold mb-4">${yamlData.device}</h1>
          <form onSubmit={handleSubmit} className="space-y-4">
            ${generateFormFields(yamlData.variables)}
            <button type="submit" className="bg-indigo-500 text-white px-4 py-2 rounded-md hover:bg-indigo-600">
              Submit
            </button>
          </form>
        </div>
      );
    };

    export default DeviceForm;
  `;
};

// Generate React form component
const reactComponent = yamlToReactForm("path/to/device.yaml");
fs.writeFileSync("DeviceForm.tsx", reactComponent);
console.log("Generated DeviceForm.tsx");
