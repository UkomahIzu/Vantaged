"use client";

import { useState, useEffect } from "react";

export interface ContractorUser {
  fullName: string;
  firstName: string;
  email: string;
  role: string;
  companyName: string;
  rcNumber: string;
}

const DEFAULT_DIRECTOR_USER: ContractorUser = {
  fullName: "Engr. Babatunde Adeleke",
  firstName: "Babatunde",
  email: "b.adeleke@apexstructure.ng",
  role: "Director",
  companyName: "Apex Structure & Civil Ltd",
  rcNumber: "RC-1849204",
};

export function useContractorUser(): ContractorUser {
  const [user, setUser] = useState<ContractorUser>(DEFAULT_DIRECTOR_USER);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const storedEmail = localStorage.getItem("vantaged_contractor_user_email");
    const storedRole = localStorage.getItem("vantaged_contractor_user_role");
    const storedName = localStorage.getItem("vantaged_contractor_user_name");
    const storedCompany = localStorage.getItem("vantaged_contractor_company_name");

    setUser((prev) => {
      const fullName = storedName?.trim() || prev.fullName;
      const parts = fullName.replace(/^(Engr\.|Arch\.|QS|Chief)\s+/i, "").trim().split(/\s+/);
      const firstName = parts[0] || prev.firstName;
      return {
        fullName,
        firstName,
        email: storedEmail?.trim() || prev.email,
        role: storedRole?.trim() || prev.role,
        companyName: storedCompany?.trim() || prev.companyName,
        rcNumber: prev.rcNumber,
      };
    });
  }, []);

  return user;
}
