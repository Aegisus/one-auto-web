import { create } from "zustand";
import { useEffect } from "react";
import useSWR, { mutate } from "swr";
import { env } from "@/env.mjs";
import axios from "axios";
import {
  type DeviceActionsType,
  type DeviceActionsArray,
  DeviceActionsState,
  DeviceActionsArraySchema,
} from "@/db/zod/zodDeviceActionsSchema";

const fetcher = (url: string) => axios.get(url).then((res) => res.data);

export const endpoints = {
  key: "api/deviceActions",
  list: "/get", // server URL
  insert: "/insert", // server URL
  update: "/update", // server URL
  delete: "/delete", // server URL
};

export const useDeviceActionsStore = create<DeviceActionsState>((set) => ({
  deviceActions: [] as DeviceActionsArray,
  setDeviceActions: (deviceActions: DeviceActionsArray) =>
    set({ deviceActions }),
}));

export function useDeviceActions() {
  const setDeviceActions = useDeviceActionsStore(
    (state) => state.setDeviceActions
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
        const validatedData = DeviceActionsArraySchema.parse(data);
        // console.log(validatedData);
        setDeviceActions(validatedData);
      } catch (validationError) {
        console.error("Validation error:", validationError);
      }
    }
  }, [data, setDeviceActions]);

  // console.log(data);

  return { data, isLoading, error, isValidating };
}

export async function insertActions(newActions: DeviceActionsType) {
  // to update local state based on key
  const response = await fetch(
    env.NEXT_PUBLIC_APP_URL + "/" + endpoints.key + endpoints.insert,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newActions),
    }
  );

  await mutate(
    env.NEXT_PUBLIC_APP_URL + "/" + endpoints.key + endpoints.list,
    () => {
      return {
        newActions,
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
        body: JSON.stringify({
          deviceUID,
          updatedActions: updatedFunctions,
          type: "functions",
        }),
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
        body: JSON.stringify({
          deviceUID,
          updatedActions: updatedCommands,
          type: "commands",
        }),
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

export async function updateLayout(deviceUID: string, updatedLayout: object) {
  try {
    const response = await fetch(
      env.NEXT_PUBLIC_APP_URL + ":3000/" + endpoints.key + endpoints.update,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          deviceUID,
          updatedActions: updatedLayout,
          type: "layout",
        }),
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

export async function deleteActions(deviceUID: string) {
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
