import { NextResponse } from "next/server";
import { getBenchmarks } from "@/lib/db-service";

export async function GET() {
  try {
    const benchmarks = await getBenchmarks();
    return NextResponse.json({
      success: true,
      data: benchmarks,
    });
  } catch (error) {
    console.error("GET /api/benchmarks error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to retrieve benchmarks catalog" },
      { status: 500 }
    );
  }
}
