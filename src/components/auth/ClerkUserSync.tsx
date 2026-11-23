"use client";

import { useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import { useAuth } from "@/context/AuthContext";

function ClerkUserSyncInner() {
  const { isLoaded, isSignedIn, user: clerkUser } = useUser();
  const { setExternalUser, user: currentUser } = useAuth();

  useEffect(() => {
    if (isLoaded) {
      if (isSignedIn && clerkUser) {
        setExternalUser({
          id: clerkUser.id,
          name:
            clerkUser.fullName ||
            clerkUser.firstName ||
            clerkUser.primaryEmailAddress?.emailAddress ||
            "Clerk User",
          email: clerkUser.primaryEmailAddress?.emailAddress || "",
        });
      } else if (!isSignedIn && currentUser?.id?.startsWith("user_")) {
        // Only clear session if the active session was specifically a Clerk session
        setExternalUser(null);
      }
    }
  }, [isLoaded, isSignedIn, clerkUser, setExternalUser, currentUser]);

  return null;
}

export function ClerkUserSync() {
  const { isClerkActive } = useAuth();

  if (!isClerkActive) return null;

  return <ClerkUserSyncInner />;
}
