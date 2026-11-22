import { NextRequest, NextResponse } from "next/server";
import { compareModels } from "@/lib/db-service";
import { compareRequestSchema } from "@/lib/validations";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validated = compareRequestSchema.safeParse(body);

    if (!validated.success) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid comparison payload",
          details: validated.error.flatten(),
        },
        { status: 400 }
      );
    }

    const comparison = await compareModels(validated.data.modelSlugs);

    return NextResponse.json({
      success: true,
      data: comparison,
    });
  } catch (error) {
    console.error("POST /api/compare error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to perform model comparison" },
      { status: 500 }
    );
  }
}
