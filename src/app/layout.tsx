import type { Metadata } from "next";
import "./globals.css";
import { AppShell } from "@/components/layout/AppShell";

export const metadata: Metadata = {
  title: "OneAtlas.dev – AI Model Discovery & Intelligence Platform",
  description:
    "Discover, search, explore, compare, and evaluate AI foundation models from top companies and providers with deep benchmark intelligence and pricing analytics.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className="font-sans bg-background text-gray-100 antialiased min-h-screen">
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
