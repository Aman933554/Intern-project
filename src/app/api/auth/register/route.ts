import { NextRequest, NextResponse } from "next/server";
import { registerUser } from "@/lib/auth-service";
import { z } from "zod";

const registerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters").optional(),
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

    return NextResponse.json({
      success: true,
      data: session,
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || "Failed to create account" },
      { status: 400 }
    );
  }
}
