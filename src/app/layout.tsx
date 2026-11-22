import type { Metadata } from "next";
import "./globals.css";
import { AppShell } from "@/components/layout/AppShell";
import { ClerkProvider } from "@clerk/nextjs";
import { dark } from "@clerk/themes";

export const metadata: Metadata = {
  title: "OneAtlas.dev – AI Model Discovery & Intelligence Platform",
  description:
    "Discover, search, explore, compare, and evaluate AI foundation models from top companies and providers with deep benchmark intelligence and pricing analytics.",
};

const clerkKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;
const isClerkEnabled = Boolean(
  clerkKey &&
  clerkKey.startsWith("pk_") &&
  !clerkKey.includes("YOUR_")
);

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  if (isClerkEnabled && clerkKey) {
    return (
      <ClerkProvider
        publishableKey={clerkKey}
        appearance={{
          baseTheme: dark,
          variables: {
            colorPrimary: "#3B82F6",
            colorBackground: "#0D111C",
            colorInputBackground: "#111827",
            colorInputText: "#FFFFFF",
          },
        }}
      >
        <html lang="en" className="dark">
          <body className="font-sans bg-background text-gray-100 antialiased min-h-screen">
            <AppShell>{children}</AppShell>
          </body>
        </html>
      </ClerkProvider>
    );
  }

  return (
    <html lang="en" className="dark">
      <body className="font-sans bg-background text-gray-100 antialiased min-h-screen">
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
