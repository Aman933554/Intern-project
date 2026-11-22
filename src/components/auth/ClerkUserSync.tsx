"use client";

import { useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import { useAuth } from "@/context/AuthContext";

function ClerkUserSyncInner() {
  const { isLoaded, isSignedIn, user } = useUser();
  const { setExternalUser } = useAuth();

  useEffect(() => {
    if (isLoaded) {
      if (isSignedIn && user) {
        setExternalUser({
          id: user.id,
          name:
            user.fullName ||
            user.firstName ||
            user.primaryEmailAddress?.emailAddress ||
            "Clerk User",
          email: user.primaryEmailAddress?.emailAddress || "",
        });
      } else {
        setExternalUser(null);
      }
    }
  }, [isLoaded, isSignedIn, user, setExternalUser]);

  return null;
}

export function ClerkUserSync() {
  const { isClerkActive } = useAuth();

  if (!isClerkActive) return null;

  return <ClerkUserSyncInner />;
}
