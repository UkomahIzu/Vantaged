"use client";

import { useState, useEffect } from "react";

export interface CurrentUser {
  fullName: string;
  firstName: string;
  email: string;
  role: string;
}

const DEFAULT_USER: CurrentUser = {
  fullName: "James Robinson",
  firstName: "James",
  email: "james@vantaged.io",
  role: "Owner Admin",
};

export function useCurrentUser(): CurrentUser {
  const [user, setUser] = useState<CurrentUser>(DEFAULT_USER);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedName =
        localStorage.getItem("vantaged_user_name") ||
        localStorage.getItem("vantaged_fullName");
      const storedEmail =
        localStorage.getItem("vantaged_user_email") ||
        localStorage.getItem("vantaged_email");
      const storedRole =
        localStorage.getItem("vantaged_user_role") || "Owner Admin";

      if (storedName && storedName.trim()) {
        const trimmedName = storedName.trim();
        const first = trimmedName.split(/\s+/)[0] || trimmedName;
        setUser({
          fullName: trimmedName,
          firstName: first,
          email: storedEmail || "owner@vantaged.io",
          role: storedRole,
        });
      }
    }
  }, []);

  return user;
}
