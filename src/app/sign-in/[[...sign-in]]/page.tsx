"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Mail, Lock, Sparkles, ArrowRight, Eye, EyeOff, AlertCircle, ShieldCheck, CheckCircle2 } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

export default function SignInPage() {
  const router = useRouter();
  const { user, login, loginDemo, logout } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await login(email, password);
      if (res.success) {
        router.push("/");
      } else {
        setError(res.error || "Invalid email or password. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = async () => {
    setError(null);
    setLoading(true);
    try {
      await loginDemo();
      router.push("/");
    } finally {
      setLoading(false);
    }
  };

  if (user) {
    return (
      <div className="min-h-[75vh] flex flex-col items-center justify-center px-4 py-12">
        <div className="max-w-md w-full bg-card border border-surface-300 rounded-2xl p-8 shadow-2xl text-center space-y-5">
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white">Already Signed In</h1>
            <p className="text-xs text-gray-400 mt-1">
              You are currently signed in as <span className="text-white font-medium">{user.name}</span> ({user.email})
            </p>
          </div>
          <div className="flex flex-col gap-2.5 pt-2">
            <Link
              href="/"
              className="w-full py-2.5 rounded-lg bg-electric-blue hover:bg-electric-blue-600 text-white text-xs font-semibold shadow-glow transition-all"
            >
              Go to Home & Dashboard
            </Link>
            <button
              onClick={logout}
              className="w-full py-2.5 rounded-lg bg-surface-200 hover:bg-red-500/15 border border-surface-300 text-gray-300 hover:text-red-400 text-xs font-medium transition-colors cursor-pointer"
            >
              Sign Out
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-electric-blue/15 border border-electric-blue/30 text-xs text-electric-blue font-medium mb-3">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>OneAtlas Original Authentication</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">Sign In</h1>
          <p className="text-xs text-gray-400 mt-1.5">
            Enter your email and password to access your bookmarked models and workspaces
          </p>
        </div>

        {/* Card */}
        <div className="bg-card border border-surface-300 rounded-2xl p-6 sm:p-8 shadow-2xl space-y-5">
          {error && (
            <div className="p-3.5 rounded-xl bg-red-500/15 border border-red-500/30 text-xs text-red-300 flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-400 mt-0.5" />
              <div className="flex-1">
                <span className="font-semibold block">Authentication Error</span>
                <span>{error}</span>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-gray-300 mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-gray-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@company.com"
                  className="w-full pl-10 pr-3.5 py-2.5 rounded-lg bg-surface-100 border border-surface-300 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-electric-blue transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-300 mb-1.5">
                Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-gray-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-10 py-2.5 rounded-lg bg-surface-100 border border-surface-300 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-electric-blue transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 cursor-pointer"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 rounded-lg bg-electric-blue hover:bg-electric-blue-600 disabled:opacity-50 text-white text-xs font-semibold shadow-glow transition-all flex items-center justify-center gap-2 cursor-pointer mt-2"
            >
              <span>{loading ? "Signing in..." : "Sign In to Account"}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </form>

          {/* 1-Click Demo Login */}
          <div className="pt-3 border-t border-surface-300">
            <button
              type="button"
              onClick={handleDemoLogin}
              disabled={loading}
              className="w-full py-2.5 rounded-lg bg-surface-200 hover:bg-surface-300 border border-surface-300 text-gray-200 text-xs font-medium transition-colors flex items-center justify-center gap-2 cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 text-violet" />
              <span>Instant 1-Click Demo (demo@oneatlas.dev)</span>
            </button>
          </div>

          {/* Switch to Sign Up */}
          <div className="text-center pt-2">
            <p className="text-xs text-gray-400">
              Don&apos;t have an account?{" "}
              <Link href="/sign-up" className="text-electric-blue font-semibold hover:underline">
                Create an account
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
