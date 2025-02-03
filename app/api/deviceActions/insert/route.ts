import { db } from "@/db/drizzle";
import { deviceActions } from "@/db/schema";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { deviceActionInsertData } = await req.json();

    // Ensure all required fields are present
    if (
      !deviceActionInsertData.uid ||
      !deviceActionInsertData.name ||
      !deviceActionInsertData.commands
    ) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }
    // Insert into deviceCommands table
    await db
      .insert(deviceActions)
      .values({
        uid: deviceActionInsertData.uid,
        name: deviceActionInsertData.name,
        functions: deviceActionInsertData.functions,
        commands: deviceActionInsertData.commands,
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
