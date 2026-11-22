import { NextRequest, NextResponse } from "next/server";
import { loginUser } from "@/lib/auth-service";
import { z } from "zod";

const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required").optional(),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validated = loginSchema.safeParse(body);

    if (!validated.success) {
      return NextResponse.json(
        { success: false, error: validated.error.errors[0]?.message || "Invalid credentials" },
        { status: 400 }
      );
    }

    const session = await loginUser(validated.data.email, validated.data.password);

    return NextResponse.json({
      success: true,
      data: session,
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || "Invalid email or password" },
      { status: 401 }
    );
  }
}
