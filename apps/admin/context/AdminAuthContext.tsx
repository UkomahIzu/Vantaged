"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { AdminRole, AdminUser } from "../types/admin";

export const PRESET_ADMINS: Record<AdminRole, AdminUser> = {
  SUPER_ADMIN: {
    id: "adm_01_super",
    name: "Engr. Kenneth Adeleke",
    email: "admin@vantaged.com",
    role: "SUPER_ADMIN",
    roleTitle: "Platform Super Admin · Head of Operations",
    securityLevel: "Level 3 · Full Platform Authority",
    department: "Executive Operations",
    lastLogin: "Today at 08:30 WAT",
    avatar: "KA",
  },
  COMPLIANCE_OFFICER: {
    id: "adm_02_compliance",
    name: "Barrister Amina Bello",
    email: "compliance@vantaged.com",
    role: "COMPLIANCE_OFFICER",
    roleTitle: "Senior CAC & Regulatory Compliance Lead",
    securityLevel: "Level 2 · Verification & Licenses",
    department: "Legal & Regulatory Compliance",
    lastLogin: "Today at 09:12 WAT",
    avatar: "AB",
  },
  DISPUTES_ARBITRATOR: {
    id: "adm_03_disputes",
    name: "Femi Oladipo, FCIArb",
    email: "disputes@vantaged.com",
    role: "DISPUTES_ARBITRATOR",
    roleTitle: "Commercial Arbitration & Escrow Lead",
    securityLevel: "Level 2 · Dispute & Risk Resolution",
    department: "Arbitration & Risk",
    lastLogin: "Yesterday at 17:45 WAT",
    avatar: "FO",
  },
  SUPPORT_SPECIALIST: {
    id: "adm_04_support",
    name: "Chioma Okonkwo",
    email: "support@vantaged.com",
    role: "SUPPORT_SPECIALIST",
    roleTitle: "Contractor Onboarding Specialist",
    securityLevel: "Level 1 · Read & Support Ops",
    department: "Partner Operations",
    lastLogin: "Today at 07:50 WAT",
    avatar: "CO",
  },
};

interface AdminAuthContextType {
  user: AdminUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password?: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  switchRole: (role: AdminRole) => void;
  quickLoginAs: (role: AdminRole) => void;
}

const AdminAuthContext = createContext<AdminAuthContextType | undefined>(undefined);

const STORAGE_KEY = "vantaged_admin_session";

export function AdminAuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AdminUser | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored) as AdminUser;
        setUser(parsed);
      } else {
        // Pre-fill default Super Admin in dev so navigation is instant
        setUser(PRESET_ADMINS.SUPER_ADMIN);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(PRESET_ADMINS.SUPER_ADMIN));
      }
    } catch {
      setUser(PRESET_ADMINS.SUPER_ADMIN);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const login = async (email: string, _password?: string) => {
    setIsLoading(true);
    await new Promise((res) => setTimeout(res, 400));

    // Match by email or fallback to super admin
    const foundRole = (Object.keys(PRESET_ADMINS) as AdminRole[]).find(
      (role) => PRESET_ADMINS[role].email.toLowerCase() === email.trim().toLowerCase()
    );

    const loggedInUser = foundRole ? PRESET_ADMINS[foundRole] : PRESET_ADMINS.SUPER_ADMIN;
    setUser(loggedInUser);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(loggedInUser));
    setIsLoading(false);
    return { success: true };
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem(STORAGE_KEY);
  };

  const switchRole = (role: AdminRole) => {
    const selected = PRESET_ADMINS[role];
    setUser(selected);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(selected));
  };

  const quickLoginAs = (role: AdminRole) => {
    const selected = PRESET_ADMINS[role];
    setUser(selected);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(selected));
  };

  return (
    <AdminAuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        logout,
        switchRole,
        quickLoginAs,
      }}
    >
      {children}
    </AdminAuthContext.Provider>
  );
}

export function useAdminAuth() {
  const context = useContext(AdminAuthContext);
  if (!context) {
    throw new Error("useAdminAuth must be used within an AdminAuthProvider");
  }
  return context;
}

