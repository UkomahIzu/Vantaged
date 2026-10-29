import type { Metadata } from "next";
import { ContractorLoginPage } from "../../../company/Contractor Login";

export const metadata: Metadata = {
  title: "Contractor Terminal Sign In | Vantaged",
  description:
    "Approved contractor enterprise login portal for directors, site managers, coordinators, and field specialists.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function ContractorLoginRoute() {
  return (
    <main className="h-screen w-screen max-h-screen max-w-screen overflow-hidden">
      <ContractorLoginPage />
    </main>
  );
}

