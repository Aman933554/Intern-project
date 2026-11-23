"use client";

import React from "react";
import { useAuth } from "@/context/AuthContext";
import { Sparkles, UserCheck } from "lucide-react";
import { useRouter } from "next/navigation";

export function QuickAuthTrigger() {
  const { login, user } = useAuth();
  const router = useRouter();

  const handleQuickAman = async () => {
    const res = await login("sharmaaman9318411@gmail.com", "password123");
    if (res.success) {
      router.push("/");
    }
  };

  const handleQuickDemo = async () => {
    const res = await login("demo@oneatlas.dev", "password123");
    if (res.success) {
      router.push("/");
    }
  };

  if (user) {
    return (
      <div className="mt-4 p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-400 text-center">
        Signed in as <strong>{user.email}</strong>. <button onClick={() => router.push("/")} className="underline font-semibold ml-1">Go to Dashboard</button>
      </div>
    );
  }

  return (
    <div className="mt-6 w-full max-w-[420px] p-4 rounded-xl bg-surface-100 border border-surface-300 text-center space-y-3 shadow-lg">
      <div className="flex items-center justify-center gap-1.5 text-xs font-semibold text-gray-300">
        <Sparkles className="w-3.5 h-3.5 text-electric-blue" />
        <span>Instant 1-Click Fast Sign In</span>
      </div>

      <div className="flex flex-col gap-2">
        <button
          onClick={handleQuickDemo}
          className="w-full py-2 px-3 rounded-lg bg-electric-blue hover:bg-electric-blue-600 text-white text-xs font-semibold shadow-glow flex items-center justify-center gap-2 transition-all cursor-pointer"
        >
          <UserCheck className="w-4 h-4" />
          <span>Quick Demo: demo@oneatlas.dev</span>
        </button>
      </div>

      <div className="text-[11px] text-gray-400">
        Or use the form above with your email and password.
      </div>
    </div>
  );
}
