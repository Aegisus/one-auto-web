import { db } from "@/db";
import { device } from "@/db/schema";
import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";

export async function POST(req: Request) {
  const { IDN, ID_SERIAL } = await req.json();

  try {
    // Check if the device exists
    const result = await db
      .select()
      .from(device)
      .where(eq(device.name, IDN || ID_SERIAL))
      .execute();

    if (result.length === 0) {
      // Device does not exist, insert a new entry
      await db
        .insert(device)
        .values({
          name: IDN || ID_SERIAL,
          created_at: new Date(),
          updated_at: new Date(),
        })
        .execute();
      return NextResponse.json({ message: "New device entry inserted." });
    } else {
      // Device exists, send feedback to the user
      return NextResponse.json({
        message:
          "Device already exists. Do you want to overwrite or create a new entry?",
      });
    }
  } catch (err) {
    console.error("Error executing query", err.stack);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
