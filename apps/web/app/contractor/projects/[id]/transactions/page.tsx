import type { Metadata } from "next";
import { ContractorProjectTransactionsPage } from "../../../../../company/Director dashboard";

interface PageProps {
  params: Promise<{ id: string }>;
}

export const metadata: Metadata = {
  title: "Payments & Receipts | Vantaged Contractor",
  description: "Track project milestone payouts, 5% retainage holds, and confirm incoming receipts.",
};

export default async function Page({ params }: PageProps) {
  const { id } = await params;
  return (
    <div className="h-screen w-screen max-h-screen max-w-screen overflow-hidden">
      <ContractorProjectTransactionsPage projectId={id} />
    </div>
  );
}
