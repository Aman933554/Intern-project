"use client";

import React, { useState } from "react";
import { AuthProvider } from "@/context/AuthContext";
import { ComparisonProvider } from "@/context/ComparisonContext";
import { Navbar } from "@/components/layout/Navbar";
import { Sidebar } from "@/components/layout/Sidebar";
import { Footer } from "@/components/layout/Footer";
import { CompareFloatingBar } from "@/components/common/CompareFloatingBar";
import { AuthModal } from "@/components/auth/AuthModal";
import { ClerkUserSync } from "@/components/auth/ClerkUserSync";

export const AppShell: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <AuthProvider>
      <ClerkUserSync />
      <ComparisonProvider>
        <div className="relative min-h-screen bg-background text-gray-100 flex flex-col selection:bg-electric-blue/30 selection:text-white overflow-x-hidden">
          {/* Top luminous accent gradient border */}
          <div className="fixed top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-electric-blue via-violet to-transparent z-50 pointer-events-none opacity-80" />

          {/* Ambient background light orbs */}
          <div className="fixed -top-24 left-1/4 w-[600px] h-[350px] bg-electric-blue/8 rounded-full blur-[140px] pointer-events-none -z-10" />
          <div className="fixed top-1/2 right-0 w-[500px] h-[400px] bg-violet/8 rounded-full blur-[160px] pointer-events-none -z-10" />

          <Navbar onToggleSidebar={() => setIsSidebarOpen((prev) => !prev)} />

          <div className="flex-1 flex">
            <Sidebar
              isOpen={isSidebarOpen}
              onClose={() => setIsSidebarOpen(false)}
            />

            <main className="flex-1 flex flex-col min-w-0 md:pl-64">
              <div className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
                {children}
              </div>
              <Footer />
            </main>
          </div>

          <CompareFloatingBar />
          <AuthModal />
        </div>
      </ComparisonProvider>
    </AuthProvider>
  );
};
