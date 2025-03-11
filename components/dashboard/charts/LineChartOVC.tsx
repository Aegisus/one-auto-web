"use client";

import { useState } from "react";

import { LineChart, type LineChartEventProps } from "@/lib/LineChart";

const chartdata = [
  {
    date: "Jan 23",
    2022: 45,
  },
  {
    date: "Feb 23",
    2022: 52,
  },
  {
    date: "Mar 23",
    2022: 48,
  },
];

export const LineChartOVC = () => {
  const [value, setValue] = useState<LineChartEventProps>(null);
  return (
    <>
      <LineChart
        className="mt-4 h-72"
        data={chartdata}
        index="date"
        categories={["2022"]}
        colors={["blue"]}
        yAxisWidth={30}
        onValueChange={(v) => setValue(v)}
      />
      <pre className="mt-8 rounded-md bg-gray-950 p-3 text-sm text-white dark:bg-gray-800">
        {JSON.stringify(value, null, 2)}
      </pre>
    </>
  );
};
