import { NextResponse } from "next/server";
import { getCompanies } from "@/lib/db-service";

export async function GET() {
  try {
    const companies = await getCompanies();
    return NextResponse.json({
      success: true,
      data: companies,
      count: companies.length,
    });
  } catch (error) {
    console.error("GET /api/companies error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to retrieve companies list" },
      { status: 500 }
    );
  }
}
