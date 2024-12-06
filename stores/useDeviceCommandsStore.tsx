import { create } from "zustand";
import { useEffect } from "react";
import useSWR, { mutate } from "swr";
import { env } from "@/env.mjs";
import axios from "axios";
import {
  type DeviceCommandsType,
  type DeviceCommandsArray,
  DeviceCommandsState,
  DeviceCommandsArraySchema,
} from "@/db/zod/zodDeviceCommandsSchema";

const fetcher = (url: string) => axios.get(url).then((res) => res.data);

export const endpoints = {
  key: "api/deviceCommands",
  list: "/get", // server URL
  insert: "/insert", // server URL
  update: "/update", // server URL
  delete: "/delete", // server URL
};

export const useDeviceCommandsStore = create<DeviceCommandsState>((set) => ({
  deviceCommands: [] as DeviceCommandsArray,
  setDeviceCommands: (deviceCommands: DeviceCommandsArray) =>
    set({ deviceCommands }),
}));

export function useDeviceCommands() {
  const setDeviceCommands = useDeviceCommandsStore(
    (state) => state.setDeviceCommands
  );

  const { data, isLoading, error, isValidating } = useSWR(
    `${env.NEXT_PUBLIC_APP_URL}:3000/${endpoints.key}/${endpoints.list}`,
    fetcher,
    {
      revalidateIfStale: false,
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
    }
  );

  useEffect(() => {
    if (data) {
      try {
        // console.log(data);
        const validatedData = DeviceCommandsArraySchema.parse(data);
        // console.log(validatedData);
        setDeviceCommands(validatedData);
      } catch (validationError) {
        console.error("Validation error:", validationError);
      }
    }
  }, [data, setDeviceCommands]);

  return { data, isLoading, error, isValidating };
}

export async function insertCommands(newCommands: DeviceCommandsType) {
  // to update local state based on key
  const response = await fetch(
    env.NEXT_PUBLIC_APP_URL + "/" + endpoints.key + endpoints.insert,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newCommands),
    }
  );

  await mutate(
    env.NEXT_PUBLIC_APP_URL + "/" + endpoints.key + endpoints.list,
    () => {
      return {
        newCommands,
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

export async function updateCommands(
  deviceUID: string,
  updatedCommands: object
) {
  try {
    const response = await fetch(
      env.NEXT_PUBLIC_APP_URL + ":3000/" + endpoints.key + endpoints.update,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ deviceUID, updatedCommands }),
      }
    );

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    await mutate(
      env.NEXT_PUBLIC_APP_URL + "/" + endpoints.key + endpoints.list
    );
  } catch (error) {
    console.error("Error:", error);
  }
}

export async function deleteCommands(deviceUID: string) {
  // to update local state based on key
  const response = await fetch(
    env.NEXT_PUBLIC_APP_URL + "/" + endpoints.key + endpoints.delete,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ deviceUID }),
    }
  );

  await mutate(env.NEXT_PUBLIC_APP_URL + "/" + endpoints.key + endpoints.list);
  window.location.reload();

  if (!response.ok) {
    throw new Error("Network response was not ok");
  }
}
