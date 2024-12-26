import { db } from "@/db/drizzle";
import { deviceActions } from "@/db/schema";
import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";

export async function POST(req: Request) {
  try {
    const { selectedDeviceUID } = await req.json();
    // Check if the device exists by UID
    const result = await db
      .select()
      .from(deviceActions)
      .where(eq(deviceActions.uid, selectedDeviceUID))
      .execute();

    if (result.length === 0) {
      return NextResponse.json({
        message: "Device not found. Cannot delete non-existent device.",
      });
    } else {
      // Device exists, delete the entry
      await db
        .delete(deviceActions)
        .where(eq(deviceActions.uid, selectedDeviceUID))
        .execute();

      return NextResponse.json({
        message:
          "Device entry and corresponding commands deleted successfully.",
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
