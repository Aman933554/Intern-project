import { NextResponse } from "next/server";
import { getDashboardStats } from "@/lib/db-service";

export async function GET() {
  try {
    const stats = await getDashboardStats();
    return NextResponse.json({
      success: true,
      data: stats.trendingModels,
      count: stats.trendingModels.length,
    });
  } catch (error) {
    console.error("GET /api/dashboard/trending error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to load trending models" },
      { status: 500 }
    );
  }
}
