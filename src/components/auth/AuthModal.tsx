"use client";

import React, { useState } from "react";
import Link from "next/link";
import { X, Mail, Lock, User, Sparkles, ArrowRight, Check, ShieldCheck } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

export const AuthModal: React.FC = () => {
  const { isAuthModalOpen, closeAuthModal, login, register, loginDemo, isClerkActive } = useAuth();
  const [mode, setMode] = useState<"login" | "register">("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  if (!isAuthModalOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (mode === "login") {
        await login(email, password);
      } else {
        await register(name, email, password);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDemo = async () => {
    setLoading(true);
    try {
      await loginDemo();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Account Authentication"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-150"
    >
      <div className="w-full max-w-md bg-card border border-surface-300 rounded-2xl shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-surface-300 relative">
          <button
            onClick={closeAuthModal}
            className="absolute top-5 right-5 text-gray-400 hover:text-white p-1 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-electric-blue to-violet flex items-center justify-center shadow-glow">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-white text-base">OneAtlas Account</span>
          </div>
          <p className="text-xs text-gray-400">
            Sign in to bookmark foundation models, customize comparison docks, and track token quotas.
          </p>

          {/* Mode Switch Tabs */}
          <div className="flex rounded-lg bg-surface-100 p-1 mt-4 border border-surface-300">
            <button
              type="button"
              onClick={() => setMode("login")}
              className={`flex-1 py-1.5 rounded-md text-xs font-semibold transition-all ${
                mode === "login"
                  ? "bg-electric-blue text-white shadow-glow"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => setMode("register")}
              className={`flex-1 py-1.5 rounded-md text-xs font-semibold transition-all ${
                mode === "register"
                  ? "bg-electric-blue text-white shadow-glow"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              Create Account
            </button>
          </div>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {isClerkActive && (
            <div className="mb-4">
              <Link
                href={mode === "login" ? "/sign-in" : "/sign-up"}
                onClick={closeAuthModal}
                className="w-full py-2.5 rounded-lg bg-gradient-to-r from-electric-blue to-violet text-white text-xs font-semibold shadow-glow flex items-center justify-center gap-2 hover:opacity-90 transition-opacity"
              >
                <ShieldCheck className="w-4 h-4" />
                <span>Open Official Clerk {mode === "login" ? "Sign In" : "Sign Up"} Page</span>
              </Link>
              <div className="relative my-4 text-center">
                <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-surface-300" /></div>
                <span className="relative bg-card px-2 text-[10px] text-gray-500 uppercase tracking-wider">or sign in below</span>
              </div>
            </div>
          )}
          {mode === "register" && (
            <div>
              <label className="block text-xs font-medium text-gray-300 mb-1">
                Full Name
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-gray-500 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Alex Chen"
                  className="w-full pl-9 pr-3 py-2 rounded-lg bg-surface-100 border border-surface-300 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-electric-blue transition-colors"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-medium text-gray-300 mb-1">
              Email Address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-gray-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="developer@company.com"
                className="w-full pl-9 pr-3 py-2 rounded-lg bg-surface-100 border border-surface-300 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-electric-blue transition-colors"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-300 mb-1">
              Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-gray-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-9 pr-3 py-2 rounded-lg bg-surface-100 border border-surface-300 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-electric-blue transition-colors"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 rounded-lg bg-electric-blue hover:bg-electric-blue-600 disabled:opacity-50 text-white text-xs font-semibold shadow-glow transition-all flex items-center justify-center gap-1.5"
          >
            <span>{mode === "login" ? "Sign In to Account" : "Create Account"}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>

          {/* Quick Demo Login Option */}
          <div className="pt-2">
            <button
              type="button"
              onClick={handleDemo}
              disabled={loading}
              className="w-full py-2 rounded-lg bg-surface-200 hover:bg-surface-300 border border-surface-300 text-gray-300 text-xs font-medium transition-colors flex items-center justify-center gap-1.5"
            >
              <Sparkles className="w-3.5 h-3.5 text-violet" />
              <span>One-Click Demo Login (demo@oneatlas.dev)</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
