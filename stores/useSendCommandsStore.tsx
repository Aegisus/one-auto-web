import { create } from "zustand";
import useSWR, { mutate } from "swr";
import { env } from "@/env.mjs";
import axios from "axios";

// const fetcher = (url: string) => axios.get(url).then((res) => res.data);

export async function SendCommands(commands: {
  address: string;
  content: string;
  deviceType: string;
}) {
  // to update local state based on key
  const response = await fetch(
    env.NEXT_PUBLIC_APP_URL + ":3000/api/flaskAPI/sendCommands",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(commands),
    }
  );

  await mutate(
    env.NEXT_PUBLIC_APP_URL + ":3000/api/flaskAPI/sendCommands",
    () => {
      return {
        commands,
      };
    },
    false
  );

  if (!response.ok) {
    throw new Error("Network response was not ok");
  }

  const responseData = await response.json();

  return responseData;
}
