import type { Metadata } from "next";
import { OwnerLoginPage } from "../../client/website/pages/OwnerLoginPage";

export const metadata: Metadata = {
  title: "Log In | Vantaged",
  description:
    "Sign in to your Vantaged Property Owner account to track stages, verify site proofs, and manage milestone payments.",
};

export default function LoginRoute() {
  return (
    <main className="h-screen w-screen max-h-screen max-w-screen overflow-hidden">
      <OwnerLoginPage />
    </main>
  );
}
