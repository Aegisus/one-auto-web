import { create } from "zustand";
import { useEffect } from "react";
import useSWR, { mutate } from "swr";
import { env } from "@/env.mjs";
import axios from "axios";
import {
  type DeviceFunctionsType,
  type DeviceFunctionsArray,
  DeviceFunctionsState,
  DeviceFunctionsArraySchema,
} from "@/db/zod/zodDeviceFunctionsSchema";

const fetcher = (url: string) => axios.get(url).then((res) => res.data);

export const endpoints = {
  key: "api/deviceFunctions",
  list: "/get", // server URL
  insert: "/insert", // server URL
  update: "/update", // server URL
  delete: "/delete", // server URL
};

export const useDeviceFunctionsStore = create<DeviceFunctionsState>((set) => ({
  deviceFunctions: [] as DeviceFunctionsArray,
  setDeviceFunctions: (deviceFunctions: DeviceFunctionsArray) =>
    set({ deviceFunctions }),
}));

export function useDeviceFunctions() {
  const setDeviceFunctions = useDeviceFunctionsStore(
    (state) => state.setDeviceFunctions
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
        const validatedData = DeviceFunctionsArraySchema.parse(data);
        // console.log(validatedData);
        setDeviceFunctions(validatedData);
      } catch (validationError) {
        console.error("Validation error:", validationError);
      }
    }
  }, [data, setDeviceFunctions]);

  return { data, isLoading, error, isValidating };
}

export async function insertCommands(newFunctions: DeviceFunctionsType) {
  // to update local state based on key
  const response = await fetch(
    env.NEXT_PUBLIC_APP_URL + "/" + endpoints.key + endpoints.insert,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newFunctions),
    }
  );

  await mutate(
    env.NEXT_PUBLIC_APP_URL + "/" + endpoints.key + endpoints.list,
    () => {
      return {
        newFunctions,
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

export async function updateFunctions(
  deviceUID: string,
  updatedFunctions: object
) {
  try {
    const response = await fetch(
      env.NEXT_PUBLIC_APP_URL + ":3000/" + endpoints.key + endpoints.update,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ deviceUID, updatedFunctions }),
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

export async function deleteFunctions(deviceUID: string) {
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
