import { Suspense } from "react";
import type { Metadata } from "next";
import { DirectorMessagesPage } from "../../../company/Director dashboard";

export const metadata: Metadata = {
  title: "Client Messages | Vantaged",
  description:
    "Direct project messaging synced live between your construction company and Property Owners on Vantaged.",
};

export default function Page() {
  return (
    <main className="h-screen w-screen max-h-screen max-w-screen overflow-hidden">
      <Suspense fallback={null}>
        <DirectorMessagesPage />
      </Suspense>
    </main>
  );
}
