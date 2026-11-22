"use client";

import React, { useState } from "react";
import { ComparisonProvider } from "@/context/ComparisonContext";
import { Navbar } from "@/components/layout/Navbar";
import { Sidebar } from "@/components/layout/Sidebar";
import { Footer } from "@/components/layout/Footer";
import { CompareFloatingBar } from "@/components/common/CompareFloatingBar";

export const AppShell: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <ComparisonProvider>
      <div className="min-h-screen bg-background text-gray-100 flex flex-col selection:bg-electric-blue/30 selection:text-white">
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
      </div>
    </ComparisonProvider>
  );
};
