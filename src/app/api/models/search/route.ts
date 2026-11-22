import { NextRequest, NextResponse } from "next/server";
import { globalSearch } from "@/lib/db-service";
import { searchSuggestionsSchema } from "@/lib/validations";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const q = searchParams.get("q") ?? "";
    const limit = searchParams.get("limit");

    const validated = searchSuggestionsSchema.safeParse({
      q,
      limit: limit ? Number(limit) : undefined,
    });

    if (!validated.success) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid search query parameter",
          details: validated.error.flatten(),
        },
        { status: 400 }
      );
    }

    const results = await globalSearch(validated.data.q, validated.data.limit);

    return NextResponse.json({
      success: true,
      data: results,
    });
  } catch (error) {
    console.error("GET /api/models/search error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to perform search query" },
      { status: 500 }
    );
  }
}
