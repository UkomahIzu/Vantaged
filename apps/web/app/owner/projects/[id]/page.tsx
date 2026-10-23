import type { Metadata } from "next";
import { ProjectOverviewPage } from "../../../../client/Owner dashboard";

interface PageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  return {
    title: `Project Dashboard (${id}) | Vantaged`,
    description: "Verified telemetry, milestones, escrow finances, and team monitoring for your building project.",
  };
}

export default async function Page({ params }: PageProps) {
  const { id } = await params;
  return (
    <main className="h-screen w-screen max-h-screen max-w-screen overflow-hidden">
      <ProjectOverviewPage projectId={id} />
    </main>
  );
}
