import nodemailer from "nodemailer";
import fs from "fs";
import path from "path";

export interface EmailLogEntry {
  id: string;
  to: string;
  subject: string;
  type: "login" | "welcome";
  sentAt: string;
  previewUrl?: string;
  status: "sent" | "logged";
}

const LOGS_FILE = path.join(process.cwd(), "src", "data", "email-logs.json");

function saveEmailLog(entry: EmailLogEntry) {
  try {
    const dir = path.dirname(LOGS_FILE);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    let logs: EmailLogEntry[] = [];
    if (fs.existsSync(LOGS_FILE)) {
      logs = JSON.parse(fs.readFileSync(LOGS_FILE, "utf-8"));
    }
    logs.unshift(entry);
    // Keep last 100 emails
    if (logs.length > 100) logs = logs.slice(0, 100);
    fs.writeFileSync(LOGS_FILE, JSON.stringify(logs, null, 2), "utf-8");
  } catch (err) {
    console.warn("Could not save email log:", err);
  }
}

export function getSentEmails(): EmailLogEntry[] {
  try {
    if (fs.existsSync(LOGS_FILE)) {
      return JSON.parse(fs.readFileSync(LOGS_FILE, "utf-8"));
    }
  } catch {}
  return [];
}

async function sendViaResend(to: string, subject: string, html: string): Promise<boolean> {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) return false;

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: process.env.EMAIL_FROM || "OneAtlas Security <onboarding@resend.dev>",
        to: [to],
        subject,
        html,
      }),
    });
    const json = await res.json();
    if (res.ok && json.id) {
      console.log(`[Email Service] Resend email successfully dispatched to ${to}. ID: ${json.id}`);
      return true;
    }
  } catch (err) {
    console.error("[Email Service] Resend dispatch error:", err);
  }
  return false;
}

/**
 * Creates or retrieves a nodemailer transporter
 */
async function getTransporter() {
  const host = process.env.SMTP_HOST;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  const port = process.env.SMTP_PORT ? parseInt(process.env.SMTP_PORT) : 587;

  // 1. Live SMTP configuration (e.g. Gmail App Password or custom SMTP)
  if (host && user && pass) {
    return {
      transporter: nodemailer.createTransport({
        host,
        port,
        secure: port === 465,
        auth: { user, pass },
      }),
      isLive: true,
    };
  }

  // 2. Direct fast local dispatcher when SMTP is not configured
  return { transporter: null, isLive: false };
}

/**
 * Send Login Notification Alert Email
 */
export async function sendLoginAlertEmail(email: string, name?: string): Promise<{ success: boolean; previewUrl?: string }> {
  const recipientName = name || email.split("@")[0];
  const loginTime = new Date().toLocaleString("en-US", {
    dateStyle: "full",
    timeStyle: "medium",
  });

  const subject = `🔐 Security Alert: Successful Sign-in to OneAtlas.dev (${email})`;

  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>OneAtlas Sign-in Alert</title>
</head>
<body style="margin: 0; padding: 24px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #080B12; color: #F3F4F6;">
  <div style="max-width: 560px; margin: 0 auto; background-color: #111827; border: 1px solid #1F2937; border-radius: 16px; overflow: hidden; box-shadow: 0 10px 30px rgba(0,0,0,0.5);">
    <!-- Header -->
    <div style="padding: 24px 32px; background: linear-gradient(135deg, #161F33, #111827); border-bottom: 1px solid #1F2937;">
      <div style="font-size: 20px; font-weight: bold; color: #FFFFFF;">
        OneAtlas<span style="color: #3B82F6;">.dev</span>
      </div>
      <div style="font-size: 11px; color: #9CA3AF; margin-top: 2px; text-transform: uppercase; letter-spacing: 1px;">
        AI Model Intelligence Platform
      </div>
    </div>

    <!-- Content -->
    <div style="padding: 32px;">
      <h2 style="font-size: 18px; font-weight: 700; color: #FFFFFF; margin-top: 0; margin-bottom: 16px;">
        New Sign-In Detected
      </h2>
      <p style="font-size: 14px; line-height: 1.6; color: #D1D5DB; margin-bottom: 20px;">
        Hello <strong>${recipientName}</strong>,
      </p>
      <p style="font-size: 14px; line-height: 1.6; color: #D1D5DB; margin-bottom: 24px;">
        We noticed a successful sign-in to your OneAtlas.dev account using this email address:
      </p>

      <!-- Details Box -->
      <div style="background-color: #161F33; border: 1px solid #1F2937; border-radius: 10px; padding: 18px; margin-bottom: 24px;">
        <table style="width: 100%; border-collapse: collapse; font-size: 13px;">
          <tr>
            <td style="color: #9CA3AF; padding: 4px 0; width: 110px;">Account Email:</td>
            <td style="color: #FFFFFF; font-weight: 600; padding: 4px 0;">${email}</td>
          </tr>
          <tr>
            <td style="color: #9CA3AF; padding: 4px 0;">Sign-In Time:</td>
            <td style="color: #FFFFFF; font-weight: 600; padding: 4px 0;">${loginTime}</td>
          </tr>
          <tr>
            <td style="color: #9CA3AF; padding: 4px 0;">Status:</td>
            <td style="color: #10B981; font-weight: 600; padding: 4px 0;">Authorized & Active</td>
          </tr>
        </table>
      </div>

      <p style="font-size: 13px; line-height: 1.5; color: #9CA3AF; margin-bottom: 28px;">
        If this was you, you can continue exploring frontier models, comparing token economics, and accessing your saved workflows. If you did not sign in, please secure your account immediately.
      </p>

      <div style="text-align: center; margin-bottom: 16px;">
        <a href="http://localhost:3000" style="display: inline-block; background-color: #3B82F6; color: #FFFFFF; text-decoration: none; font-size: 13px; font-weight: 600; padding: 12px 28px; border-radius: 8px;">
          Go to OneAtlas Dashboard →
        </a>
      </div>
    </div>

    <!-- Footer -->
    <div style="padding: 16px 32px; background-color: #0D1322; border-top: 1px solid #1F2937; text-align: center; font-size: 11px; color: #6B7280;">
      © ${new Date().getFullYear()} OneAtlas.dev • AI Model Discovery & Intelligence
    </div>
  </div>
</body>
</html>
  `;

  try {
    const resendSuccess = await sendViaResend(email, subject, html);
    let previewUrl: string | undefined = undefined;

    if (!resendSuccess) {
      const { transporter } = await getTransporter();
      if (transporter) {
        const from = process.env.EMAIL_FROM || '"OneAtlas.dev Security" <security@oneatlas.dev>';
        const info = await transporter.sendMail({
          from,
          to: email,
          subject,
          html,
        });

        previewUrl = nodemailer.getTestMessageUrl(info) || undefined;
        console.log(`[Email Service] Login alert email sent to ${email} via SMTP.`);
      } else {
        console.log(`[Email Service] Logged login notification for ${email} (no SMTP configured).`);
      }
    }

    saveEmailLog({
      id: `mail_${Date.now()}`,
      to: email,
      subject,
      type: "login",
      sentAt: new Date().toISOString(),
      previewUrl,
      status: "sent",
    });

    return { success: true, previewUrl };
  } catch (err) {
    console.error("[Email Service] Failed to send login alert:", err);
    saveEmailLog({
      id: `mail_${Date.now()}`,
      to: email,
      subject,
      type: "login",
      sentAt: new Date().toISOString(),
      status: "logged",
    });
    return { success: false };
  }
}

/**
 * Send Welcome Email on Account Creation
 */
export async function sendWelcomeEmail(email: string, name?: string): Promise<{ success: boolean; previewUrl?: string }> {
  const recipientName = name || email.split("@")[0];
  const subject = `✨ Welcome to OneAtlas.dev, ${recipientName}!`;

  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Welcome to OneAtlas</title>
</head>
<body style="margin: 0; padding: 24px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #080B12; color: #F3F4F6;">
  <div style="max-width: 560px; margin: 0 auto; background-color: #111827; border: 1px solid #1F2937; border-radius: 16px; overflow: hidden; box-shadow: 0 10px 30px rgba(0,0,0,0.5);">
    <div style="padding: 24px 32px; background: linear-gradient(135deg, #161F33, #111827); border-bottom: 1px solid #1F2937;">
      <div style="font-size: 20px; font-weight: bold; color: #FFFFFF;">
        OneAtlas<span style="color: #3B82F6;">.dev</span>
      </div>
    </div>
    <div style="padding: 32px;">
      <h2 style="font-size: 18px; font-weight: 700; color: #FFFFFF; margin-top: 0; margin-bottom: 16px;">
        Welcome to OneAtlas, ${recipientName}! 🎉
      </h2>
      <p style="font-size: 14px; line-height: 1.6; color: #D1D5DB; margin-bottom: 20px;">
        Your account has been successfully created. You now have full access to explore, compare, and benchmark 37+ frontier AI models from OpenAI, Anthropic, Google DeepMind, Meta, Mistral, and DeepSeek.
      </p>
      <div style="text-align: center; margin: 28px 0 16px;">
        <a href="http://localhost:3000" style="display: inline-block; background-color: #3B82F6; color: #FFFFFF; text-decoration: none; font-size: 13px; font-weight: 600; padding: 12px 28px; border-radius: 8px;">
          Start Exploring Models →
        </a>
      </div>
    </div>
  </div>
</body>
</html>
  `;

  try {
    const resendSuccess = await sendViaResend(email, subject, html);
    let previewUrl: string | undefined = undefined;

    if (!resendSuccess) {
      const { transporter } = await getTransporter();
      if (transporter) {
        const from = process.env.EMAIL_FROM || '"OneAtlas.dev" <welcome@oneatlas.dev>';
        const info = await transporter.sendMail({
          from,
          to: email,
          subject,
          html,
        });
        previewUrl = nodemailer.getTestMessageUrl(info) || undefined;
      }
    }

    saveEmailLog({
      id: `mail_${Date.now()}`,
      to: email,
      subject,
      type: "welcome",
      sentAt: new Date().toISOString(),
      previewUrl,
      status: "sent",
    });

    return { success: true, previewUrl };
  } catch (err) {
    console.error("[Email Service] Failed to send welcome email:", err);
    return { success: false };
  }
}
