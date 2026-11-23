"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { Search, Database, Sparkles, Menu, X, ArrowUpRight, User, LogOut, Bookmark } from "lucide-react";
import { GlobalSearchModal } from "./GlobalSearchModal";
import { useAuth } from "@/context/AuthContext";
import { getCompanyInitials } from "@/lib/utils";
import { ClerkUserNav } from "@/components/auth/ClerkUserNav";

interface NavbarProps {
  onToggleSidebar?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onToggleSidebar }) => {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const { user, logout, openAuthModal, savedSlugs, isClerkActive } = useAuth();
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setIsUserMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <>
      <header className="sticky top-0 z-40 w-full h-16 border-b border-surface-300/80 bg-background/80 backdrop-blur-xl px-4 sm:px-6 flex items-center justify-between shadow-lg">
        <div className="flex items-center gap-3 shrink-0">
          {/* Mobile hamburger */}
          <button
            onClick={onToggleSidebar}
            className="md:hidden p-2 text-gray-400 hover:text-white rounded-lg hover:bg-surface-200 transition-colors"
            aria-label="Toggle Navigation"
          >
            <Menu className="w-5 h-5" />
          </button>

          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-electric-blue via-indigo-500 to-violet flex items-center justify-center shadow-glow group-hover:scale-105 transition-all">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-base tracking-tight text-white flex items-center gap-1">
                OneAtlas<span className="text-electric-blue">.dev</span>
              </span>
              <span className="text-[10px] text-gray-400 font-mono -mt-1 hidden sm:inline">
                AI MODEL INTELLIGENCE
              </span>
            </div>
          </Link>
        </div>

        {/* Global Search trigger */}
        <div className="flex-1 max-w-xs md:max-w-sm lg:max-w-md mx-2 sm:mx-4 hidden md:block min-w-0">
          <button
            onClick={() => setIsSearchOpen(true)}
            className="w-full flex items-center justify-between px-3.5 py-1.5 rounded-lg bg-surface-100/90 border border-surface-300/80 hover:border-surface-400 text-gray-400 hover:text-gray-200 text-xs transition-all cursor-pointer shadow-inner hover:bg-surface-200/90"
          >
            <div className="flex items-center gap-2 truncate">
              <Search className="w-3.5 h-3.5 text-electric-blue shrink-0" />
              <span className="truncate">Search models, labs, providers...</span>
            </div>
            <kbd className="px-1.5 py-0.5 bg-surface-300/80 border border-surface-400/80 rounded text-[10px] text-gray-300 font-mono shrink-0">
              Ctrl+K
            </kbd>
          </button>
        </div>

        {/* Right side items */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {/* Mobile search icon */}
          <button
            onClick={() => setIsSearchOpen(true)}
            className="md:hidden p-2 text-gray-400 hover:text-white"
            aria-label="Search"
          >
            <Search className="w-5 h-5" />
          </button>

          {/* Database indicator (Visible on XL screens) */}
          <div className="hidden xl:flex items-center gap-2 px-2.5 py-1 rounded-full bg-surface-200/70 border border-surface-300/80 text-[11px] text-gray-300 font-mono shadow-sm shrink-0">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shadow-glow-emerald" />
            <span>PostgreSQL Ready</span>
          </div>

          <Link
            href="/models"
            className="hidden sm:flex items-center gap-1 text-xs font-medium text-gray-300 hover:text-white px-2.5 py-1.5 rounded-lg hover:bg-surface-200/80 transition-colors shrink-0"
          >
            <span>Explore</span>
          </Link>

          <Link
            href="/compare"
            className="hidden sm:flex items-center gap-1 text-xs font-medium text-gray-300 hover:text-white px-2.5 py-1.5 rounded-lg hover:bg-surface-200/80 transition-colors shrink-0"
          >
            <span>Compare</span>
          </Link>

          {/* User Auth Menu / Sign In Button */}
          {user ? (
            <div className="relative shrink-0" ref={menuRef}>
              <button
                onClick={() => setIsUserMenuOpen((prev) => !prev)}
                className="flex items-center gap-2 p-1 sm:px-2.5 sm:py-1 rounded-lg bg-surface-200/90 hover:bg-surface-300/90 border border-surface-300 text-white transition-all cursor-pointer shadow-sm shrink-0"
              >
                <div className="relative w-6 h-6 rounded-md bg-gradient-to-br from-electric-blue via-indigo-500 to-violet flex items-center justify-center font-bold text-[10px] text-white shrink-0 shadow-glow select-none">
                  <span>{getCompanyInitials(user.name)}</span>
                  <span className="absolute -bottom-0.5 -right-0.5 w-2 h-2 rounded-full bg-emerald-400 ring-1 ring-card" />
                </div>
                <span className="text-xs font-semibold text-white max-w-[120px] truncate shrink-0">
                  {user.name}
                </span>
              </button>

              {isUserMenuOpen && (
                <div className="absolute right-0 mt-2 w-56 rounded-xl bg-card border border-surface-300 shadow-2xl p-2 text-xs space-y-1 animate-in fade-in duration-100 z-50">
                  <div className="p-2 border-b border-surface-300">
                    <div className="font-semibold text-white truncate">{user.name}</div>
                    <div className="text-[11px] text-gray-400 truncate">{user.email}</div>
                  </div>

                  <Link
                    href="/saved"
                    onClick={() => setIsUserMenuOpen(false)}
                    className="w-full flex items-center justify-between p-2 rounded-lg hover:bg-surface-200 text-gray-300 hover:text-white transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      <Bookmark className="w-3.5 h-3.5 text-electric-blue" />
                      <span>Saved Models</span>
                    </div>
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-surface-300 font-mono font-bold text-electric-blue">
                      {savedSlugs.length}
                    </span>
                  </Link>

                  <button
                    onClick={() => {
                      setIsUserMenuOpen(false);
                      logout();
                    }}
                    className="w-full flex items-center gap-2 p-2 rounded-lg hover:bg-red-500/10 text-gray-400 hover:text-red-400 transition-colors text-left"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Sign Out</span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            <button
              onClick={openAuthModal}
              className="flex items-center gap-1.5 text-xs font-semibold px-3.5 py-1.5 rounded-lg bg-gradient-to-r from-electric-blue to-blue-600 hover:from-electric-blue-400 hover:to-electric-blue text-white shadow-glow transition-all cursor-pointer shrink-0"
            >
              <User className="w-3.5 h-3.5" />
              <span>Sign In</span>
            </button>
          )}
        </div>
      </header>

      <GlobalSearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
      />
    </>
  );
};
