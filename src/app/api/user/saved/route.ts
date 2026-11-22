import { NextRequest, NextResponse } from "next/server";
import { getSavedModelSlugs, toggleSavedModel } from "@/lib/auth-service";
import { getModelBySlug } from "@/lib/db-service";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json(
        { success: false, error: "Authentication required" },
        { status: 401 }
      );
    }

    const slugs = await getSavedModelSlugs(userId);
    const models = [];
    for (const slug of slugs) {
      const detail = await getModelBySlug(slug);
      if (detail) models.push(detail);
    }

    return NextResponse.json({
      success: true,
      data: models,
      slugs,
      count: models.length,
    });
  } catch (err: any) {
    console.error("GET /api/user/saved error:", err);
    return NextResponse.json(
      { success: false, error: "Failed to retrieve saved models" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, modelSlug } = body;

    if (!userId || !modelSlug) {
      return NextResponse.json(
        { success: false, error: "userId and modelSlug are required" },
        { status: 400 }
      );
    }

    const result = await toggleSavedModel(userId, modelSlug);

    return NextResponse.json({
      success: true,
      isSaved: result.isSaved,
      count: result.count,
    });
  } catch (err: any) {
    console.error("POST /api/user/saved error:", err);
    return NextResponse.json(
      { success: false, error: "Failed to toggle saved model" },
      { status: 500 }
    );
  }
}
