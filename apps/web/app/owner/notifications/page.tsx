import type { Metadata } from "next";
import { OwnerNotificationsPage } from "../../../client/Owner dashboard";

export const metadata: Metadata = {
  title: "Notifications & Alerts | Vantaged",
  description:
    "Real-time milestone inspection proofs, escrow vault transactions, and automated site telemetry alerts on Vantaged.",
};

export default function Page() {
  return (
    <main className="h-screen w-screen max-h-screen max-w-screen overflow-hidden">
      <OwnerNotificationsPage />
    </main>
  );
}
