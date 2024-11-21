import { db } from "@/db/drizzle";
import { deviceCommands } from "@/db/schema";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { deviceCommandInsertData } = await req.json();

    // Ensure all required fields are present
    if (
      !deviceCommandInsertData.uid ||
      !deviceCommandInsertData.name ||
      !deviceCommandInsertData.commands
    ) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }
    // Insert into deviceCommands table
    await db
      .insert(deviceCommands)
      .values({
        uid: deviceCommandInsertData.uid,
        name: deviceCommandInsertData.name,
        commands: deviceCommandInsertData.commands,
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
