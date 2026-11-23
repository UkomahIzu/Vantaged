import type { Metadata } from "next";
import { ContractorProjectOverviewPage } from "../../../../company/Director dashboard";

interface PageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  return {
    title: `Project Dashboard (${id}) | Vantaged Contractor`,
    description: "Manage stages, geo-tagged proof, receipts, fixes, variations, and site crew.",
  };
}

export default async function Page({ params }: PageProps) {
  const { id } = await params;
  return (
    <div className="h-screen w-screen max-h-screen max-w-screen overflow-hidden">
      <ContractorProjectOverviewPage projectId={id} />
    </div>
  );
}
