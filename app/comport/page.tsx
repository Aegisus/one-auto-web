"use client";
import { useEffect, useState } from "react";
import { createEventSource } from "../server/fetch"; // Adjust the import path as necessary
import DeviceCard from "../../components/comport/devicecard";

type Device = {
  com_port: string;
  ID_MODEL: string;
  ID_SERIAL: string;
  ID_FROM_DATABASE: string;
};

const Comport = () => {
  const [data, setData] = useState<Record<string, Device> | null>(null);

  useEffect(() => {
    const eventSource = createEventSource(
      (rawData) => {
        try {
          const parsedData = JSON.parse(rawData);
          setData(parsedData);
          console.log("Parsed Data:", JSON.stringify(parsedData, null, 2));
        } catch (error) {
          console.error("Error parsing JSON:", error);
        }
      },
      (error) => {
        console.error("Error fetching data:", error);
      }
    );

    return () => {
      eventSource.close();
    };
  }, []);

  return (
    <div>
      <h1>Connected Devices</h1>
      {data ? (
        Object.keys(data).map((key) => (
          <div key={key} className="mt-3">
            <DeviceCard device={data[key]} />
          </div>
        ))
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default Comport;
