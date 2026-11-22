import { Suspense } from "react";
import type { Metadata } from "next";
import { DirectorNotificationsPage } from "../../../company/Director dashboard";

export const metadata: Metadata = {
  title: "Notifications | Vantaged",
  description:
    "View company site alerts, receipt confirmation notices, and incoming client project requests on Vantaged.",
};

export default function Page() {
  return (
    <main className="h-screen w-screen max-h-screen max-w-screen overflow-hidden">
      <Suspense fallback={null}>
        <DirectorNotificationsPage />
      </Suspense>
    </main>
  );
}
