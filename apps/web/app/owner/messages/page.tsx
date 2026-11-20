import React, { Suspense } from "react";
import type { Metadata } from "next";
import { OwnerMessagesPage } from "../../../client/Owner dashboard";

export const metadata: Metadata = {
  title: "Messages & Contractor Communications | Vantaged",
  description: "Direct encrypted chat and site coordination with verified construction firms and appointed client representatives on Vantaged.",
};

export default function Page() {
  return (
    <main className="h-screen w-screen max-h-screen max-w-screen overflow-hidden">
      <Suspense fallback={<div className="h-full w-full bg-[var(--vt-color-background-subtle,#F7F7FA)]" />}>
        <OwnerMessagesPage />
      </Suspense>
    </main>
  );
}

