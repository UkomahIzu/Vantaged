import type { Metadata } from "next";
import { ContractorProjectChangeRequestsPage } from "../../../../../company/Director dashboard";

interface PageProps {
  params: Promise<{ id: string }>;
}

export const metadata: Metadata = {
  title: "Change Requests | Vantaged Contractor",
  description: "Propose and track BOQ/scope variations with cost and schedule impact.",
};

export default async function Page({ params }: PageProps) {
  const { id } = await params;
  return (
    <div className="h-screen w-screen max-h-screen max-w-screen overflow-hidden">
      <ContractorProjectChangeRequestsPage projectId={id} />
    </div>
  );
}
