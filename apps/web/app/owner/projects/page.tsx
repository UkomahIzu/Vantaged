import { Suspense } from "react";
import type { Metadata } from "next";
import { OwnerProjectsPage } from "../../../client/Owner dashboard";

export const metadata: Metadata = {
  title: "Projects Portfolio | Vantaged",
  description:
    "Explore your verified construction project folders, milestone escrows, and site inspection telemetries on Vantaged.",
};

export default function Page() {
  return (
    <main className="h-screen w-screen max-h-screen max-w-screen overflow-hidden">
      <Suspense fallback={null}>
        <OwnerProjectsPage />
      </Suspense>
    </main>
  );
}
