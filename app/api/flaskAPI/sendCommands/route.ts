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

    return new NextResponse(JSON.stringify(response.data.response), {
      headers,
    });
  } catch (error: any) {
    const errorMessage =
      error.response?.data || error.message || "Unknown error occurred";
    const errorStatus = error.response?.status || 500;

    return new NextResponse(
      JSON.stringify({
        error: "Error executing script",
        details: errorMessage,
      }),
      { headers, status: errorStatus }
    );
  }
}
