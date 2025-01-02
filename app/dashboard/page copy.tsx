"use client";
import React, { useEffect, useState } from "react";
import yaml from "js-yaml";
import { useDeviceActions } from "@/stores/useDeviceActionsStore";

const DashboardPage: React.FC = () => {
  const { data: deviceActions, isLoading, error } = useDeviceActions();
  const [Component, setComponent] = useState<React.FC | null>(null);

  useEffect(() => {
    const createComponent = () => {
      if (deviceActions && !isLoading && !error) {
        try {
          const parsedActions = Array.isArray(deviceActions)
            ? deviceActions
            : yaml.load(deviceActions);

          if (!Array.isArray(parsedActions)) {
            console.error("Parsed actions are not in an array format.");
            return;
          }

          console.log("parsedActions:", parsedActions);

          const GeneratedComponent: React.FC = () => {
            const [activeTab, setActiveTab] = useState("set");

            const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
              e.preventDefault();
              const formData = new FormData(e.currentTarget);
              const payload = Object.fromEntries(formData.entries());
              console.log("Submitted Data:", payload);
            };

            return (
              <div>
                <h2 className="text-xl font-semibold mb-4">
                  Device Actions Dashboard
                </h2>
                <div className="tabs">
                  <button onClick={() => setActiveTab("set")}>Set</button>
                  <button onClick={() => setActiveTab("loop")}>Loop</button>
                </div>
                {parsedActions.map((action: any, index: number) => (
                  <div key={index} className="mb-6">
                    <h3 className="font-bold text-lg mb-2">{action.name}</h3>
                    <form onSubmit={handleSubmit} className="space-y-4">
                      {activeTab === "set" && action.functions.set && (
                        <div>
                          {Object.entries(
                            action.functions.set.parameters || {}
                          ).map(([paramName, paramValue]: [string, any]) => (
                            <div key={paramName}>
                              <label
                                htmlFor={paramName}
                                className="block text-sm font-medium text-gray-700"
                              >
                                {paramName}
                              </label>
                              <input
                                type="text"
                                id={paramName}
                                name={paramName}
                                defaultValue={paramValue}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                              />
                            </div>
                          ))}
                        </div>
                      )}
                      {activeTab === "loop" && action.functions.loop && (
                        <div>
                          {action.functions.loop.type === "interval" && (
                            <div>
                              <label
                                htmlFor="delay"
                                className="block text-sm font-medium text-gray-700"
                              >
                                Delay
                              </label>
                              <input
                                type="text"
                                id="delay"
                                name="delay"
                                defaultValue={action.functions.variables.delay}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                              />
                            </div>
                          )}
                          {action.functions.loop.type === "range" && (
                            <div>
                              {Object.entries(
                                action.functions.loop.parameters
                              ).map(
                                ([paramName, paramValue]: [string, any]) => (
                                  <div key={paramName}>
                                    <label
                                      htmlFor={paramName}
                                      className="block text-sm font-medium text-gray-700"
                                    >
                                      {paramName}
                                    </label>
                                    <input
                                      type="text"
                                      id={paramName}
                                      name={paramName}
                                      defaultValue={paramValue}
                                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                    />
                                  </div>
                                )
                              )}
                            </div>
                          )}
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

          setComponent(() => GeneratedComponent);
        } catch (err) {
          console.error("Error parsing actions or creating component:", err);
        }
      }
    };

    createComponent();
  }, [deviceActions, isLoading, error]);

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Error loading device actions: {error.message}</p>;

  return (
    <div className="dashboard-layout">
      <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
      {Component ? <Component /> : <p>No actions to display</p>}
    </div>
  );
};

export default DashboardPage;
