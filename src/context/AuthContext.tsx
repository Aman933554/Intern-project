"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { UserSession } from "@/lib/auth-service";

interface AuthContextType {
  user: UserSession | null;
  savedSlugs: string[];
  isAuthModalOpen: boolean;
  openAuthModal: () => void;
  closeAuthModal: () => void;
  login: (email: string, password?: string) => Promise<boolean>;
  register: (name: string, email: string, password?: string) => Promise<boolean>;
  loginDemo: () => Promise<void>;
  logout: () => void;
  toggleSave: (slug: string) => Promise<boolean>;
  isModelSaved: (slug: string) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserSession | null>(null);
  const [savedSlugs, setSavedSlugs] = useState<string[]>([]);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  // Restore session from localStorage on mount
  useEffect(() => {
    try {
      const storedUser = localStorage.getItem("oneatlas_user");
      if (storedUser) {
        const parsed = JSON.parse(storedUser);
        setUser(parsed);
        fetchSavedSlugs(parsed.id);
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

  const login = async (email: string, password?: string): Promise<boolean> => {
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const json = await res.json();
      if (!res.ok || !json.success) {
        alert(json.error || "Login failed");
        return false;
      }
      setUser(json.data);
      localStorage.setItem("oneatlas_user", JSON.stringify(json.data));
      await fetchSavedSlugs(json.data.id);
      setIsAuthModalOpen(false);
      return true;
    } catch (err: any) {
      alert(err.message || "Login error");
      return false;
    }
  };

  const register = async (name: string, email: string, password?: string): Promise<boolean> => {
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });
      const json = await res.json();
      if (!res.ok || !json.success) {
        alert(json.error || "Registration failed");
        return false;
      }
      setUser(json.data);
      localStorage.setItem("oneatlas_user", JSON.stringify(json.data));
      await fetchSavedSlugs(json.data.id);
      setIsAuthModalOpen(false);
      return true;
    } catch (err: any) {
      alert(err.message || "Registration error");
      return false;
    }
  };

  const loginDemo = async () => {
    await login("demo@oneatlas.dev", "password123");
  };

  const logout = () => {
    setUser(null);
    setSavedSlugs([]);
    try {
      localStorage.removeItem("oneatlas_user");
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
