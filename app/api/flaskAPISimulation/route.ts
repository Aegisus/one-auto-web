import { NextRequest, NextResponse } from "next/server";
import axios from "axios";

export async function GET(req: NextRequest) {
  const headers = new Headers();
  headers.set("Content-Type", "text/event-stream");
  headers.set("Cache-Control", "no-cache");
  headers.set("Connection", "keep-alive");
  headers.set("Access-Control-Allow-Origin", "*"); // Allow all origins

  //   const url = new URL(req.url);
  //   const device = url.searchParams.get("device") || "comport"; // Default to 'comport' if not provided

  const responseStream = new ReadableStream({
    async start(controller) {
      // Function to send data to the client
      const sendData = (data: any) => {
        // console.log(data);
        controller.enqueue(data);
      };

      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_APP_URL}:${process.env.FLASK_API_PORT}/simulation`,
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
