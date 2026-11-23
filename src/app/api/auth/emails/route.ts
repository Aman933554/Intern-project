import { NextRequest, NextResponse } from "next/server";
import { getSentEmails } from "@/lib/email-service";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get("email");

    let logs = getSentEmails();
    if (email) {
      logs = logs.filter((l) => l.to.toLowerCase() === email.toLowerCase());
    }

    return NextResponse.json({
      success: true,
      emails: logs,
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message },
      { status: 500 }
    );
  }
}
