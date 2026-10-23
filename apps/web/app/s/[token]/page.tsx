import type { Metadata } from "next";
import { PublicShareLinkPage } from "../../../client/Owner dashboard/pages/PublicShareLinkPage";

interface PageProps {
  params: Promise<{ token: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { token } = await params;
  return {
    title: `Live Project Observer View (${token}) | Vantaged`,
    description: "Verified live construction progress, GPS proof photos, and milestone tracking on Vantaged.",
  };
}

export default async function Page({ params }: PageProps) {
  const { token } = await params;
  return (
    <main className="min-h-screen w-screen overflow-x-hidden">
      <PublicShareLinkPage token={token} />
    </main>
  );
}
