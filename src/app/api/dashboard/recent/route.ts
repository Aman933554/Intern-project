import { NextResponse } from "next/server";
import { getDashboardStats } from "@/lib/db-service";

export async function GET() {
  try {
    const stats = await getDashboardStats();
    return NextResponse.json({
      success: true,
      data: stats.recentlyAddedModels,
      count: stats.recentlyAddedModels.length,
    });
  } catch (error) {
    console.error("GET /api/dashboard/recent error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to load recently added models" },
      { status: 500 }
    );
  }
}
