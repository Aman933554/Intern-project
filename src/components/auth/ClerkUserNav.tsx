"use client";

import React from "react";
import Link from "next/link";
import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import { Bookmark, User } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

export function ClerkUserNav() {
  const { savedSlugs } = useAuth();

  return (
    <div className="flex items-center gap-2.5">
      <SignedIn>
        <Link
          href="/saved"
          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-surface-200 hover:bg-surface-300 text-gray-300 hover:text-white text-xs border border-surface-300 transition-colors"
          title="Saved Models"
        >
          <Bookmark className="w-3.5 h-3.5 text-electric-blue" />
          <span className="hidden sm:inline">Saved</span>
          <span className="text-[10px] px-1.5 py-0.5 rounded bg-surface-300 font-mono font-bold text-electric-blue">
            {savedSlugs.length}
          </span>
        </Link>
        <div className="flex items-center border border-surface-300 rounded-full p-0.5 bg-surface-200">
          <UserButton
            afterSignOutUrl="/"
            appearance={{
              elements: {
                avatarBox: "w-7 h-7 rounded-full",
              },
            }}
          />
        </div>
      </SignedIn>
      <SignedOut>
        <Link
          href="/sign-in"
          className="flex items-center gap-1.5 text-xs font-semibold px-3.5 py-1.5 rounded-lg bg-electric-blue hover:bg-electric-blue-600 text-white shadow-glow transition-all"
        >
          <User className="w-3.5 h-3.5" />
          <span>Sign In</span>
        </Link>
      </SignedOut>
    </div>
  );
}
