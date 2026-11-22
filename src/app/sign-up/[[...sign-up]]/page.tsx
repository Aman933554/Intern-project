import React, { Suspense } from "react";
import Link from "next/link";
import { SignUp } from "@clerk/nextjs";
import { Key, Sparkles, ShieldCheck } from "lucide-react";

export const metadata = {
  title: "Create Account – OneAtlas.dev",
  description: "Create an account on OneAtlas to save, benchmark, and evaluate AI foundation models.",
};

export default function SignUpPage() {
  const publishableKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;
  const isClerkReady = Boolean(
    publishableKey &&
    publishableKey.startsWith("pk_") &&
    !publishableKey.includes("YOUR_")
  );

  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center px-4 py-12">
      {isClerkReady ? (
        <div className="w-full flex flex-col items-center">
          <div className="mb-6 text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-violet/15 border border-violet/30 text-xs text-violet font-medium mb-3">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Clerk Authentication Enabled</span>
            </div>
            <h1 className="text-2xl font-bold text-white tracking-tight">Create Your Account</h1>
            <p className="text-xs text-gray-400 mt-1">Get started with AI Model Intelligence and custom workspaces</p>
          </div>

          <div className="bg-card border border-surface-300 rounded-2xl p-2 shadow-2xl">
            <Suspense
              fallback={
                <div className="w-[380px] h-[450px] flex items-center justify-center text-xs text-gray-400">
                  Loading Clerk Sign Up...
                </div>
              }
            >
              <SignUp
                path="/sign-up"
                routing="path"
                signInUrl="/sign-in"
                appearance={{
                  elements: {
                    card: "bg-transparent shadow-none border-none",
                    headerTitle: "text-white text-lg font-bold",
                    headerSubtitle: "text-gray-400 text-xs",
                    socialButtonsBlockButton: "bg-surface-200 border border-surface-300 text-white hover:bg-surface-300",
                    formButtonPrimary: "bg-electric-blue hover:bg-electric-blue-600 text-white font-medium shadow-glow",
                    formFieldInput: "bg-surface-100 border-surface-300 text-white focus:border-electric-blue",
                    footerActionLink: "text-electric-blue hover:underline",
                  },
                }}
              />
            </Suspense>
          </div>
        </div>
      ) : (
        <div className="max-w-lg w-full bg-card border border-surface-300 rounded-2xl p-6 sm:p-8 shadow-2xl space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet to-electric-blue flex items-center justify-center text-white shadow-glow-violet">
              <Key className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">Clerk Registration Ready</h1>
              <p className="text-xs text-gray-400">Next.js 14 + @clerk/nextjs configured</p>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-surface-100 border border-surface-300 text-xs space-y-3">
            <div className="font-semibold text-gray-200 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-violet" />
              <span>To activate live Clerk Auth with your account:</span>
            </div>
            <ol className="list-decimal list-inside space-y-1.5 text-gray-300">
              <li>Open <a href="https://dashboard.clerk.com" target="_blank" rel="noreferrer" className="text-electric-blue underline font-mono">dashboard.clerk.com</a> and create a free project.</li>
              <li>Go to <strong>API Keys</strong> and copy your <code>Publishable key</code> & <code>Secret key</code>.</li>
              <li>Add them to your <code>.env</code> file:</li>
            </ol>
            <div className="p-2.5 rounded bg-black/60 font-mono text-[11px] text-gray-300 border border-surface-300 overflow-x-auto">
              NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...<br />
              CLERK_SECRET_KEY=sk_test_...
            </div>
          </div>

          <div className="border-t border-surface-300 pt-5">
            <div className="flex flex-col sm:flex-row items-center gap-3">
              <Link
                href="/models"
                className="w-full sm:w-auto flex-1 text-center px-4 py-2.5 rounded-lg bg-electric-blue hover:bg-electric-blue-600 text-white text-xs font-semibold shadow-glow transition-all"
              >
                Browse Models
              </Link>
              <Link
                href="/"
                className="w-full sm:w-auto px-4 py-2.5 rounded-lg bg-surface-200 hover:bg-surface-300 text-gray-300 text-xs font-semibold border border-surface-300 transition-colors"
              >
                Return to Dashboard
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
