import { Suspense } from "react";
import type { Metadata } from "next";
import { DirectorProjectsPage } from "../../../company/Director dashboard";

export const metadata: Metadata = {
  title: "Company Projects | Vantaged",
  description:
    "Manage active construction sites, milestone stage plans, verified progress, and completed contracts on Vantaged.",
};

export default function Page() {
  return (
    <main className="h-screen w-screen max-h-screen max-w-screen overflow-hidden">
      <Suspense fallback={null}>
        <DirectorProjectsPage />
      </Suspense>
    </main>
  );
}
