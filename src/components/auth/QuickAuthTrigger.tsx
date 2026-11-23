"use client";

import React from "react";
import { useAuth } from "@/context/AuthContext";
import { Sparkles, ArrowRight, UserCheck } from "lucide-react";
import { useRouter } from "next/navigation";

export function QuickAuthTrigger() {
  const { login, openAuthModal, user } = useAuth();
  const router = useRouter();

  const handleQuickAman = async () => {
    const ok = await login("sharmaaman9318411@gmail.com", "password123");
    if (ok) {
      router.push("/");
    }
  };

  const handleQuickDemo = async () => {
    const ok = await login("demo@oneatlas.dev", "password123");
    if (ok) {
      router.push("/");
    }
  };

  return (
    <div className="mt-6 w-full max-w-[390px] p-4 rounded-xl bg-surface-100 border border-surface-300 text-center space-y-3 shadow-lg">
      <div className="flex items-center justify-center gap-1.5 text-xs font-semibold text-gray-300">
        <Sparkles className="w-3.5 h-3.5 text-electric-blue" />
        <span>Direct 1-Click Fast Sign In (No Setup Required)</span>
      </div>

      <div className="flex flex-col gap-2">
        <button
          onClick={handleQuickAman}
          className="w-full py-2 px-3 rounded-lg bg-electric-blue hover:bg-electric-blue-600 text-white text-xs font-semibold shadow-glow flex items-center justify-center gap-2 transition-all cursor-pointer"
        >
          <UserCheck className="w-4 h-4" />
          <span>Login as sharmaaman9318411@gmail.com</span>
        </button>

        <button
          onClick={handleQuickDemo}
          className="w-full py-2 px-3 rounded-lg bg-surface-200 hover:bg-surface-300 border border-surface-300 text-gray-200 text-xs font-medium flex items-center justify-center gap-2 transition-colors cursor-pointer"
        >
          <span>Login with Demo Engineer (demo@oneatlas.dev)</span>
        </button>
      </div>

      <div className="text-[11px] text-gray-400">
        Or use Google button above for 1-click Clerk OAuth.
      </div>
    </div>
  );
}
