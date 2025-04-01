"use client";

import { useState, useEffect } from "react";
import { LineChart, type LineChartEventProps } from "@/lib/LineChart";
import { Skeleton } from "@heroui/skeleton";
import { Card } from "@heroui/card";
import { useOutputStore } from "@/config/zustand/OutputStore";

interface DashboardLineChartOVCProps {
  x_axis_label: string;
  y_axis_label: string;
  deviceUID: string;
}

export const LineChartOVC = ({
  x_axis_label,
  y_axis_label,
  deviceUID,
}: DashboardLineChartOVCProps) => {
  const [value, setValue] = useState<LineChartEventProps>(null);
  const [loading, setLoading] = useState(true);
  const [chartdata, setChartData] = useState<{ [key: string]: number }[]>([]);
  const [lastProcessedIndex, setLastProcessedIndex] = useState(0); // Track the last processed index

  // Access the specific function output for |measure_power
  const measurePowerOutput = useOutputStore(
    (state) => state.outputs[deviceUID]?.["measure_power"] || ""
  );

  useEffect(() => {
    if (measurePowerOutput) {
      try {
        // Split the output into individual lines
        const outputs = measurePowerOutput.split("\n");

        // Process only new lines
        const newOutputs = outputs.slice(lastProcessedIndex);

        newOutputs.forEach((output) => {
          let sanitizedOutput = output.trim();

          // Remove surrounding quotes if they exist
          if (
            sanitizedOutput.startsWith('"') &&
            sanitizedOutput.endsWith('"')
          ) {
            sanitizedOutput = sanitizedOutput.slice(1, -1);
          }

          console.log("Sanitized Output:", sanitizedOutput);

          // Convert the string to a number
          const powerValue = parseFloat(sanitizedOutput);

          // Check if the value is a valid number
          if (!isNaN(powerValue)) {
            // Add the new data point to the chart
            setChartData((prevData) => [
              ...prevData,
              {
                [x_axis_label]: prevData.length + 1,
                [y_axis_label]: powerValue,
              },
            ]);
          } else {
            console.error("Invalid power value:", sanitizedOutput);
          }
        });

        // Update the last processed index
        setLastProcessedIndex(outputs.length);
      } catch (error) {
        console.error(
          "Failed to process measurePowerOutput:",
          error,
          measurePowerOutput
        );
      }
    }
  }, [measurePowerOutput]); // Re-run whenever measurePowerOutput changes

  useEffect(() => {
    // Simulate an initial loading state
    const fetchData = async () => {
      setLoading(true); // Set loading to true while fetching data
      await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulate a delay
      setLoading(false); // Set loading to false after data is fetched
    };

    fetchData();
  }, []); // Empty dependency array ensures this runs only once on mount

  return (
    <>
      {loading || chartdata.length === 0 ? (
        <Card
          className="mt-4 h-72 w-full md:w-96 lg:w-[600px] rounded-mdspace-y-5"
          radius="lg"
        />
      ) : (
        <LineChart
          className="mt-4 h-72 w-full md:w-96 lg:w-[600px]"
          data={chartdata}
          index={x_axis_label} // Use dynamic x-axis label
          categories={[y_axis_label]} // Use dynamic y-axis label
          colors={["blue"]}
          yAxisWidth={30}
          xAxisLabel={x_axis_label}
          onValueChange={(v) => setValue(v)}
        />
      )}
      <pre className="mt-8 rounded-md p-3 text-sm text-white h-32 overflow-y-auto text-wrap">
        {value ? `Selected value: ${JSON.stringify(value, null, 2)}` : ""}
      </pre>
    </>
  );
};
