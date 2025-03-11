import { create } from "zustand";
import { env } from "@/env.mjs";
import {
  DeviceState,
  // DeviceSchema,
  type DevicesArray,
} from "@/db/zod/zodDeviceSchema";

export const getDevices = create<DeviceState>((set) => ({
  devices: [] as DevicesArray,
  setDevices: (devices: DevicesArray) => set({ devices }),
  connectDeviceToSSE: () => {
    let comportData: DevicesArray = [];
    let pyvisaData: DevicesArray = [];

    const updateDevices = () => {
      set((state) => ({
        devices: [...comportData, ...pyvisaData],
      }));
    };

    const handleData = (deviceType: "comport" | "pyvisa") => {
      return createESFlaskDevice(
        deviceType,
        (rawData: DevicesArray) => {
          if (rawData.length === 0) {
            if (deviceType === "comport") {
              comportData = [];
            }
            if (deviceType === "pyvisa") {
              pyvisaData = [];
            }
          } else {
            if (deviceType === "comport") {
              comportData = rawData;
            }
            if (deviceType === "pyvisa") {
              pyvisaData = rawData;
            }
          }
          updateDevices();
        },
        (error) => {
          console.error("Error fetching data:", error);
        }
      );
    };

    const comportEventSource = handleData("comport");
    const pyvisaEventSource = handleData("pyvisa");

    return () => {
      comportEventSource.close();
      pyvisaEventSource.close();
    };
  },
}));

const createESFlaskDevice = (
  deviceType: "comport" | "pyvisa",
  onMessage: (data: any) => void,
  onError: (error: any) => void
) => {
  const url = `${env.NEXT_PUBLIC_APP_URL}:3000/api/flaskAPI/getDevices?device=${deviceType}`;
  const eventSource = new EventSource(url);

  eventSource.onmessage = (event) => {
    try {
      const parsedData = JSON.parse(JSON.parse(event.data));
      onMessage(parsedData);
      // console.log(parsedData);
    } catch (error) {
      console.error("Failed to parse JSON data for", deviceType, ":", error);
    }
  };

  eventSource.onerror = (error) => {
    console.error("EventSource error for", deviceType, ":", error);
    onError(error);
    eventSource.close();
  };

  return eventSource;
};

const createESSimFlaskDevice = (
  onMessage: (data: any) => void,
  onError: (error: any) => void
) => {
  const url = `${env.NEXT_PUBLIC_APP_URL}:3000/api/flaskAPISimulation/getDevices`;
  const eventSource = new EventSource(url);

  eventSource.onmessage = (event) => {
    // const data = JSON.parse(event.data);
    const parsedData = JSON.parse(JSON.parse(event.data));
    onMessage(parsedData);
  };

  eventSource.onerror = (error) => {
    // console.error("EventSource error: %o", error);
    onError(error);
    eventSource.close();
  };

  return eventSource;
};

export const getSimulationDevices = create<DeviceState>((set) => ({
  devices: [] as DevicesArray,
  setDevices: (devices: DevicesArray) => set({ devices }),
  connectDeviceToSSE: () => {
    let deviceData: DevicesArray = [];

    const updateDevices = () => {
      set((state) => ({
        devices: [...deviceData],
      }));
    };

    const handleData = () => {
      return createESSimFlaskDevice(
        (rawData: DevicesArray) => {
          deviceData = rawData.length === 0 ? [] : rawData;
          updateDevices();
        },
        (error) => {
          // console.error("Error fetching data:", error);
        }
      );
    };

    const eventSource = handleData();

    return () => {
      eventSource.close();
    };
  },
}));
