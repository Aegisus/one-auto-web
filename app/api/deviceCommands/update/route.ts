import { db } from "@/db/drizzle";
import { deviceCommands } from "@/db/schema";
import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";

export async function POST(req: Request) {
  try {
    const { updatedCommandsRequest } = await req.json();

    // Check if the device exists by UID
    const result = await db
      .select()
      .from(deviceCommands)
      .where(eq(deviceCommands.uid, updatedCommandsRequest.uid))
      .execute();

    if (result.length === 0) {
      return NextResponse.json({
        message: "Device not found. Cannot update non-existent device.",
      });
    } else {
      // Device exists, update the entry
      await db
        .update(deviceCommands)
        .set({
          commands: updatedCommandsRequest.commands,
          updated_at: new Date(),
        })
        .where(eq(deviceCommands.uid, updatedCommandsRequest.uid))
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
