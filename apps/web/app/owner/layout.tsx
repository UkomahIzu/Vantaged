import React from "react";
import { OwnerFloatingDeskWidget } from "../../client/Owner dashboard";

export default function OwnerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div
      style={{ fontFamily: "'Outfit', var(--vt-font-sans), sans-serif" }}
      className="font-sans antialiased min-h-screen"
    >
      {children}
      <OwnerFloatingDeskWidget />
    </div>
  );
}
