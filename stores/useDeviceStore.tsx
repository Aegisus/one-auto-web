import { create } from "zustand";
import { z } from "zod";
import { useEffect } from "react";
import useSWR, { mutate } from "swr";
import { env } from "@/env.mjs";
import axios from "axios";
// import {
//   type ComportDeviceType,
//   type PyvisaDeviceType,
//   DBDeviceState,
// } from "@/db/zodDeviceSchema";
import {
  type DBDeviceType,
  // ComportDevicesSchema,
  // PyvisaDevicesSchema,
  DBDevicesArraySchema,
  DBDeviceState,
  // type ComportDevicesArray,
  // type PyvisaDevicesArray,
  type DBDevicesArray,
} from "@/db/zodDBDeviceSchema";

const fetcher = (url: string) => axios.get(url).then((res) => res.data);

export const endpoints = {
  key: "api/devices",
  list: "/get", // server URL
  insert: "/insert", // server URL
  update: "/update", // server URL
  delete: "/delete", // server URL
};

// export const useDBDeviceStore = create<DBDeviceState>((set) => ({
//   comportDevices: [],
//   setComportDevices: (comportDevices) => set({ comportDevices }),
//   pyvisaDevices: [],
//   setPyvisaDevices: (pyvisaDevices) => set({ pyvisaDevices }),
// }));

// export function useDBDevices() {
//   const setComportDevices = useDBDeviceStore(
//     (state) => state.setComportDevices
//   );
//   const setPyvisaDevices = useDBDeviceStore((state) => state.setPyvisaDevices);

//   const { data, isLoading, error, isValidating } = useSWR(
//     env.NEXT_PUBLIC_APP_URL + ":3000/" + endpoints.key + endpoints.list,
//     fetcher,
//     {
//       revalidateIfStale: false,
//       revalidateOnFocus: false,
//       revalidateOnReconnect: false,
//     }
//   );

//   useEffect(() => {
//     console.log("Fetched data from SWR:", data);
//     if (data) {
//       setComportDevices(data.comportDevices ?? []);
//       setPyvisaDevices(data.pyvisaDevices ?? []);
//     }
//   }, [data, setComportDevices, setPyvisaDevices]);

//   return { isLoading, error, isValidating };
// }

export const useDBDeviceStore = create<DBDeviceState>((set) => ({
  dbDevices: [] as DBDevicesArray,
  setDBDevices: (dbDevices: DBDevicesArray) => set({ dbDevices }),
}));

export function useDBDevices() {
  const setDevices = useDBDeviceStore((state) => state.setDBDevices);

  const { data, isLoading, error, isValidating } = useSWR(
    env.NEXT_PUBLIC_APP_URL + ":3000/" + endpoints.key + endpoints.list,
    fetcher,
    {
      revalidateIfStale: false,
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
    }
  );

  useEffect(() => {
    console.log("Fetched data from SWR:", data);
    if (data) {
      try {
        const validatedData = DBDevicesArraySchema.parse(data ?? []);
        // console.log("Validated data:", validatedData);
        setDevices(validatedData);
      } catch (validationError) {
        console.error("Validation error:", validationError);
      }
    }
  }, [data, setDevices]);

  return { isLoading, error, isValidating };
}

// export async function fetchDevices() {
//   try {
//     const response = await axios.get(
//       `${process.env.NEXT_PUBLIC_APP_URL}:3000/api/devices/get`
//     );
//     // console.log("Fetched data:", response.data);
//     // return response.data;
//     const validatedData = DBDevicesArraySchema.parse(response.data);
//     return validatedData;
//   } catch (error) {
//     console.error("Error fetching data:", error);
//     throw error;
//   }
// }

export async function insertDevices(newDevice: DBDeviceType) {
  // to update local state based on key
  const response = await fetch(
    env.NEXT_PUBLIC_APP_URL + "/" + endpoints.key + endpoints.insert,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newDevice),
    }
  );

  await mutate(
    env.NEXT_PUBLIC_APP_URL + "/" + endpoints.key + endpoints.list,
    () => {
      return {
        newDevice,
      };
    },
    false
  );

  if (!response.ok) {
    throw new Error("Network response was not ok");
  }

  // const responseData = await response.json();

  // return responseData;
}

export function updateDevice(updatedDevice: DBDeviceType) {
  // to update local state based on key
  mutate(
    env.NEXT_PUBLIC_APP_URL + "/" + endpoints.key + endpoints.list,
    () => {
      return {
        updatedDevice,
      };
    },
    false
  );

  // to hit server
  // you may need to refetch latest data after server hit and based on your logic
  //   const data = { list: updatedCustomer };
  //   await axios.post(endpoints.key + endpoints.update, data);
}