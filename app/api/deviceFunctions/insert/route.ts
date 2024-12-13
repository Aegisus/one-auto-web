import { db } from "@/db/drizzle";
import { deviceFunctions } from "@/db/schema";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { deviceFunctionInsertData } = await req.json();

    // Ensure all required fields are present
    if (
      !deviceFunctionInsertData.uid ||
      !deviceFunctionInsertData.name ||
      !deviceFunctionInsertData.commands
    ) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }
    // Insert into deviceCommands table
    await db
      .insert(deviceFunctions)
      .values({
        uid: deviceFunctionInsertData.uid,
        name: deviceFunctionInsertData.name,
        functions: deviceFunctionInsertData.functions,
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
