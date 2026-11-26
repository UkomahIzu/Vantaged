"use client";

import React, { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import {
  AUTH_CHANGE_EVENT,
  checkContractorAccountStatus,
  getContractorSession,
  signOutContractor,
} from "../../../shared/vantagedAuth";
import { hydrateContractorPortalFromBackend } from "../../../shared/vantagedSyncBridge";

export function ContractorAuthGuard({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const isLoginRoute = pathname === "/contractor/login";

  const [status, setStatus] = useState<"checking" | "authenticated" | "redirecting">(
    isLoginRoute ? "authenticated" : "checking"
  );

  useEffect(() => {
    if (isLoginRoute) {
      setStatus("authenticated");
      return;
    }

    const verify = async () => {
      const session = getContractorSession();
      if (!session) {
        setStatus("redirecting");
        router.replace("/contractor/login");
        return;
      }

      const accountStatus = await checkContractorAccountStatus();
      if (accountStatus === "SUSPENDED") {
        signOutContractor();
        setStatus("redirecting");
        router.replace("/contractor/login?suspended=1");
        return;
      }

      setStatus("authenticated");
      await hydrateContractorPortalFromBackend();
    };

    verify();
    const interval = setInterval(verify, 5000);
    window.addEventListener(AUTH_CHANGE_EVENT, verify);
    window.addEventListener("storage", verify);
    window.addEventListener("focus", verify);
    return () => {
      clearInterval(interval);
      window.removeEventListener(AUTH_CHANGE_EVENT, verify);
      window.removeEventListener("storage", verify);
      window.removeEventListener("focus", verify);
    };
  }, [isLoginRoute, router]);

  if (!isLoginRoute && status !== "authenticated") {
    return (
      <div className="h-screen w-screen flex flex-col items-center justify-center bg-[var(--vt-color-background-subtle,#F7F7FA)] text-[var(--vt-color-indigo-900,#261A66)] font-sans gap-3">
        <div className="w-8 h-8 rounded-full border-3 border-[var(--vt-color-orange-500,#EF5F18)] border-t-transparent animate-spin" />
        <p className="text-xs font-bold text-[var(--vt-color-neutral-500,#7C7894)]">
          {status === "redirecting"
            ? "Redirecting to Company Sign In..."
            : "Verifying company session..."}
        </p>
      </div>
    );
  }

  return <>{children}</>;
}
