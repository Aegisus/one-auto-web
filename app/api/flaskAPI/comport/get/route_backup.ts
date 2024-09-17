import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { DeviceSchema } from "@/db/zodDeviceSchema";

const DevicesArraySchema = z.array(DeviceSchema);

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const { readable, writable } = new TransformStream();
  const writer = writable.getWriter();
  const encoder = new TextEncoder();

  async function fetchData() {
    try {
      const response = await fetch(
        `http://localhost:${process.env.FLASK_API_PORT}/comport`
      );
      const reader = response.body?.getReader();

      if (!reader) {
        throw new Error("Failed to get reader from response body");
      }

      const decoder = new TextDecoder();
      let result;

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        const lines = chunk.split("\n\n");

        for (const line of lines) {
          if (line.startsWith("data: ")) {
            const jsonStr = line.replace("data: ", "");
            result = JSON.parse(jsonStr);

            // Validate the payload using the Zod schema
            const isValidated = DevicesArraySchema.safeParse(result.devices);

            // If validation fails, return an error
            if (!isValidated.success) {
              writer.write(
                encoder.encode(
                  `data: ${JSON.stringify({ error: isValidated.error.errors })}\n\n`
                )
              );
              writer.close();
              return;
            }

            console.log("Success reading devices:", isValidated.data);

            // Send the validated data
            writer.write(
              encoder.encode(
                `data: ${JSON.stringify({ message: "Success to read devices", data: isValidated.data })}\n\n`
              )
            );
          }
        }
      }
    } catch (error) {
      console.error("Error reading devices:", error);
      writer.write(
        encoder.encode(
          `data: ${JSON.stringify({ error: "Failed to read devices" })}\n\n`
        )
      );
    } finally {
      writer.close();
    }
  }

  fetchData();

  return new Response(readable, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    },
  });
}
