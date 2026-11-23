import React from "react";
import { OwnerFloatingDeskWidget } from "../../client/Owner dashboard";
import { OwnerAuthGuard } from "../../client/Owner dashboard/components/OwnerAuthGuard";

export default function OwnerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <OwnerAuthGuard>
      <div
        style={{ fontFamily: "'Outfit', var(--vt-font-sans), sans-serif" }}
        className="font-sans antialiased min-h-screen"
      >
        {children}
        <OwnerFloatingDeskWidget />
      </div>
    </OwnerAuthGuard>
  );
}
