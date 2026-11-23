"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { UserSession } from "@/lib/auth-service";

export interface AuthResponse {
  success: boolean;
  error?: string;
  data?: UserSession;
}

interface AuthContextType {
  user: UserSession | null;
  savedSlugs: string[];
  isAuthModalOpen: boolean;
  openAuthModal: () => void;
  closeAuthModal: () => void;
  login: (email: string, password?: string) => Promise<AuthResponse>;
  register: (name: string, email: string, password?: string) => Promise<AuthResponse>;
  loginDemo: () => Promise<void>;
  logout: () => void;
  toggleSave: (slug: string) => Promise<boolean>;
  isModelSaved: (slug: string) => boolean;
  setExternalUser: (user: UserSession | null) => void;
  isClerkActive: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserSession | null>(null);
  const [savedSlugs, setSavedSlugs] = useState<string[]>([]);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  // Restore session from localStorage or cookie on mount
  useEffect(() => {
    try {
      const storedUser = localStorage.getItem("oneatlas_user");
      if (storedUser) {
        const parsed = JSON.parse(storedUser);
        if (parsed?.id) {
          setUser(parsed);
          fetchSavedSlugs(parsed.id);
          return;
        }
      }

      // Fallback check cookie
      if (typeof document !== "undefined") {
        const match = document.cookie.match(/oneatlas_session=([^;]+)/);
        if (match) {
          const parsed = JSON.parse(decodeURIComponent(match[1]));
          if (parsed?.id) {
            setUser(parsed);
            localStorage.setItem("oneatlas_user", JSON.stringify(parsed));
            fetchSavedSlugs(parsed.id);
          }
        }
      }
    } catch {}
  }, []);

  const fetchSavedSlugs = async (userId: string) => {
    try {
      const res = await fetch(`/api/user/saved?userId=${userId}`);
      const json = await res.json();
      if (json.success && json.slugs) {
        setSavedSlugs(json.slugs);
      }
    } catch {}
  };

  const login = async (email: string, password?: string): Promise<AuthResponse> => {
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const json = await res.json();
      if (!res.ok || !json.success) {
        return { success: false, error: json.error || "Login failed. Check your email & password." };
      }
      setUser(json.data);
      localStorage.setItem("oneatlas_user", JSON.stringify(json.data));
      await fetchSavedSlugs(json.data.id);
      setIsAuthModalOpen(false);
      return { success: true, data: json.data };
    } catch (err: any) {
      return { success: false, error: err.message || "Network error. Please try again." };
    }
  };

  const register = async (name: string, email: string, password?: string): Promise<AuthResponse> => {
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });
      const json = await res.json();
      if (!res.ok || !json.success) {
        return { success: false, error: json.error || "Failed to create account." };
      }
      setUser(json.data);
      localStorage.setItem("oneatlas_user", JSON.stringify(json.data));
      await fetchSavedSlugs(json.data.id);
      setIsAuthModalOpen(false);
      return { success: true, data: json.data };
    } catch (err: any) {
      return { success: false, error: err.message || "Network error during registration." };
    }
  };

  const loginDemo = async () => {
    await login("demo@oneatlas.dev", "password123");
  };

  const isClerkActive = Boolean(
    typeof process !== "undefined" &&
    process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY &&
    process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY.startsWith("pk_") &&
    !process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY.includes("YOUR_")
  );

  const setExternalUser = (externalUser: UserSession | null) => {
    if (externalUser) {
      setUser(externalUser);
      fetchSavedSlugs(externalUser.id);
    } else {
      setUser(null);
      setSavedSlugs([]);
    }
  };

  const logout = () => {
    setUser(null);
    setSavedSlugs([]);
    try {
      localStorage.removeItem("oneatlas_user");
      if (typeof document !== "undefined") {
        document.cookie = "oneatlas_session=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
      }
    } catch {}
  };

  const toggleSave = async (slug: string): Promise<boolean> => {
    if (!user) {
      setIsAuthModalOpen(true);
      return false;
    }

    try {
      const res = await fetch("/api/user/saved", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: user.id, modelSlug: slug }),
      });
      const json = await res.json();
      if (json.success) {
        if (json.isSaved) {
          setSavedSlugs((prev) => [...prev, slug]);
        } else {
          setSavedSlugs((prev) => prev.filter((s) => s !== slug));
        }
        return json.isSaved;
      }
      return false;
    } catch {
      return false;
    }
  };

  const isModelSaved = (slug: string) => savedSlugs.includes(slug);

  return (
    <AuthContext.Provider
      value={{
        user,
        savedSlugs,
        isAuthModalOpen,
        openAuthModal: () => setIsAuthModalOpen(true),
        closeAuthModal: () => setIsAuthModalOpen(false),
        login,
        register,
        loginDemo,
        logout,
        toggleSave,
        isModelSaved,
        setExternalUser,
        isClerkActive,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
