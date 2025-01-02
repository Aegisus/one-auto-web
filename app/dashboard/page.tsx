"use client";

import React, { useEffect, useState } from "react";
import yaml from "js-yaml";
import { useDeviceActions } from "@/stores/useDeviceActionsStore";

const DashboardPage: React.FC = () => {
  const { data: deviceActions, isLoading, error } = useDeviceActions();
  const [deviceStates, setDeviceStates] = useState<{
    [key: string]: "loop" | "set";
  }>({});

  const handleToggleState = (deviceName: string) => {
    setDeviceStates((prevStates) => ({
      ...prevStates,
      [deviceName]: prevStates[deviceName] === "set" ? "loop" : "set",
    }));
  };

  useEffect(() => {
    if (deviceActions && !isLoading && !error) {
      try {
        const parsedActions = Array.isArray(deviceActions)
          ? deviceActions
          : yaml.load(deviceActions);

        if (!Array.isArray(parsedActions)) {
          console.error("Parsed actions are not in an array format.");
          return;
        }

        // Initialize deviceStates with "set" for each device
        const initialDeviceStates = parsedActions.reduce(
          (acc: any, action: any) => {
            acc[action.name] = "set";
            return acc;
          },
          {}
        );
        setDeviceStates(initialDeviceStates);
      } catch (err) {
        console.error("Error parsing actions:", err);
      }
    }
  }, [deviceActions, isLoading, error]);

  const GeneratedComponent: React.FC = () => {
    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      const formData = new FormData(e.currentTarget);
      const payload = Object.fromEntries(formData.entries());
      console.log("Submitted Data:", payload);
    };

    const parsedActions = Array.isArray(deviceActions)
      ? deviceActions
      : yaml.load(deviceActions);

    if (!Array.isArray(parsedActions)) {
      console.error("Parsed actions are not in an array format.");
      return null;
    }

    return (
      <div>
        <h2 className="text-xl font-semibold mb-4">Device Actions Dashboard</h2>
        {parsedActions.map((action: any, index: number) => (
          <div key={index} className="mb-6">
            <h3 className="font-bold text-lg mb-2">{action.name}</h3>
            <button
              onClick={() => handleToggleState(action.name)}
              className="mb-4"
            >
              Toggle State (Current: {deviceStates[action.name]})
            </button>
            <form onSubmit={handleSubmit} className="space-y-4">
              {action.functions.variables &&
                Object.entries(action.functions.variables).map(
                  ([variableName, variableValue]: [string, any]) => {
                    return (
                      <div key={variableName}>
                        <label
                          htmlFor={variableName}
                          className="block text-sm font-medium text-gray-700"
                        >
                          {variableName}
                        </label>
                        {variableName === "limits" &&
                        typeof variableValue === "object" &&
                        variableValue !== null &&
                        "lower" in variableValue &&
                        "upper" in variableValue ? (
                          <div className="flex justify-center gap-x-3">
                            <input
                              type="number"
                              id="lower"
                              name="lower"
                              defaultValue={variableValue.lower}
                              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                            />
                            <input
                              type="number"
                              id="upper"
                              name="upper"
                              defaultValue={variableValue.upper}
                              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                            />
                          </div>
                        ) : (
                          <input
                            type="text"
                            id={variableName}
                            name={variableName}
                            defaultValue={variableValue}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                          />
                        )}
                      </div>
                    );
                  }
                )}
              {deviceStates[action.name] === "set" ? (
                <div>
                  <label
                    htmlFor="Value"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Value
                  </label>
                  <input
                    type="text"
                    id="value"
                    name="value"
                    //   defaultValue={variableValue}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  />
                </div>
              ) : (
                <div>
                  <label
                    htmlFor="Start"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Start
                  </label>
                  <input
                    type="number"
                    id="start"
                    name="start"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  />
                  <label
                    htmlFor="End"
                    className="block text-sm font-medium text-gray-700"
                  >
                    End
                  </label>
                  <input
                    type="number"
                    id="end"
                    name="end"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  />
                  <label
                    htmlFor="Delay"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Delay
                  </label>
                  <input
                    type="number"
                    id="delay"
                    name="Delay"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  />
                  <label
                    htmlFor="Step Size"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Step Size
                  </label>
                  <input
                    type="number"
                    id="step_size"
                    name="step_size"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  />
                </div>
              )}
              <button
                type="submit"
                className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                Submit
              </button>
            </form>
          </div>
        ))}
      </div>
    );
  };

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Error loading device actions: {error.message}</p>;

  return (
    <div className="dashboard-layout">
      <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
      <GeneratedComponent />
    </div>
  );
};

export default DashboardPage;
