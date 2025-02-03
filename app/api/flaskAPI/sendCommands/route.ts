import { NextRequest, NextResponse } from "next/server";
import axios from "axios";

export async function POST(req: NextRequest) {
  const headers = new Headers();
  headers.set("Content-Type", "application/json");
  headers.set("Access-Control-Allow-Origin", "*"); // Allow all origins

  try {
    const body = await req.json();
    const { address, content, deviceType } = body;
    const endpoint =
      deviceType === "pyvisa" ? "pyvisa_command" : "comport_command";
    // console.log(deviceType);
    const payload =
      deviceType === "pyvisa"
        ? { address, command: content }
        : { port: address, command: content };

    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_APP_URL}:${process.env.FLASK_API_PORT}/${endpoint}`,
      payload,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    return new NextResponse(JSON.stringify(response.data), { headers });
  } catch (error) {
    console.error("Error executing script:", error);
    return new NextResponse(
      JSON.stringify({ error: "Error executing script" }),
      { headers, status: 500 }
    );
  }
}
