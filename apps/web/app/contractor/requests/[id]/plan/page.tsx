import type { Metadata } from "next";
import { ContractorPlanReviewPage } from "../../../../../company/Director dashboard";

interface PageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { id } = await params;
  return {
    title: `Sent Plan & Contract Negotiation (${id}) | Vantaged Contractor`,
    description:
      "Review sent milestone stages, negotiate contract pricing with the property owner, and update proposal terms before construction begins.",
  };
}

export default async function Page({ params }: PageProps) {
  const { id } = await params;
  return (
    <div className="h-screen w-screen max-h-screen max-w-screen overflow-hidden">
      <ContractorPlanReviewPage requestId={id} />
    </div>
  );
}
