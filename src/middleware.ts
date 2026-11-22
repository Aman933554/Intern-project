import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const publishableKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;
const isClerkConfigured = Boolean(publishableKey && !publishableKey.includes("YOUR_") && publishableKey.startsWith("pk_"));

// Public routes accessible without signing in
const isPublicRoute = createRouteMatcher([
  "/",
  "/models(.*)",
  "/compare(.*)",
  "/rankings(.*)",
  "/companies(.*)",
  "/providers(.*)",
  "/saved(.*)",
  "/search(.*)",
  "/about(.*)",
  "/api(.*)",
  "/sign-in(.*)",
  "/sign-up(.*)",
]);

const clerkHandler = clerkMiddleware((auth, request) => {
  if (!isPublicRoute(request)) {
    auth().protect();
  }
});

export default function middleware(request: NextRequest, event: any) {
  if (!isClerkConfigured) {
    return NextResponse.next();
  }
  return clerkHandler(request, event);
}

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};
