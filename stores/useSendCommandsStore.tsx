import { mutate } from "swr";
import { env } from "@/env.mjs";

// const fetcher = (url: string) => axios.get(url).then((res) => res.data);

export async function SendCommands(commands: {
  address: string;
  content: string;
  deviceType: string;
  noResponse?: boolean;
}) {
  // console.log(commands.content);
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

  // If noResponse is true, return early without fetching the response
  if (commands.noResponse) {
    return { success: true }; // Return a simple success object
  }

  if (!response.ok) {
    throw new Error("Network response was not ok");
  }

  const responseData = await response.json();

  return responseData;
}
