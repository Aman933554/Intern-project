"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Box,
  Layers,
  Trophy,
  Building2,
  Server,
  Info,
  Bookmark,
  Database,
  ExternalLink,
  X,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";

interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const pathname = usePathname();
  const { user, savedSlugs, logout } = useAuth();

  const navItems = [
    { label: "Overview", href: "/", icon: LayoutDashboard },
    { label: "Explore Models", href: "/models", icon: Box },
    { label: "Compare Models", href: "/compare", icon: Layers },
    { label: "Rankings", href: "/rankings", icon: Trophy },
    { label: "AI Labs", href: "/companies", icon: Building2 },
    { label: "Providers", href: "/providers", icon: Server },
    { label: "Saved Models", href: "/saved", icon: Bookmark, badge: savedSlugs.length > 0 ? savedSlugs.length : undefined },
    { label: "About OneAtlas", href: "/about", icon: Info },
  ];

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm md:hidden"
        />
      )}

      <aside
        className={`fixed top-0 bottom-0 left-0 z-40 w-64 bg-card/95 backdrop-blur-xl border-r border-surface-300/80 flex flex-col justify-between transition-transform duration-200 ease-in-out md:translate-x-0 shadow-2xl ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div>
          {/* Mobile close button header */}
          <div className="flex md:hidden items-center justify-between p-4 border-b border-surface-300/80">
            <span className="font-bold text-sm text-white">Navigation</span>
            <button
              onClick={onClose}
              className="p-1 text-gray-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Desktop spacer */}
          <div className="hidden md:block h-16 border-b border-surface-300/80 px-6 flex items-center">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-gray-400">
              <span className="w-1.5 h-1.5 rounded-full bg-electric-blue animate-pulse" />
              <span>Platform Navigator</span>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="p-3 space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive =
                item.href === "/"
                  ? pathname === "/"
                  : pathname.startsWith(item.href);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={onClose}
                  className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                    isActive
                      ? "bg-gradient-to-r from-electric-blue/20 via-violet/10 to-transparent text-white border border-electric-blue/40 shadow-glow"
                      : "text-gray-400 hover:text-gray-100 hover:bg-surface-200/80"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon
                      className={`w-4 h-4 ${
                        isActive ? "text-electric-blue drop-shadow-[0_0_8px_rgba(14,165,233,0.6)]" : "text-gray-400"
                      }`}
                    />
                    <span className={isActive ? "font-semibold" : ""}>{item.label}</span>
                  </div>

                  {item.badge !== undefined && (
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-electric-blue/20 text-electric-blue font-mono font-bold border border-electric-blue/30 shadow-sm">
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* User Card & Database System Status */}
        <div className="space-y-2 m-3">
          {user ? (
            <div className="p-2.5 rounded-xl bg-surface-100/90 border border-surface-300/80 text-xs flex items-center justify-between shadow-sm">
              <div className="flex items-center gap-2 overflow-hidden">
                <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-electric-blue via-indigo-500 to-violet flex items-center justify-center font-bold text-xs text-white shrink-0 shadow-glow select-none">
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <div className="min-w-0">
                  <div className="font-semibold text-white truncate text-xs">{user.name}</div>
                  <div className="text-[10px] text-gray-400 truncate">{user.email}</div>
                </div>
              </div>
              <button
                onClick={logout}
                className="text-[10px] text-gray-400 hover:text-red-400 px-2 py-1 rounded hover:bg-red-500/10 transition-colors cursor-pointer"
                title="Sign Out"
              >
                Exit
              </button>
            </div>
          ) : null}

          <div className="p-3 rounded-xl bg-surface-50/80 border border-surface-300/80 text-xs shadow-inner">
            <div className="flex items-center gap-2 mb-2 text-gray-200 font-semibold">
              <Database className="w-3.5 h-3.5 text-electric-blue" />
              <span>Neon Engine</span>
            </div>
            <p className="text-[11px] text-gray-400 mb-2 leading-relaxed">
              Connected via Prisma ORM with live relational indexing.
            </p>
            <div className="flex items-center justify-between text-[10px] text-gray-500 pt-2 border-t border-surface-300/60 font-mono">
              <span>MODELS: 37</span>
              <span className="text-emerald-400 font-semibold flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                ONLINE
              </span>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};
