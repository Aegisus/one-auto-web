import { create } from "zustand";
import { z } from "zod";
import { env } from "@/env.mjs";
import { DeviceSchema, DevicesSchema } from "@/db/zodDeviceSchema";

export type DeviceType = z.infer<typeof DeviceSchema>;
export type DevicesRecord = Record<string, DeviceType>;

export interface DeviceState {
  devices: DevicesRecord;
  setDevices: (devices: DevicesRecord) => void;
  connectToSSE: () => void;
}

const createESFlaskComport = (
  onMessage: (data: any) => void,
  onError: (error: any) => void
) => {
  const url = `${env.NEXT_PUBLIC_APP_URL}:3000/api/flaskAPI/comport`;
  const eventSource = new EventSource(url);

  eventSource.onmessage = (event) => {
    try {
      // Parse the data correctly
      const parsedData = JSON.parse(JSON.parse(event.data));
      // console.log(parsedData);

      // Validate the parsed data using Zod
      const validatedData = DevicesSchema.parse(parsedData);
      onMessage(validatedData);
    } catch (error) {
      onError(error);
    }
  };

  eventSource.onerror = (error) => {
    onError(error);
    eventSource.close();
  };

  return eventSource;
};

export const getDevices = create<DeviceState>((set) => ({
  devices: {} as DevicesRecord,
  setDevices: (devices: DevicesRecord) => set({ devices }),
  connectToSSE: () => {
    const eventSource = createESFlaskComport(
      (rawData: DevicesRecord) => {
        try {
          set({ devices: rawData });
        } catch (error) {
          console.error("Error processing data:", error);
        }
      },
      (error) => {
        console.error("Error fetching data:", error);
      }
    );

    return () => {
      eventSource.close();
    };
  },
}));
