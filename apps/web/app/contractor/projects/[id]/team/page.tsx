import type { Metadata } from "next";
import { ContractorProjectTeamPage } from "../../../../../company/Director dashboard";

interface PageProps {
  params: Promise<{ id: string }>;
}

export const metadata: Metadata = {
  title: "Site Crew & Client | Vantaged Contractor",
  description: "Assign site crew members and manage client stakeholder contacts for this project.",
};

export default async function Page({ params }: PageProps) {
  const { id } = await params;
  return (
    <div className="h-screen w-screen max-h-screen max-w-screen overflow-hidden">
      <ContractorProjectTeamPage projectId={id} />
    </div>
  );
}
