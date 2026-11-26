"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  AUTH_CHANGE_EVENT,
  getOwnerSession,
} from "../../../shared/vantagedAuth";
import { hydrateOwnerPortalFromBackend } from "../../../shared/vantagedSyncBridge";

export function OwnerAuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [status, setStatus] = useState<"checking" | "authenticated" | "redirecting">(
    "checking"
  );

  useEffect(() => {
    const verify = async () => {
      const session = getOwnerSession();
      if (!session) {
        setStatus("redirecting");
        router.replace("/login");
      } else {
        setStatus("authenticated");
        await hydrateOwnerPortalFromBackend();
      }
    };

    verify();
    const interval = setInterval(() => {
      if (getOwnerSession()) hydrateOwnerPortalFromBackend();
    }, 5000);
    const onFocus = () => {
      if (getOwnerSession()) hydrateOwnerPortalFromBackend();
    };
    window.addEventListener(AUTH_CHANGE_EVENT, verify);
    window.addEventListener("storage", verify);
    window.addEventListener("focus", onFocus);
    return () => {
      clearInterval(interval);
      window.removeEventListener(AUTH_CHANGE_EVENT, verify);
      window.removeEventListener("storage", verify);
      window.removeEventListener("focus", onFocus);
    };
  }, [router]);

  if (status !== "authenticated") {
    return (
      <div className="h-screen w-screen flex flex-col items-center justify-center bg-[var(--vt-color-background-subtle,#F7F7FA)] text-[var(--vt-color-indigo-900,#261A66)] font-sans gap-3">
        <div className="w-8 h-8 rounded-full border-3 border-[var(--vt-color-orange-500,#EF5F18)] border-t-transparent animate-spin" />
        <p className="text-xs font-bold text-[var(--vt-color-neutral-500,#7C7894)]">
          {status === "redirecting"
            ? "Redirecting to Owner Sign In..."
            : "Verifying session..."}
        </p>
      </div>
    );
  }

  return <>{children}</>;
}
