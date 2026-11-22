import { NextRequest, NextResponse } from "next/server";
import { getRankings } from "@/lib/db-service";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category") ?? undefined;

    const data = await getRankings(category);

    return NextResponse.json({
      success: true,
      data,
    });
  } catch (error) {
    console.error("GET /api/rankings error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to retrieve model rankings" },
      { status: 500 }
    );
  }
}
