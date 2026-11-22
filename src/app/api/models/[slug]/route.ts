import { NextRequest, NextResponse } from "next/server";
import { getModelBySlug } from "@/lib/db-service";

export async function GET(
  _request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const slug = params.slug;
    if (!slug) {
      return NextResponse.json(
        { success: false, error: "Model slug is required" },
        { status: 400 }
      );
    }

    const model = await getModelBySlug(slug);

    if (!model) {
      return NextResponse.json(
        { success: false, error: `Model with slug '${slug}' not found` },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: model,
    });
  } catch (error) {
    console.error(`GET /api/models/${params.slug} error:`, error);
    return NextResponse.json(
      { success: false, error: "Failed to retrieve model details" },
      { status: 500 }
    );
  }
}
