import { db } from "@/db/drizzle";
import { deviceActions } from "@/db/schema";
import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";

export async function POST(req: Request) {
  try {
    const { deviceUID, updatedActions, type } = await req.json();

    // Check if the device exists by UID
    const result = await db
      .select()
      .from(deviceActions)
      .where(eq(deviceActions.uid, deviceUID))
      .execute();

    if (result.length === 0) {
      return NextResponse.json({
        message: "Device not found. Cannot update non-existent device.",
      });
    } else {
      // Device exists, update the entry based on type
      const updateData =
        type === "functions"
          ? { functions: updatedActions }
          : type === "layout"
            ? { layout: updatedActions }
            : { commands: updatedActions };

      await db
        .update(deviceActions)
        .set({
          ...updateData,
          updated_at: new Date(),
        })
        .where(eq(deviceActions.uid, deviceUID))
        .execute();

      return NextResponse.json({
        message: `${
          type.charAt(0).toUpperCase() + type.slice(1)
        } updated successfully.`,
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
