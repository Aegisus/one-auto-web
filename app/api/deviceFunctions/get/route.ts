import { db } from "@/db/drizzle";
import { deviceFunctions } from "@/db/schema";
import { NextResponse } from "next/server";
import { unstable_noStore as noStore } from "next/cache";

export const dynamic = "force-dynamic";

export async function GET() {
  noStore();
  try {
    const allDeviceFunctions = await db.select().from(deviceFunctions);
    // console.log(allDeviceCommands);
    return new NextResponse(JSON.stringify(allDeviceFunctions), {
      headers: {
        "Cache-Control": "no-store, must-revalidate", // Disable caching
        Pragma: "no-cache", // HTTP 1.0 backward compatibility
        Expires: "0", // Proxies and older browsers
      },
    });
  } catch (error) {
    if (error instanceof Error) {
      console.error("Error fetching devices:", error.message);
      return NextResponse.json(
        { error: "Failed to fetch devices", details: error.message },
        { status: 500 }
      );
    } else {
      console.error("Unknown error fetching devices:", error);
      return NextResponse.json(
        { error: "An unknown error occurred" },
        { status: 500 }
      );
    }
  }
}
