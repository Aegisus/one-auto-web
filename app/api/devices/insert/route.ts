import { db } from "@/db/drizzle";
import { device } from "@/db/schema";
import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";

export async function POST(req: Request) {
  try {
    const { name, data } = await req.json();
    const uid = data.ID_MODEL || data.IDN;

    // Check if the device exists
    const result = await db
      .select()
      .from(device)
      .where(eq(device.name, name))
      .execute();

    if (result.length === 0) {
      // Device does not exist, insert a new entry
      await db
        .insert(device)
        .values({
          name: name,
          data: data,
          uid: uid,
          description: "test",
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
    console.error("Error executing query", (err as Error).stack);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
