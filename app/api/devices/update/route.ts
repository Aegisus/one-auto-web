import { db } from "@/db/drizzle";
import { device, deviceActions } from "@/db/schema";
import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";

export async function POST(req: Request) {
  try {
    const { selectedDeviceUID, deviceRequestData } = await req.json();

    // Check if the device exists by UID
    const result = await db
      .select()
      .from(device)
      .where(eq(device.uid, selectedDeviceUID))
      .execute();

    if (result.length === 0) {
      return NextResponse.json({
        message: "Device not found. Cannot update non-existent device.",
      });
    } else {
      // Device exists, update the entry
      await db
        .update(device)
        .set({
          name: deviceRequestData.name,
          data: deviceRequestData.data,
          uid: deviceRequestData.uid,
          description: deviceRequestData.description,
          updated_at: new Date(),
        })
        .where(eq(device.uid, selectedDeviceUID))
        .execute();

      // Update in deviceActions table
      await db
        .update(deviceActions)
        .set({
          name: deviceRequestData.name,
          uid: deviceRequestData.uid,
          updated_at: new Date(),
        })
        .where(eq(deviceActions.uid, selectedDeviceUID))
        .execute();

      return NextResponse.json({
        message: "Device entry and commands updated successfully.",
      });
    }
  } catch (err) {
    console.error("Error executing query", (err as Error).stack);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
