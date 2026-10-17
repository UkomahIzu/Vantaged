import type { Metadata } from "next";
import { OwnerSettingsPage } from "../../../client/Owner dashboard";

export const metadata: Metadata = {
  title: "Settings & Profile | Vantaged",
  description:
    "Manage your personal profile, security credentials, escrow banking details, and alert preferences on Vantaged.",
};

export default function Page() {
  return (
    <main className="h-screen w-screen max-h-screen max-w-screen overflow-hidden">
      <OwnerSettingsPage />
    </main>
  );
}
