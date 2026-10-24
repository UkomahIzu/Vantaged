import React, { Suspense } from "react";
import type { Metadata } from "next";
import { OwnerTransactionsPage } from "../../../client/Owner dashboard";

export const metadata: Metadata = {
  title: "Transactions & Portfolio Financials | Vantaged",
  description:
    "Track all project milestone disbursements, escrow vault deposits, contractor 3-day receipt confirmations, and 90-day cash flow forecasts on Vantaged.",
};

export default function Page() {
  return (
    <main className="h-screen w-screen max-h-screen max-w-screen overflow-hidden">
      <Suspense fallback={<div className="h-full w-full bg-[var(--vt-color-background-subtle,#F7F7FA)]" />}>
        <OwnerTransactionsPage />
      </Suspense>
    </main>
  );
}
