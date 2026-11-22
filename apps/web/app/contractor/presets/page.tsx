import { Suspense } from "react";
import type { Metadata } from "next";
import { DirectorPresetsPage } from "../../../company/Director dashboard";

export const metadata: Metadata = {
  title: "Stage Presets | Vantaged",
  description:
    "Browse Vantaged Admin stage presets and manage your company's custom milestone inspection templates.",
};

export default function Page() {
  return (
    <main className="h-screen w-screen max-h-screen max-w-screen overflow-hidden">
      <Suspense fallback={null}>
        <DirectorPresetsPage />
      </Suspense>
    </main>
  );
}
