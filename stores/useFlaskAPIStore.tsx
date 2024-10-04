import { create } from "zustand";
import { env } from "@/env.mjs";
import {
  DeviceState,
  // ComportDevicesSchema,
  // PyvisaDevicesSchema,
  DeviceSchema,
  // type ComportDevicesArray,
  // type PyvisaDevicesArray,
  type DevicesArray,
} from "@/db/zodDeviceSchema";

// const createESFlaskComport = (
//   onMessage: (data: any) => void,
//   onError: (error: any) => void
// ) => {
//   const url = `${env.NEXT_PUBLIC_APP_URL}:3000/api/flaskAPI?device=comport`;
//   const eventSource = new EventSource(url);

//   eventSource.onmessage = (event) => {
//     try {
//       // Parse the data correctly
//       const parsedData = JSON.parse(JSON.parse(event.data));
//       // console.log(parsedData);

//       // Validate the parsed data using Zod
//       // const validatedData = ComportDevicesSchema.parse(parsedData);
//       const validatedData = DeviceSchema.parse(parsedData);
//       onMessage(validatedData);
//     } catch (error) {
//       onError(error);
//     }
//   };

//   eventSource.onerror = (error) => {
//     onError(error);
//     eventSource.close();
//   };

//   return eventSource;
// };

// const createESFlaskPyvisa = (
//   onMessage: (data: any) => void,
//   onError: (error: any) => void
// ) => {
//   const url = `${env.NEXT_PUBLIC_APP_URL}:3000/api/flaskAPI?device=pyvisa`;
//   const eventSource = new EventSource(url);

//   eventSource.onmessage = (event) => {
//     try {
//       // Parse the data correctly
//       const parsedData = JSON.parse(JSON.parse(event.data));
//       // console.log(parsedData);

//       // Validate the parsed data using Zod
//       // const validatedData = PyvisaDevicesSchema.parse(parsedData);
//       const validatedData = DeviceSchema.parse(parsedData);
//       onMessage(validatedData);
//     } catch (error) {
//       onError(error);
//     }
//   };

//   eventSource.onerror = (error) => {
//     onError(error);
//     eventSource.close();
//   };

//   return eventSource;
// };

// const fetcher = (url: string) => axios.get(url).then((res) => res.data);

// export const getDevices = create<DeviceState>((set) => ({
//   comportDevices: [] as ComportDevicesArray,
//   setComportDevices: (comportDevices: ComportDevicesArray) =>
//     set({ comportDevices }),
//   connectComportToSSE: () => {
//     const eventSource = createESFlaskComport(
//       (rawData: ComportDevicesArray) => {
//         try {
//           set({ comportDevices: rawData });
//         } catch (error) {
//           console.error("Error processing data:", error);
//         }
//       },
//       (error) => {
//         console.error("Error fetching data:", error);
//       }
//     );

//     return () => {
//       eventSource.close();
//     };
//   },
//   pyvisaDevices: [] as PyvisaDevicesArray,
//   setPyvisaDevices: (pyvisaDevices: PyvisaDevicesArray) =>
//     set({ pyvisaDevices }),
//   connectPyvisaToSSE: () => {
//     const eventSource = createESFlaskPyvisa(
//       (rawData: PyvisaDevicesArray) => {
//         try {
//           set({ pyvisaDevices: rawData });
//         } catch (error) {
//           console.error("Error processing data:", error);
//         }
//       },
//       (error) => {
//         console.error("Error fetching data:", error);
//       }
//     );

//     return () => {
//       eventSource.close();
//     };
//   },
// }));

export const getDevices = create<DeviceState>((set) => ({
  devices: [] as DevicesArray,
  setDevices: (devices: DevicesArray) => set({ devices }),
  connectDeviceToSSE: () => {
    const handleData = (deviceType: "comport" | "pyvisa") => {
      return createESFlaskDevice(
        deviceType,
        (rawData: DevicesArray) => {
          set((state) => ({
            devices: [...state.devices, ...rawData],
          }));
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
  const url = `${env.NEXT_PUBLIC_APP_URL}:3000/api/flaskAPI?device=${deviceType}`;
  const eventSource = new EventSource(url);

  eventSource.onmessage = (event) => {
    try {
      // Parse the data correctly
      const parsedData = JSON.parse(JSON.parse(event.data));
      // console.log(parsedData);

      // Validate the parsed data using Zod
      const validatedData = DeviceSchema.parse(parsedData);
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
