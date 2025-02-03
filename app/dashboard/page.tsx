"use client";

import DashboardRenderer from "./DashboardRender";
import { useDeviceActions } from "@/stores/useDeviceActionsStore";

export default function Page() {
  const { data: deviceActions, isLoading, error } = useDeviceActions();

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Error loading device actions.</p>;

  // Extract layouts from device actions while filtering out functions and commands
  const layouts = deviceActions
    ?.map((device) => device.layout)
    .filter((layout) => layout !== null && layout.length > 0) // Ensure valid layouts exist
    .flat(); // Flatten nested arrays if any
  // console.log(layouts);

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Device Dashboard</h1>
      {layouts.length > 0 ? (
        <DashboardRenderer layouts={layouts} />
      ) : (
        <p>No layouts available.</p>
      )}
    </div>
  );
}
