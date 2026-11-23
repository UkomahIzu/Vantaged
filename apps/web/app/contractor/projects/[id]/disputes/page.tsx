import type { Metadata } from "next";
import { ContractorProjectDisputesPage } from "../../../../../company/Director dashboard";

interface PageProps {
  params: Promise<{ id: string }>;
}

export const metadata: Metadata = {
  title: "Fixes & Disputes | Vantaged Contractor",
  description: "Respond to owner fix requests, submit cure plans, and attach dispute counter-evidence.",
};

export default async function Page({ params }: PageProps) {
  const { id } = await params;
  return (
    <div className="h-screen w-screen max-h-screen max-w-screen overflow-hidden">
      <ContractorProjectDisputesPage projectId={id} />
    </div>
  );
}
