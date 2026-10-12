import React from "react";
import { OwnerFloatingDeskWidget } from "../../client/Owner dashboard";

export default function OwnerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      {children}
      <OwnerFloatingDeskWidget />
    </>
  );
}
