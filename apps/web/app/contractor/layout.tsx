import React from "react";
import { ContractorAuthGuard } from "../../company/Director dashboard/components/ContractorAuthGuard";

export default function ContractorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <ContractorAuthGuard>{children}</ContractorAuthGuard>;
}
