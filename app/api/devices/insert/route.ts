import { db } from "@/db/drizzle";
import { device, deviceActions } from "@/db/schema";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const registerRequest = await req.json();
    const { deviceRequestData } = registerRequest;

    // Ensure all required fields are present
    if (
      !deviceRequestData.uid ||
      !deviceRequestData.name ||
      !deviceRequestData.data
    ) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Insert a new device entry
    await db
      .insert(device)
      .values({
        uid: deviceRequestData.uid,
        name: deviceRequestData.name,
        data: deviceRequestData.data,
        description: deviceRequestData.description || "test",
        created_at: new Date(),
        updated_at: new Date(),
      })
      .execute();

    // Insert into deviceActions table
    await db
      .insert(deviceActions)
      .values({
        uid: deviceRequestData.uid,
        name: deviceRequestData.name,
        commands: null,
      })
      .execute();

    return NextResponse.json({
      message: "New device entry and command inserted.",
    });
  } catch (err) {
    console.error("Error executing query", (err as Error).stack);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
