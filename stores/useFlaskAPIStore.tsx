import { create } from "zustand";
import { z } from "zod";
import { useEffect } from "react";
import { env } from "@/env.mjs";
import axios from "axios";
import {
  ComportDeviceSchema,
  ComportDevicesSchema,
  PyvisaDeviceSchema,
  PyvisaDevicesSchema,
} from "@/db/zodDeviceSchema";

export type ComportDeviceType = z.infer<typeof ComportDeviceSchema>;
export type ComportDevicesRecord = Record<string, ComportDeviceType>;

export type PyvisaDeviceType = z.infer<typeof PyvisaDeviceSchema>;
export type PyvisaDevicesRecord = Record<string, PyvisaDeviceType>;

export interface DeviceState {
  comportDevices: ComportDevicesRecord;
  setComportDevices: (comportDevices: ComportDevicesRecord) => void;
  connectComportToSSE: () => void;
  pyvisaDevices: PyvisaDevicesRecord;
  setPyvisaDevices: (pyvisaDevices: PyvisaDevicesRecord) => void;
  connectPyvisaToSSE: () => void;
}

const createESFlaskComport = (
  onMessage: (data: any) => void,
  onError: (error: any) => void
) => {
  const url = `${env.NEXT_PUBLIC_APP_URL}:3000/api/flaskAPI?device=comport`;
  const eventSource = new EventSource(url);

  eventSource.onmessage = (event) => {
    try {
      // Parse the data correctly
      const parsedData = JSON.parse(JSON.parse(event.data));
      // console.log(parsedData);

      // Validate the parsed data using Zod
      const validatedData = ComportDevicesSchema.parse(parsedData);
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

const createESFlaskPyvisa = (
  onMessage: (data: any) => void,
  onError: (error: any) => void
) => {
  const url = `${env.NEXT_PUBLIC_APP_URL}:3000/api/flaskAPI?device=pyvisa`;
  const eventSource = new EventSource(url);

  eventSource.onmessage = (event) => {
    try {
      // Parse the data correctly
      const parsedData = JSON.parse(JSON.parse(event.data));
      // console.log(parsedData);

      // Validate the parsed data using Zod
      const validatedData = PyvisaDevicesSchema.parse(parsedData);
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

// const fetcher = (url: string) => axios.get(url).then((res) => res.data);

export const getDevices = create<DeviceState>((set) => ({
  comportDevices: {} as ComportDevicesRecord,
  setComportDevices: (comportDevices: ComportDevicesRecord) =>
    set({ comportDevices }),
  connectComportToSSE: () => {
    const eventSource = createESFlaskComport(
      (rawData: ComportDevicesRecord) => {
        try {
          set({ comportDevices: rawData });
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
  pyvisaDevices: {} as PyvisaDevicesRecord,
  setPyvisaDevices: (pyvisaDevices: PyvisaDevicesRecord) =>
    set({ pyvisaDevices }),
  connectPyvisaToSSE: () => {
    const eventSource = createESFlaskPyvisa(
      (rawData: PyvisaDevicesRecord) => {
        try {
          set({ pyvisaDevices: rawData });
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

// export const usePyvisaDevices = () => {
//   const { setPyvisaDevices } = getDevices.getState();
//   const { data, error } = useSWR(
//     `${env.NEXT_PUBLIC_APP_URL}:3000/api/flaskAPI/pyvisa/get`,
//     fetcher
//   );

//   useEffect(() => {
//     if (data) {
//       try {
//         // const parsedData = JSON.parse(data);
//         const validatedData = PyvisaDevicesSchema.parse(data);
//         setPyvisaDevices(validatedData);
//       } catch (error) {
//         console.error("Error validating pyvisa data:", error);
//       }
//     }
//   }, [data, setPyvisaDevices]);

//   return {
//     pyvisaDevices: data,
//     isLoading: !error && !data,
//     isError: error,
//   };
// };
