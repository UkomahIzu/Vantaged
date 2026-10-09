import type { Metadata } from "next";
import { OwnerSignupPage } from "../../client/website/pages/OwnerSignupPage";

export const metadata: Metadata = {
  title: "Sign Up | Vantaged",
  description:
    "Join Vantaged — the trust and telemetry platform for African construction projects.",
};

export default function SignupRoute() {
  return (
    <main className="h-screen w-screen max-h-screen max-w-screen overflow-hidden">
      <OwnerSignupPage />
    </main>
  );
}
