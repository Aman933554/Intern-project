import { NextResponse } from "next/server";
import { getProviders } from "@/lib/db-service";

export async function GET() {
  try {
    const providers = await getProviders();
    return NextResponse.json({
      success: true,
      data: providers,
      count: providers.length,
    });
  } catch (error) {
    console.error("GET /api/providers error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to retrieve providers list" },
      { status: 500 }
    );
  }
}
