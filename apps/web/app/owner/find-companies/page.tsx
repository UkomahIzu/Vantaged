import type { Metadata } from "next";
import { OwnerFindCompaniesPage } from "../../../client/Owner dashboard";

export const metadata: Metadata = {
  title: "Find Companies | Vantaged",
  description:
    "Discover verified Nigerian & diaspora construction contractors, engineering firms, and architectural studios on Vantaged.",
};

export default function Page() {
  return (
    <main className="h-screen w-screen max-h-screen max-w-screen overflow-hidden">
      <OwnerFindCompaniesPage />
    </main>
  );
}
