import type { Metadata } from "next";
import { ProjectDisputesPage } from "../../../../../client/Owner dashboard";

interface PageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  return {
    title: `Disputes & Impasses (${id}) | Vantaged`,
    description: "Formal dispute dossiers, 14-day mutual resolution timeline, and escrow fund protection.",
  };
}

export default async function Page({ params }: PageProps) {
  const { id } = await params;
  return (
    <div className="h-screen w-screen max-h-screen max-w-screen overflow-hidden">
      <ProjectDisputesPage projectId={id} />
    </div>
  );
}
