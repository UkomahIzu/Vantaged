"use client";

import { useState, useEffect } from "react";
import {
  AUTH_CHANGE_EVENT,
  getOwnerSession,
} from "../../../shared/vantagedAuth";

export interface CurrentUser {
  fullName: string;
  firstName: string;
  email: string;
  role: string;
}

const EMPTY_USER: CurrentUser = {
  fullName: "",
  firstName: "",
  email: "",
  role: "Owner Admin",
};

export function useCurrentUser(): CurrentUser {
  const [user, setUser] = useState<CurrentUser>(EMPTY_USER);

  useEffect(() => {
    const sync = () => {
      const session = getOwnerSession();
      if (session) {
        const trimmedName = session.fullName.trim();
        const first = trimmedName.split(/\s+/)[0] || trimmedName;
        setUser({
          fullName: trimmedName,
          firstName: first,
          email: session.email,
          role: session.role || "Owner Admin",
        });
        return;
      }

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
          email: storedEmail || "",
          role: storedRole,
        });
      } else {
        setUser(EMPTY_USER);
      }
    };

    sync();
    window.addEventListener(AUTH_CHANGE_EVENT, sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener(AUTH_CHANGE_EVENT, sync);
      window.removeEventListener("storage", sync);
    };
  }, []);

  return user;
}
