import { db } from "@/db";
import { device } from "@/db/schema";
import { NextResponse, NextRequest } from "next/server";
// import { sql } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export const dynamic = "force-dynamic";

// Function to force revalidate a path
export const forceRevalidate = (request: NextRequest) => {
  const path = request.nextUrl.searchParams.get("path") || "/";
  revalidatePath(path);
};

export async function GET() {
  try {
    const allDevice = await db.select().from(device);

    // Revalidate the path to ensure fresh data
    revalidatePath("/app/api/devices/get");

    return new NextResponse(JSON.stringify(allDevice), {
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

// import { db } from "@/db";
// import { device } from "@/db/schema";
// import { NextResponse, NextRequest } from "next/server";
// import { revalidatePath } from "next/cache";
// import { eq } from "drizzle-orm/expressions";

// export const dynamic = "force-dynamic";

// // Function to force revalidate a path
// export const forceRevalidate = (request: NextRequest) => {
//   const path = request.nextUrl.searchParams.get("path") || "/";
//   revalidatePath(path);
// };

// export async function GET() {
//   try {
//     // Fetch data
//     const query = db.select().from(device).where(eq(device.id, 7));
//     const result = await query;
//     console.log(result);

//     // Revalidate the path to ensure fresh data
//     revalidatePath("/app/api/devices/get");

//     return new NextResponse(JSON.stringify(result), {
//       headers: {
//         "Cache-Control": "no-store, must-revalidate", // Disable caching
//         Pragma: "no-cache", // HTTP 1.0 backward compatibility
//         Expires: "0", // Proxies and older browsers
//       },
//     });
//   } catch (error) {
//     if (error instanceof Error) {
//       console.error("Error fetching devices:", error.message);
//       return NextResponse.json(
//         { error: "Failed to fetch devices", details: error.message },
//         { status: 500 }
//       );
//     } else {
//       console.error("Unknown error fetching devices:", error);
//       return NextResponse.json(
//         { error: "An unknown error occurred" },
//         { status: 500 }
//       );
//     }
//   }
// }

// export async function GET() {
//   try {
//     // Fetch devices from the database
//     const allDevice = await db.select().from(device);

//     return NextResponse.json(allDevice);
//   } catch (error) {
//     const err = error as Error; // Cast error to Error type
//     console.error("Error fetching devices:", err.message);

//     return NextResponse.json(
//       { error: "Failed to fetch devices", details: err.message }, // Access err.message
//       { status: 500 }
//     );
//   }
// }

// import { NextRequest, NextResponse } from "next/server";
// import { eq } from "drizzle-orm";
// import { db } from "@/db";
// // import { getAuth } from "@clerk/nextjs/server";
// import { device, deviceCommands } from "@/db/schema";
// import {
//   PyvisaDevicesSchema,
//   ComportDevicesSchema,
// } from "@/db/zodDeviceSchema";

// // Mark this API route as dynamic to avoid static rendering
// export const dynamic = "force-dynamic";

// export async function GET(request: NextRequest) {
//   try {
//     // let user_org_id = null;
//     // const { userId } = getAuth(request);

//     // if (userId) {
//     //   user_org_id = db
//     //     .select({
//     //       organisation_id: usersInBlucloudCore.organisation_id,
//     //     })
//     //     .from(usersInBlucloudCore)
//     //     .where(eq(usersInBlucloudCore.oicd_user_id, userId?.toString() ?? ""));
//     // } else {
//     //   return NextResponse.json(
//     //     { error: "User ID is required" },
//     //     { status: 400 }
//     //   );
//     // }

//     const result = await db.select().from(device);

//     // Validate the payload using the Zod schema
//     const pyvisaValidatedData = PyvisaDevicesSchema.parse(parsedData);
//     const comportValidatedData = ComportDevicesSchema.parse(parsedData);

//     // If validation fails, return an error
//     if (!isValidated.success) {
//       return NextResponse.json(
//         { error: isValidated.error.errors },
//         { status: 400 }
//       );
//     }
//     console.log("Success reading devices");

//     // Return a success response
//     return NextResponse.json({
//       message: "Success to read devices",
//       data: isValidated.data,
//     });
//   } catch (error) {
//     console.error("Error reading devices:", error);

//     return NextResponse.json(
//       { error: "Failed to read devices" },
//       { status: 500 }
//     );
//   }
// }
