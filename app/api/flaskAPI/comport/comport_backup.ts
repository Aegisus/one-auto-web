import { NextRequest } from "next/server";
import { z } from "zod";
import { DeviceSchema } from "@/db/zodDeviceSchema"; // Adjust path as necessary

export const config = {
  runtime: "edge",
};

const responseSchema = z.object({
  devices: z.array(DeviceSchema),
});

export default async function handler(req: NextRequest) {
  if (req.method !== "GET") {
    return new Response("Method Not Allowed", { status: 405 });
  }

  const flaskAPIUrl = `http://localhost:${process.env.FLASK_API_PORT}/comport`; // Ensure this is set correctly

  const headers = {
    "Content-Type": "text/event-stream",
    "Cache-Control": "no-cache",
    Connection: "keep-alive",
  };

  const readableStream = new ReadableStream({
    async start(controller) {
      const eventSource = new EventSource(flaskAPIUrl);

      eventSource.onmessage = (event) => {
        try {
          const parsedData = JSON.parse(event.data);

          // Validate data using Zod
          try {
            const validatedData = responseSchema.parse(parsedData);

            // Convert validated data to SSE-compatible format
            const message = `data: ${JSON.stringify(validatedData)}\n\n`;

            controller.enqueue(new TextEncoder().encode(message));
          } catch (validationError) {
            console.error("Zod Validation Error:", validationError);
            controller.enqueue(
              new TextEncoder().encode(`data: {"error": "Invalid data"}\n\n`)
            );
          }
        } catch (parseError) {
          console.error("JSON Parsing Error:", parseError);
          controller.enqueue(
            new TextEncoder().encode(`data: {"error": "Invalid JSON"}\n\n`)
          );
        }
      };

      eventSource.onerror = (error) => {
        console.error("EventSource Error:", error);
        controller.enqueue(
          new TextEncoder().encode(`data: {"error": "EventSource error"}\n\n`)
        );
        controller.close();
      };

      // Close the stream when the connection is closed
      eventSource.onopen = () => {
        console.log("EventSource connection opened");
      };
    },
  });

  return new Response(readableStream, { headers });
}
