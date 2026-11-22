import { Suspense } from "react";
import type { Metadata } from "next";
import { DirectorTransactionsPage } from "../../../company/Director dashboard";

export const metadata: Metadata = {
  title: "Transactions & Escrow | Vantaged",
  description:
    "View milestone tranches received, confirm 3-day NIBSS receipts, and analyze company escrow cashflow on Vantaged.",
};

export default function Page() {
  return (
    <main className="h-screen w-screen max-h-screen max-w-screen overflow-hidden">
      <Suspense fallback={null}>
        <DirectorTransactionsPage />
      </Suspense>
    </main>
  );
}
