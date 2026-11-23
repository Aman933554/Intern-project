import { NextRequest, NextResponse } from "next/server";
import { registerUser } from "@/lib/auth-service";
import { z } from "zod";

const registerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validated = registerSchema.safeParse(body);

    if (!validated.success) {
      return NextResponse.json(
        { success: false, error: validated.error.errors[0]?.message || "Invalid input" },
        { status: 400 }
      );
    }

    const session = await registerUser(
      validated.data.name,
      validated.data.email,
      validated.data.password
    );

    const response = NextResponse.json({
      success: true,
      data: session,
    });

    response.cookies.set("oneatlas_session", JSON.stringify(session), {
      path: "/",
      maxAge: 60 * 60 * 24 * 30, // 30 days
      sameSite: "lax",
    });

    return response;
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || "Failed to create account" },
      { status: 400 }
    );
  }
}
