import { env } from "@/env.mjs";
import { NextRequest, NextResponse } from "next/server";
import axios from "axios";

// export async function GET(req: NextRequest) {
//   const url = "http://localhost:5000/pyvisa";

//   try {
//     const response = await axios.get(url);
//     return NextResponse.json(response.data);
//   } catch (error) {
//     return NextResponse.json(
//       { error: "Failed to fetch data" },
//       { status: 500 }
//     );
//   }
// }

export async function GET(req: NextRequest) {
  const headers = new Headers();
  headers.set("Content-Type", "text/event-stream");
  headers.set("Cache-Control", "no-cache");
  headers.set("Connection", "keep-alive");
  headers.set("Access-Control-Allow-Origin", "*"); // Allow all origins

  const responseStream = new ReadableStream({
    async start(controller) {
      // Function to send data to the client
      const sendData = (data: any) => {
        // console.log(data);
        controller.enqueue(data);
      };

      try {
        const response = await axios.get(
          `${env.NEXT_PUBLIC_APP_URL}:${env.FLASK_API_PORT}/pyvisa`,
          {
            responseType: "stream",
          }
        );

        response.data.on("data", (chunk: any) => {
          sendData(chunk.toString());
        });

        response.data.on("end", () => {
          controller.close();
        });

        response.data.on("error", (error: any) => {
          console.error("Error fetching data:", error);
          controller.error(error);
        });
      } catch (error) {
        console.error("Error fetching data:", error);
        controller.error(error);
      }
    },
  });

  return new NextResponse(responseStream, { headers });
}
