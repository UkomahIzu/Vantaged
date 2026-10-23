import type { Metadata } from "next";
import { ProjectDisputesPage } from "../../../../../client/Owner dashboard";

interface PageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  return {
    title: `Disputes & Impasses (${id}) | Vantaged`,
    description: "PRD 7.15 dispute dossiers, 14-day mutual resolution clock, and escrow protection.",
  };
}

export default async function Page({ params }: PageProps) {
  const { id } = await params;
  return (
    <main className="h-screen w-screen max-h-screen max-w-screen overflow-hidden">
      <ProjectDisputesPage projectId={id} />
    </main>
  );
}
