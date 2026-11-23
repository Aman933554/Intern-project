import { NextRequest, NextResponse } from "next/server";
import { loginUser } from "@/lib/auth-service";
import { sendLoginAlertEmail } from "@/lib/email-service";
import { z } from "zod";

const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(1, "Password is required"),
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

    // Send login alert notification email asynchronously
    sendLoginAlertEmail(session.email, session.name).catch((err) =>
      console.error("Login alert email error:", err)
    );

    const response = NextResponse.json({
      success: true,
      data: session,
      message: `Signed in successfully. Security notification sent to ${session.email}`,
    });

    response.cookies.set("oneatlas_session", JSON.stringify(session), {
      path: "/",
      maxAge: 60 * 60 * 24 * 30, // 30 days
      sameSite: "lax",
    });

    return response;
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || "Invalid email or password" },
      { status: 400 }
    );
  }
}
