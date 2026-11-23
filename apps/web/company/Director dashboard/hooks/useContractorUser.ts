"use client";

import { useState, useEffect } from "react";
import {
  AUTH_CHANGE_EVENT,
  getContractorSession,
} from "../../../shared/vantagedAuth";

export interface ContractorUser {
  fullName: string;
  firstName: string;
  email: string;
  role: string;
  companyName: string;
  rcNumber: string;
}

const EMPTY_CONTRACTOR_USER: ContractorUser = {
  fullName: "",
  firstName: "",
  email: "",
  role: "Director",
  companyName: "",
  rcNumber: "",
};

export function useContractorUser(): ContractorUser {
  const [user, setUser] = useState<ContractorUser>(EMPTY_CONTRACTOR_USER);

  useEffect(() => {
    const sync = () => {
      const session = getContractorSession();
      if (session) {
        const fullName = session.fullName.trim();
        const parts = fullName
          .replace(/^(Engr\.|Arch\.|QS|Chief|Dr\.)\s+/i, "")
          .trim()
          .split(/\s+/);
        setUser({
          fullName,
          firstName: parts[0] || fullName,
          email: session.email,
          role: session.role || "Director",
          companyName: session.companyName,
          rcNumber: session.rcNumber || "",
        });
        return;
      }

      const storedEmail = localStorage.getItem("vantaged_contractor_user_email");
      const storedRole = localStorage.getItem("vantaged_contractor_user_role");
      const storedName = localStorage.getItem("vantaged_contractor_user_name");
      const storedCompany = localStorage.getItem("vantaged_contractor_company_name");
      const storedRc = localStorage.getItem("vantaged_contractor_rc_number");

      if (storedName || storedEmail) {
        const fullName = storedName?.trim() || "";
        const parts = fullName
          .replace(/^(Engr\.|Arch\.|QS|Chief|Dr\.)\s+/i, "")
          .trim()
          .split(/\s+/);
        setUser({
          fullName,
          firstName: parts[0] || fullName,
          email: storedEmail?.trim() || "",
          role: storedRole?.trim() || "Director",
          companyName: storedCompany?.trim() || "",
          rcNumber: storedRc?.trim() || "",
        });
      } else {
        setUser(EMPTY_CONTRACTOR_USER);
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
