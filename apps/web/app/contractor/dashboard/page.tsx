import type { Metadata } from "next";
import { DirectorDashboardHomePage } from "../../../company/Director dashboard";

export const metadata: Metadata = {
  title: "Company Director Dashboard | Vantaged",
  description:
    "Manage construction projects, verified stage progress, payment receipt confirmations, staff roles, and company compliance on Vantaged.",
};

export default function Page() {
  return (
    <main className="h-screen w-screen max-h-screen max-w-screen overflow-hidden">
      <DirectorDashboardHomePage />
    </main>
  );
}
