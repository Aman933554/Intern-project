import { NextRequest, NextResponse } from "next/server";
import { getModels } from "@/lib/db-service";
import { modelsQuerySchema } from "@/lib/validations";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    const rawQuery: Record<string, any> = {};
    searchParams.forEach((value, key) => {
      rawQuery[key] = value;
    });

    const validated = modelsQuerySchema.safeParse(rawQuery);

    if (!validated.success) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid query parameters",
          details: validated.error.flatten(),
        },
        { status: 400 }
      );
    }

    const result = await getModels(validated.data);

    return NextResponse.json({
      success: true,
      data: result.data,
      pagination: result.pagination,
    });
  } catch (error) {
    console.error("GET /api/models error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to retrieve models from database",
      },
      { status: 500 }
    );
  }
}
