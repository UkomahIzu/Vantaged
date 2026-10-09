import type { Metadata } from "next";
import { OwnerSignupPage } from "../../../client/website/pages/OwnerSignupPage";

export const metadata: Metadata = {
  title: "Owner Sign Up | Vantaged",
  description:
    "Select your role as an owner to configure inspection rights, tamper-proof milestone telemetry, and stage payment approvals on Vantaged.",
};

export default function Page() {
  return (
    <main className="h-screen w-screen max-h-screen max-w-screen overflow-hidden">
      <OwnerSignupPage />
    </main>
  );
}
