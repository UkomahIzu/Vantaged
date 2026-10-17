import type { Metadata } from "next";
import { OwnerClientRepsPage } from "../../../client/Owner dashboard";

export const metadata: Metadata = {
  title: "Client Representatives | Vantaged",
  description:
    "Manage authorized independent engineers, architects, and proxies overseeing your construction sites on Vantaged.",
};

export default function Page() {
  return (
    <main className="h-screen w-screen max-h-screen max-w-screen overflow-hidden">
      <OwnerClientRepsPage />
    </main>
  );
}
