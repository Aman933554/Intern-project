import { NextRequest, NextResponse } from "next/server";
import { getProviderBySlug } from "@/lib/db-service";

export async function GET(
  _request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const slug = params.slug;
    const provider = await getProviderBySlug(slug);

    if (!provider) {
      return NextResponse.json(
        { success: false, error: `Provider '${slug}' not found` },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: provider,
    });
  } catch (error) {
    console.error(`GET /api/providers/${params.slug} error:`, error);
    return NextResponse.json(
      { success: false, error: "Failed to retrieve provider details" },
      { status: 500 }
    );
  }
}
