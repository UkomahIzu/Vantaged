import { Suspense } from "react";
import type { Metadata } from "next";
import { DirectorSettingsPage } from "../../../company/Director dashboard";

export const metadata: Metadata = {
  title: "Company Settings | Vantaged",
  description:
    "Manage company profile, CAC & COREN verification, NUBAN bank account, plan slots, and alerts on Vantaged.",
};

export default function Page() {
  return (
    <main className="h-screen w-screen max-h-screen max-w-screen overflow-hidden">
      <Suspense fallback={null}>
        <DirectorSettingsPage />
      </Suspense>
    </main>
  );
}
