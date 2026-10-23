import type { Metadata } from "next";
import { ProjectTransactionsPage } from "../../../../../client/Owner dashboard";

interface PageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  return {
    title: `Project Transactions & Escrow (${id}) | Vantaged`,
    description: "Milestone tranche releases, 5% warranty hold, and contractor bank security lock.",
  };
}

export default async function Page({ params }: PageProps) {
  const { id } = await params;
  return (
    <main className="h-screen w-screen max-h-screen max-w-screen overflow-hidden">
      <ProjectTransactionsPage projectId={id} />
    </main>
  );
}
