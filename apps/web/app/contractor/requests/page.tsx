import { Suspense } from "react";
import type { Metadata } from "next";
import { DirectorRequestsPage } from "../../../company/Director dashboard";

export const metadata: Metadata = {
  title: "Project Requests | Vantaged",
  description:
    "Review incoming owner project briefs, scope descriptions, budgets, and send milestone proposals on Vantaged.",
};

export default function Page() {
  return (
    <main className="h-screen w-screen max-h-screen max-w-screen overflow-hidden">
      <Suspense fallback={null}>
        <DirectorRequestsPage />
      </Suspense>
    </main>
  );
}
