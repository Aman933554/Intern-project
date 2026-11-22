import { NextRequest, NextResponse } from "next/server";
import { getCompanyBySlug } from "@/lib/db-service";

export async function GET(
  _request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const slug = params.slug;
    const company = await getCompanyBySlug(slug);

    if (!company) {
      return NextResponse.json(
        { success: false, error: `Company '${slug}' not found` },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: company,
    });
  } catch (error) {
    console.error(`GET /api/companies/${params.slug} error:`, error);
    return NextResponse.json(
      { success: false, error: "Failed to retrieve company details" },
      { status: 500 }
    );
  }
}
