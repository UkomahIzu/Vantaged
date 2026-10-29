"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import initialSubmissions from "../../../../packages/db/data/contractor-submissions.json";
import {
  IconVerification,
  IconSearch,
  IconShield,
  IconCheckCircle,
  IconExternalLink,
  IconDocument,
  IconEye,
  IconFolder,
} from "../../components/AdminIcons";

export interface ContractorDocument {
  id: string;
  type: "CAC_CERTIFICATE" | "TIN_CERTIFICATE" | "DIRECTOR_ID" | "COREN_LICENSE" | "OTHER";
  title: string;
  fileName: string;
  fileSize: string;
  fileType: string;
  fileData?: string;
  uploadedAt: string;
  verified?: boolean;
}

interface AutomatedChecks {
  cacStatus: string;
  tinVerified: boolean;
  bankNameMatched: boolean;
  identityCheck: string;
}

interface ContractorSubmission {
  id: string;
  referenceNumber: string;
  submittedAt: string;
  status: "UNDER_REVIEW" | "SUBMITTED" | "VERIFIED" | "REJECTED";
  companyName: string;
  rcNumber: string;
  tin: string;
  category: string;
  email: string;
  phone: string;
  officeAddress: string;
  state: string;
  directorName: string;
  directorRole: string;
  directorEmail: string;
  directorPhone: string;
  idType: string;
  idNumber: string;
  bankName: string;
  accountNumber: string;
  accountName: string;
  corenNumber: string;
  bppCategory: string;
  selectedPlan: string;
  yearsInBusiness: string;
  documents?: ContractorDocument[];
  automatedChecks: AutomatedChecks;
  rejectionReason?: string;
  rejectionNotes?: string;
  verifiedAt?: string;
}

export default function VerificationQueuePage() {
  const [submissions, setSubmissions] = useState<ContractorSubmission[]>(
    initialSubmissions as unknown as ContractorSubmission[]
  );
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [selectedSub, setSelectedSub] = useState<ContractorSubmission | null>(null);
  const [inspectingDoc, setInspectingDoc] = useState<ContractorDocument | null>(null);

  // Sync with live submissions API on mount
  useEffect(() => {
    fetch("/api/verifications")
      .then((res) => res.json())
      .then((data) => {
        if (data.success && Array.isArray(data.data)) {
          setSubmissions(data.data);
        }
      })
      .catch(() => {});
  }, []);

  // Approval / Rejection modal state
  const [isApproveOpen, setIsApproveOpen] = useState<boolean>(false);
  const [isRejectOpen, setIsRejectOpen] = useState<boolean>(false);
  const [rejectReason, setRejectReason] = useState<string>("CAC_INACTIVE");
  const [rejectNotes, setRejectNotes] = useState<string>("");
  const [toastMessage, setToastMessage] = useState<{
    type: "success" | "error" | "info";
    title: string;
    description: string;
    actionUrl?: string;
    actionText?: string;
  } | null>(null);

  // Filter logic
  const filtered = submissions.filter((sub) => {
    const matchesStatus =
      statusFilter === "ALL" ? true : sub.status === statusFilter;
    const term = searchTerm.toLowerCase().trim();
    const matchesSearch =
      !term ||
      sub.companyName.toLowerCase().includes(term) ||
      sub.rcNumber.toLowerCase().includes(term) ||
      sub.referenceNumber.toLowerCase().includes(term) ||
      sub.directorName.toLowerCase().includes(term) ||
      sub.state.toLowerCase().includes(term);
    return matchesStatus && matchesSearch;
  });

  // Status counts
  const countUnderReview = submissions.filter((s) => s.status === "UNDER_REVIEW").length;
  const countSubmitted = submissions.filter((s) => s.status === "SUBMITTED").length;
  const countVerified = submissions.filter((s) => s.status === "VERIFIED").length;
  const countRejected = submissions.filter((s) => s.status === "REJECTED").length;

  // Actions
  const handleToggleDocVerified = async (docId: string, currentVerified?: boolean) => {
    if (!selectedSub) return;
    const newVerified = !currentVerified;
    const updatedDocs = (selectedSub.documents || []).map((doc) =>
      doc.id === docId ? { ...doc, verified: newVerified } : doc
    );
    const updatedSub = { ...selectedSub, documents: updatedDocs };
    setSelectedSub(updatedSub);
    setSubmissions((prev) =>
      prev.map((s) => (s.id === selectedSub.id ? updatedSub : s))
    );

    try {
      await fetch("/api/verifications", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: selectedSub.id,
          documentVerification: { documentId: docId, verified: newVerified },
        }),
      });
    } catch {}
  };

  const handleApprove = async () => {
    if (!selectedSub) return;
    const updatedSub: ContractorSubmission = {
      ...selectedSub,
      status: "VERIFIED",
      verifiedAt: new Date().toISOString(),
    };

    setSubmissions((prev) =>
      prev.map((s) => (s.id === selectedSub.id ? updatedSub : s))
    );
    setSelectedSub(updatedSub);
    setIsApproveOpen(false);

    try {
      await fetch("/api/verifications", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: selectedSub.id, status: "VERIFIED" }),
      });
    } catch {}

    setToastMessage({
      type: "success",
      title: "Contractor Firm Approved & Credentialed",
      description: `${selectedSub.companyName} is now fully verified. Enterprise credentials dispatched for login portal.`,
      actionUrl: "http://localhost:3000/contractor/login",
      actionText: "Open Contractor Login",
    });
  };

  const handleReject = async () => {
    if (!selectedSub) return;
    const updatedSub: ContractorSubmission = {
      ...selectedSub,
      status: "REJECTED",
      rejectionReason: rejectReason,
      rejectionNotes: rejectNotes,
    };

    setSubmissions((prev) =>
      prev.map((s) => (s.id === selectedSub.id ? updatedSub : s))
    );
    setSelectedSub(updatedSub);
    setIsRejectOpen(false);
    setRejectNotes("");

    try {
      await fetch("/api/verifications", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: selectedSub.id,
          status: "REJECTED",
          rejectionReason: rejectReason,
          rejectionNotes: rejectNotes,
        }),
      });
    } catch {}

    setToastMessage({
      type: "error",
      title: "Contractor Submission Rejected",
      description: `Formal regulatory notice recorded for ${selectedSub.companyName}. Reason: ${rejectReason}.`,
    });
  };

  return (
    <div
      style={{ fontFamily: "'Outfit', var(--vt-font-sans), sans-serif" }}
      className="flex flex-col gap-5 sm:gap-6 w-full select-none font-sans"
    >
      {/* Toast Notification Banner */}
      {toastMessage && (
        <div
          className={`p-4 rounded-xl border flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-md transition-all ${
            toastMessage.type === "success"
              ? "bg-[var(--vt-color-green-50,#E9F6EC)] border-[var(--vt-color-green-200,#A3D9B1)] text-[var(--vt-color-green-800,#134427)]"
              : "bg-rose-50 border-rose-200 text-rose-800"
          }`}
        >
          <div className="flex items-start gap-3">
            <span
              className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${
                toastMessage.type === "success"
                  ? "bg-[var(--vt-color-green-500,#2E9E57)] text-white"
                  : "bg-rose-600 text-white"
              }`}
            >
              ✓
            </span>
            <div>
              <h4 className="text-sm font-bold">{toastMessage.title}</h4>
              <p className="text-xs opacity-90 mt-0.5">{toastMessage.description}</p>
            </div>
          </div>
          <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
            {toastMessage.actionUrl && (
              <a
                href={toastMessage.actionUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-white border border-[var(--vt-color-border-default,#E2E0EC)] hover:border-[var(--vt-color-neutral-300,#CBC8DA)] text-xs font-bold text-[var(--vt-color-indigo-900,#261A66)] transition-all shadow-2xs"
              >
                <span>{toastMessage.actionText || "View"}</span>
                <IconExternalLink className="w-3.5 h-3.5 text-[var(--vt-color-orange-500,#EF5F18)]" />
              </a>
            )}
            <button
              type="button"
              onClick={() => setToastMessage(null)}
              className="px-2.5 py-1 text-xs font-bold rounded hover:bg-black/5"
            >
              ✕
            </button>
          </div>
        </div>
      )}

      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="p-1.5 rounded-lg bg-[var(--vt-color-orange-50,#FFF4EE)] text-[var(--vt-color-orange-600,#D84C0B)] border border-[var(--vt-color-orange-200,#FDCAA9)]">
              <IconVerification className="w-4 h-4" />
            </span>
            <span className="text-xs font-mono uppercase tracking-wider text-[var(--vt-color-neutral-500,#7C7894)] font-bold">
              Compliance & Onboarding
            </span>
          </div>
          <h1 className="text-2xl font-extrabold tracking-tight text-[var(--vt-color-indigo-900,#261A66)]">
            Contractor Verification Queue
          </h1>
          <p className="text-xs sm:text-sm text-[var(--vt-color-neutral-600,#5E5A7D)]">
            Inspect corporate registration packets, automated CAC/TIN flags, approve accredited firms, and issue enterprise credentials.
          </p>
        </div>

        {/* Quick Portal Link */}
        <div className="flex items-center gap-2 shrink-0">
          <Link
            href="/contractors"
            className="h-10 px-4 rounded-md bg-white border border-[var(--vt-color-border-default,#E2E0EC)] hover:border-[var(--vt-color-neutral-300,#CBC8DA)] hover:bg-[var(--vt-color-neutral-50,#F7F7FA)] text-[var(--vt-color-indigo-900,#261A66)] flex items-center gap-1.5 text-xs font-bold transition-all shadow-2xs"
          >
            <span>Contractor Directory</span>
          </Link>
          <a
            href="http://localhost:3000/contractor/login"
            target="_blank"
            rel="noopener noreferrer"
            className="h-10 px-4 rounded-md bg-white border border-[var(--vt-color-border-default,#E2E0EC)] hover:border-[var(--vt-color-neutral-300,#CBC8DA)] hover:bg-[var(--vt-color-neutral-50,#F7F7FA)] text-[var(--vt-color-indigo-900,#261A66)] flex items-center gap-1.5 text-xs font-bold transition-all shadow-2xs"
          >
            <span>Contractor Terminal</span>
            <IconExternalLink className="w-3.5 h-3.5 text-[var(--vt-color-orange-500,#EF5F18)]" />
          </a>
        </div>
      </div>

      {/* Summary KPI Stat Cards */}
      <section className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 w-full">
        <div
          onClick={() => setStatusFilter("ALL")}
          className={`p-4 rounded-xl border bg-white cursor-pointer transition-all shadow-2xs ${
            statusFilter === "ALL"
              ? "border-[var(--vt-color-orange-500,#EF5F18)] ring-2 ring-[var(--vt-color-orange-500,#EF5F18)]/15"
              : "border-[var(--vt-color-border-default,#E2E0EC)] hover:border-[var(--vt-color-neutral-300,#CBC8DA)]"
          }`}
        >
          <div className="text-[11px] font-semibold text-[var(--vt-color-neutral-500,#7C7894)]">
            Total Submissions
          </div>
          <div className="text-2xl font-extrabold text-[var(--vt-color-indigo-900,#261A66)] mt-1">
            {submissions.length.toString().padStart(2, "0")}
          </div>
        </div>

        <div
          onClick={() => setStatusFilter("UNDER_REVIEW")}
          className={`p-4 rounded-xl border bg-white cursor-pointer transition-all shadow-2xs ${
            statusFilter === "UNDER_REVIEW"
              ? "border-[var(--vt-color-orange-500,#EF5F18)] ring-2 ring-[var(--vt-color-orange-500,#EF5F18)]/15"
              : "border-[var(--vt-color-border-default,#E2E0EC)] hover:border-[var(--vt-color-neutral-300,#CBC8DA)]"
          }`}
        >
          <div className="text-[11px] font-semibold text-[var(--vt-color-orange-700,#B33C08)] flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[var(--vt-color-orange-500,#EF5F18)] animate-pulse" />
            Under Review
          </div>
          <div className="text-2xl font-extrabold text-[var(--vt-color-orange-600,#D84C0B)] mt-1">
            {countUnderReview.toString().padStart(2, "0")}
          </div>
        </div>

        <div
          onClick={() => setStatusFilter("SUBMITTED")}
          className={`p-4 rounded-xl border bg-white cursor-pointer transition-all shadow-2xs ${
            statusFilter === "SUBMITTED"
              ? "border-[var(--vt-color-orange-500,#EF5F18)] ring-2 ring-[var(--vt-color-orange-500,#EF5F18)]/15"
              : "border-[var(--vt-color-border-default,#E2E0EC)] hover:border-[var(--vt-color-neutral-300,#CBC8DA)]"
          }`}
        >
          <div className="text-[11px] font-semibold text-[var(--vt-color-indigo-700,#43379A)]">
            New Submissions
          </div>
          <div className="text-2xl font-extrabold text-[var(--vt-color-indigo-900,#261A66)] mt-1">
            {countSubmitted.toString().padStart(2, "0")}
          </div>
        </div>

        <div
          onClick={() => setStatusFilter("VERIFIED")}
          className={`p-4 rounded-xl border bg-white cursor-pointer transition-all shadow-2xs ${
            statusFilter === "VERIFIED"
              ? "border-[var(--vt-color-orange-500,#EF5F18)] ring-2 ring-[var(--vt-color-orange-500,#EF5F18)]/15"
              : "border-[var(--vt-color-border-default,#E2E0EC)] hover:border-[var(--vt-color-neutral-300,#CBC8DA)]"
          }`}
        >
          <div className="text-[11px] font-semibold text-[var(--vt-color-green-700,#1F6B3E)]">
            Verified & Credentialed
          </div>
          <div className="text-2xl font-extrabold text-[var(--vt-color-green-700,#1F6B3E)] mt-1">
            {countVerified.toString().padStart(2, "0")}
          </div>
        </div>
      </section>

      {/* Search & Status Filters Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3.5 rounded-xl border border-[var(--vt-color-border-default,#E2E0EC)] bg-white p-3.5 shadow-2xs">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-[var(--vt-color-neutral-400,#A3A0B8)]">
            <IconSearch className="w-4 h-4" />
          </div>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by company, RC number, reference, or director..."
            className="w-full h-9 pl-9 pr-4 rounded-md border border-[var(--vt-color-border-default,#E2E0EC)] bg-[var(--vt-color-neutral-50,#F7F7FA)] text-xs sm:text-sm text-[var(--vt-color-text-default,#261A66)] placeholder:text-[var(--vt-color-neutral-400,#A3A0B8)] focus:border-[var(--vt-color-orange-500,#EF5F18)] focus:bg-white outline-none transition-all"
          />
        </div>

        {/* Status Filter Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          {[
            { id: "ALL", label: `All (${submissions.length})` },
            { id: "UNDER_REVIEW", label: `Review (${countUnderReview})` },
            { id: "SUBMITTED", label: `Submitted (${countSubmitted})` },
            { id: "VERIFIED", label: `Verified (${countVerified})` },
            { id: "REJECTED", label: `Rejected (${countRejected})` },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setStatusFilter(tab.id)}
              className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all shrink-0 cursor-pointer ${
                statusFilter === tab.id
                  ? "bg-[var(--vt-color-orange-500,#EF5F18)] text-white shadow-2xs"
                  : "bg-[var(--vt-color-neutral-50,#F7F7FA)] text-[var(--vt-color-neutral-600,#5E5A7D)] hover:text-[var(--vt-color-indigo-900,#261A66)] hover:bg-[var(--vt-color-neutral-100,#EFEEF5)]"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Submissions Table with Zero Horizontal Scroll */}
      <div className="w-full bg-white rounded-2xl border border-[var(--vt-color-border-default,#E2E0EC)] shadow-2xs overflow-hidden">
        <table className="w-full table-fixed text-left border-collapse font-sans text-xs">
          <thead>
            <tr className="border-b border-[var(--vt-color-neutral-100,#EFEEF5)] bg-[var(--vt-color-neutral-50,#F7F7FA)]/80 text-[11px] font-extrabold uppercase tracking-wider text-[var(--vt-color-neutral-400,#A3A0B8)]">
              <th className="py-3 px-3 sm:px-4 w-[34%]">Company & Application Ref</th>
              <th className="py-3 px-3 sm:px-4 w-[24%]">Managing Director</th>
              <th className="py-3 px-3 sm:px-4 w-[20%]">Automated Checks</th>
              <th className="py-3 px-3 sm:px-4 w-[22%]">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--vt-color-neutral-100,#EFEEF5)]">
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={4} className="py-16 text-center text-[var(--vt-color-neutral-400,#A3A0B8)]">
                  <svg className="w-10 h-10 mx-auto mb-2.5 text-[var(--vt-color-neutral-300,#CBC8DA)]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <circle cx="11" cy="11" r="8" />
                    <line x1="21" y1="21" x2="16.65" y2="16.65" />
                  </svg>
                  <p className="font-bold text-sm text-[var(--vt-color-indigo-900,#261A66)]">No contractor packets found</p>
                  <p className="text-xs text-[var(--vt-color-neutral-500,#7C7894)] mt-1">Try clearing your filters or search keywords.</p>
                  <button
                    type="button"
                    onClick={() => {
                      setStatusFilter("ALL");
                      setSearchTerm("");
                    }}
                    className="mt-3 inline-flex items-center gap-1 text-xs font-bold text-[var(--vt-color-orange-500,#EF5F18)] hover:underline"
                  >
                    Clear all filters
                  </button>
                </td>
              </tr>
            ) : (
              filtered.map((item) => (
                <tr
                  key={item.id}
                  onClick={() => setSelectedSub(item)}
                  className={`group hover:bg-[var(--vt-color-orange-50,#FFF4EE)]/50 transition-colors cursor-pointer ${
                    selectedSub?.id === item.id ? "bg-[var(--vt-color-orange-50,#FFF4EE)]/80" : ""
                  }`}
                >
                  {/* Company & Application Ref */}
                  <td className="py-3 px-3 sm:px-4">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="w-8 h-8 rounded-lg bg-[var(--vt-color-indigo-50,#F4F3FC)] text-[var(--vt-color-indigo-900,#261A66)] font-bold text-xs flex items-center justify-center border border-[var(--vt-color-indigo-100,#EAE8F9)] shrink-0">
                        {item.companyName.charAt(0)}
                      </div>
                      <div className="min-w-0 flex-1">
                        <span className="font-bold text-sm text-[var(--vt-color-indigo-900,#261A66)] group-hover:text-[var(--vt-color-orange-600,#D84C0B)] transition-colors truncate block">
                          {item.companyName}
                        </span>
                        <div className="text-[11px] text-[var(--vt-color-neutral-500,#7C7894)] flex items-center gap-1.5 mt-0.5 truncate">
                          <span className="font-mono font-bold text-[var(--vt-color-orange-600,#D84C0B)]">
                            {item.referenceNumber}
                          </span>
                          <span>·</span>
                          <span className="font-mono">{item.rcNumber}</span>
                          <span>·</span>
                          <span>{item.state}</span>
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* Managing Director */}
                  <td className="py-3 px-3 sm:px-4 min-w-0">
                    <div className="font-bold text-xs text-[var(--vt-color-indigo-900,#261A66)] truncate">
                      {item.directorName}
                    </div>
                    <div className="text-[11px] text-[var(--vt-color-neutral-500,#7C7894)] mt-0.5 truncate">
                      {item.directorRole}
                    </div>
                  </td>

                  {/* Automated Checks */}
                  <td className="py-3 px-3 sm:px-4 whitespace-nowrap">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-[var(--vt-color-green-50,#E9F6EC)] text-[var(--vt-color-green-700,#1F6B3E)] border border-[var(--vt-color-green-200,#A3D9B1)]">
                      <span className="w-1.5 h-1.5 rounded-full bg-[var(--vt-color-green-500,#2E9E57)]" />
                      4/4 Passed
                    </span>
                  </td>

                  {/* Status Pill */}
                  <td className="py-3 px-3 sm:px-4 whitespace-nowrap">
                    {item.status === "VERIFIED" && (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-[var(--vt-color-green-50,#E9F6EC)] text-[var(--vt-color-green-700,#1F6B3E)] border border-[var(--vt-color-green-200,#A3D9B1)]">
                        <span className="w-1.5 h-1.5 rounded-full bg-[var(--vt-color-green-500,#2E9E57)]" />
                        VERIFIED
                      </span>
                    )}
                    {item.status === "UNDER_REVIEW" && (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-[var(--vt-color-orange-50,#FFF4EE)] text-[var(--vt-color-orange-700,#B33C08)] border border-[var(--vt-color-orange-200,#FDCAA9)]">
                        <span className="w-1.5 h-1.5 rounded-full bg-[var(--vt-color-orange-500,#EF5F18)] animate-pulse" />
                        UNDER REVIEW
                      </span>
                    )}
                    {item.status === "SUBMITTED" && (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-[var(--vt-color-indigo-50,#F4F3FC)] text-[var(--vt-color-indigo-700,#43379A)] border border-[var(--vt-color-indigo-200,#D7D3F3)]">
                        <span className="w-1.5 h-1.5 rounded-full bg-[var(--vt-color-indigo-500,#43379A)]" />
                        SUBMITTED
                      </span>
                    )}
                    {item.status === "REJECTED" && (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-rose-50 text-rose-700 border border-rose-200">
                        <span className="w-1.5 h-1.5 rounded-full bg-rose-600" />
                        REJECTED
                      </span>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Detailed Inspection Drawer / Modal */}
      {selectedSub && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/40 backdrop-blur-xs">
          <div className="bg-white rounded-2xl border border-[var(--vt-color-border-default,#E2E0EC)] shadow-2xl max-w-3xl w-full max-h-[92vh] flex flex-col overflow-hidden animate-in fade-in-50 zoom-in-95">
            {/* Modal Header */}
            <div className="p-5 border-b border-[var(--vt-color-neutral-100,#EFEEF5)] flex items-start justify-between gap-4 bg-[var(--vt-color-neutral-50,#F7F7FA)]">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-[var(--vt-color-orange-50,#FFF4EE)] text-[var(--vt-color-orange-700,#B33C08)] border border-[var(--vt-color-orange-200,#FDCAA9)]">
                    {selectedSub.referenceNumber}
                  </span>
                  <span className="text-xs font-mono text-[var(--vt-color-neutral-500,#7C7894)]">
                    Submitted: {new Date(selectedSub.submittedAt).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
                  </span>
                </div>
                <h2 className="text-xl font-extrabold text-[var(--vt-color-indigo-900,#261A66)] tracking-tight">
                  {selectedSub.companyName}
                </h2>
                <p className="text-xs text-[var(--vt-color-neutral-500,#7C7894)] mt-0.5">
                  CAC: {selectedSub.rcNumber} · TIN: {selectedSub.tin} · {selectedSub.category}
                </p>
              </div>

              <button
                type="button"
                onClick={() => setSelectedSub(null)}
                className="w-8 h-8 rounded-md hover:bg-[var(--vt-color-neutral-200,#E2E0EC)] text-[var(--vt-color-neutral-600,#5E5A7D)] flex items-center justify-center text-sm font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-5 overflow-y-auto space-y-5 text-xs text-[var(--vt-color-text-default,#261A66)]">
              {/* Automated Integrity Cross-Check Banner */}
              <div className="p-4 rounded-xl border border-[var(--vt-color-green-200,#A3D9B1)] bg-[var(--vt-color-green-50,#E9F6EC)]/60">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <IconShield className="w-4 h-4 text-[var(--vt-color-green-700,#1F6B3E)]" />
                    <span className="font-bold text-[var(--vt-color-green-800,#134427)] text-sm">
                      Automated Registry Cross-Checks: 100% Passed
                    </span>
                  </div>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[var(--vt-color-green-500,#2E9E57)] text-white">
                    VERIFIED
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  <div className="bg-white p-2.5 rounded-lg border border-[var(--vt-color-green-200,#A3D9B1)]">
                    <div className="text-[10px] text-[var(--vt-color-neutral-500,#7C7894)]">CAC Corporate</div>
                    <div className="font-bold text-[var(--vt-color-green-700,#1F6B3E)] mt-0.5">
                      ✓ {selectedSub.automatedChecks.cacStatus}
                    </div>
                  </div>
                  <div className="bg-white p-2.5 rounded-lg border border-[var(--vt-color-green-200,#A3D9B1)]">
                    <div className="text-[10px] text-[var(--vt-color-neutral-500,#7C7894)]">FIRS TIN</div>
                    <div className="font-bold text-[var(--vt-color-green-700,#1F6B3E)] mt-0.5">
                      ✓ Valid Corporate
                    </div>
                  </div>
                  <div className="bg-white p-2.5 rounded-lg border border-[var(--vt-color-green-200,#A3D9B1)]">
                    <div className="text-[10px] text-[var(--vt-color-neutral-500,#7C7894)]">NUBAN Name</div>
                    <div className="font-bold text-[var(--vt-color-green-700,#1F6B3E)] mt-0.5">
                      ✓ 100% Match
                    </div>
                  </div>
                  <div className="bg-white p-2.5 rounded-lg border border-[var(--vt-color-green-200,#A3D9B1)]">
                    <div className="text-[10px] text-[var(--vt-color-neutral-500,#7C7894)]">Director NIN</div>
                    <div className="font-bold text-[var(--vt-color-green-700,#1F6B3E)] mt-0.5">
                      ✓ NIMC Match
                    </div>
                  </div>
                </div>
              </div>

              {/* Grid of Submission Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Section 1: Corporate Entity */}
                <div className="p-4 rounded-xl border border-[var(--vt-color-border-default,#E2E0EC)] bg-[var(--vt-color-neutral-50,#F7F7FA)]">
                  <h3 className="font-bold text-[var(--vt-color-indigo-900,#261A66)] text-xs uppercase tracking-wider font-mono mb-3">
                    Corporate Packet
                  </h3>
                  <dl className="space-y-2 text-xs">
                    <div className="flex justify-between">
                      <dt className="text-[var(--vt-color-neutral-500,#7C7894)]">Company Name:</dt>
                      <dd className="font-bold text-right">{selectedSub.companyName}</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-[var(--vt-color-neutral-500,#7C7894)]">RC Number:</dt>
                      <dd className="font-mono font-bold">{selectedSub.rcNumber}</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-[var(--vt-color-neutral-500,#7C7894)]">TIN:</dt>
                      <dd className="font-mono font-bold">{selectedSub.tin}</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-[var(--vt-color-neutral-500,#7C7894)]">Registered Office:</dt>
                      <dd className="text-right max-w-[210px] truncate">{selectedSub.officeAddress}</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-[var(--vt-color-neutral-500,#7C7894)]">Operating State:</dt>
                      <dd className="font-bold">{selectedSub.state}</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-[var(--vt-color-neutral-500,#7C7894)]">Corporate Email:</dt>
                      <dd className="font-mono">{selectedSub.email}</dd>
                    </div>
                  </dl>
                </div>

                {/* Section 2: Director Biometric / Identity */}
                <div className="p-4 rounded-xl border border-[var(--vt-color-border-default,#E2E0EC)] bg-[var(--vt-color-neutral-50,#F7F7FA)]">
                  <h3 className="font-bold text-[var(--vt-color-indigo-900,#261A66)] text-xs uppercase tracking-wider font-mono mb-3">
                    Managing Director / Signatory
                  </h3>
                  <dl className="space-y-2 text-xs">
                    <div className="flex justify-between">
                      <dt className="text-[var(--vt-color-neutral-500,#7C7894)]">Full Legal Name:</dt>
                      <dd className="font-bold">{selectedSub.directorName}</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-[var(--vt-color-neutral-500,#7C7894)]">Executive Title:</dt>
                      <dd>{selectedSub.directorRole}</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-[var(--vt-color-neutral-500,#7C7894)]">{selectedSub.idType} Number:</dt>
                      <dd className="font-mono font-bold">{selectedSub.idNumber}</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-[var(--vt-color-neutral-500,#7C7894)]">Direct Email:</dt>
                      <dd className="font-mono">{selectedSub.directorEmail}</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-[var(--vt-color-neutral-500,#7C7894)]">Direct Telephone:</dt>
                      <dd className="font-mono">{selectedSub.directorPhone}</dd>
                    </div>
                  </dl>
                </div>

                {/* Section 3: Banking & Escrow Settlement */}
                <div className="p-4 rounded-xl border border-[var(--vt-color-border-default,#E2E0EC)] bg-[var(--vt-color-neutral-50,#F7F7FA)]">
                  <h3 className="font-bold text-[var(--vt-color-indigo-900,#261A66)] text-xs uppercase tracking-wider font-mono mb-3">
                    Settlement & Escrow Banking
                  </h3>
                  <dl className="space-y-2 text-xs">
                    <div className="flex justify-between">
                      <dt className="text-[var(--vt-color-neutral-500,#7C7894)]">Designated Bank:</dt>
                      <dd className="font-bold">{selectedSub.bankName}</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-[var(--vt-color-neutral-500,#7C7894)]">NUBAN Account No:</dt>
                      <dd className="font-mono font-bold text-sm text-[var(--vt-color-indigo-900,#261A66)]">
                        {selectedSub.accountNumber}
                      </dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-[var(--vt-color-neutral-500,#7C7894)]">Account Name:</dt>
                      <dd className="font-semibold text-right max-w-[210px] truncate">
                        {selectedSub.accountName}
                      </dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-[var(--vt-color-neutral-500,#7C7894)]">Cross-Match Result:</dt>
                      <dd className="text-emerald-700 font-bold">100% Corporate Match</dd>
                    </div>
                  </dl>
                </div>

                {/* Section 4: Accreditations & Plan */}
                <div className="p-4 rounded-xl border border-[var(--vt-color-border-default,#E2E0EC)] bg-[var(--vt-color-neutral-50,#F7F7FA)]">
                  <h3 className="font-bold text-[var(--vt-color-indigo-900,#261A66)] text-xs uppercase tracking-wider font-mono mb-3">
                    Technical Accreditations & Tier
                  </h3>
                  <dl className="space-y-2 text-xs">
                    <div className="flex justify-between">
                      <dt className="text-[var(--vt-color-neutral-500,#7C7894)]">COREN Reg Number:</dt>
                      <dd className="font-mono font-bold">{selectedSub.corenNumber}</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-[var(--vt-color-neutral-500,#7C7894)]">BPP Federal Works:</dt>
                      <dd className="font-bold">{selectedSub.bppCategory}</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-[var(--vt-color-neutral-500,#7C7894)]">Years in Operation:</dt>
                      <dd>{selectedSub.yearsInBusiness}</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-[var(--vt-color-neutral-500,#7C7894)]">Selected Plan:</dt>
                      <dd className="capitalize font-bold text-[var(--vt-color-orange-600,#D84C0B)]">
                        {selectedSub.selectedPlan} Tier
                      </dd>
                    </div>
                  </dl>
                </div>
              </div>

              {/* Section 5: Uploaded Compliance Documents */}
              <div className="p-4 rounded-xl border border-[var(--vt-color-border-default,#E2E0EC)] bg-white shadow-2xs">
                <div className="flex items-center gap-2 pb-3 border-b border-[var(--vt-color-neutral-100,#EFEEF5)] mb-3">
                  <span className="p-1.5 rounded-lg bg-[var(--vt-color-orange-50,#FFF4EE)] text-[var(--vt-color-orange-600,#D84C0B)] border border-[var(--vt-color-orange-200,#FDCAA9)]">
                    <IconFolder className="w-4 h-4" />
                  </span>
                  <div>
                    <h3 className="font-bold text-[var(--vt-color-indigo-900,#261A66)] text-xs uppercase tracking-wider font-mono">
                      Uploaded Documents
                    </h3>
                    <p className="text-[11px] text-[var(--vt-color-neutral-500,#7C7894)]">
                      Corporate certificates and practicing licenses attached to this submission.
                    </p>
                  </div>
                </div>

                {(!selectedSub.documents || selectedSub.documents.length === 0) ? (
                  <p className="text-xs text-[var(--vt-color-neutral-400,#A3A0B8)] py-4 text-center">
                    No documents uploaded with this submission packet.
                  </p>
                ) : (
                  <div className="space-y-2">
                    {selectedSub.documents.map((doc) => (
                      <div
                        key={doc.id}
                        className="p-3 rounded-lg border border-[var(--vt-color-border-default,#E2E0EC)] bg-[var(--vt-color-neutral-50,#F7F7FA)] flex items-center justify-between gap-3"
                      >
                        <div className="flex items-center gap-2.5 min-w-0 flex-1">
                          <span className="p-2 rounded-md bg-white border border-[var(--vt-color-border-default,#E2E0EC)] text-[var(--vt-color-indigo-900,#261A66)] shrink-0">
                            <IconDocument className="w-4 h-4" />
                          </span>
                          <div className="min-w-0 flex-1">
                            <div className="text-xs font-bold text-[var(--vt-color-indigo-900,#261A66)] truncate">
                              {doc.title}
                            </div>
                            <div className="text-[11px] font-mono text-[var(--vt-color-neutral-500,#7C7894)] truncate mt-0.5">
                              {doc.fileName} · {doc.fileSize}
                            </div>
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={() => setInspectingDoc(doc)}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-white border border-[var(--vt-color-border-default,#E2E0EC)] hover:border-[var(--vt-color-neutral-300,#CBC8DA)] text-xs font-bold text-[var(--vt-color-indigo-900,#261A66)] hover:text-[var(--vt-color-orange-600,#D84C0B)] transition-all shadow-2xs shrink-0 cursor-pointer"
                        >
                          <IconEye className="w-3.5 h-3.5 text-[var(--vt-color-orange-500,#EF5F18)]" />
                          <span>Inspect</span>
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Prior Rejection Note if Rejected */}
              {selectedSub.status === "REJECTED" && (
                <div className="p-4 rounded-xl border border-rose-200 bg-rose-50 text-rose-800">
                  <div className="font-bold text-sm mb-1">Formal Regulatory Rejection Notice</div>
                  <div className="text-xs">Reason: {selectedSub.rejectionReason}</div>
                  {selectedSub.rejectionNotes && (
                    <div className="text-xs mt-1 italic">Notes: "{selectedSub.rejectionNotes}"</div>
                  )}
                </div>
              )}

              {/* Enterprise Access Information if Verified */}
              {selectedSub.status === "VERIFIED" && (
                <div className="p-4 rounded-xl border border-[var(--vt-color-green-200,#A3D9B1)] bg-[var(--vt-color-green-50,#E9F6EC)] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <div className="font-bold text-sm text-[var(--vt-color-green-800,#134427)]">
                      Enterprise Access Active
                    </div>
                    <div className="text-xs text-[var(--vt-color-green-700,#1F6B3E)] mt-0.5">
                      Contractor can sign in at Port 3000 using their corporate email.
                    </div>
                    <div className="font-mono text-xs text-[var(--vt-color-indigo-900,#261A66)] font-bold mt-1">
                      http://localhost:3000/contractor/login
                    </div>
                  </div>

                  <a
                    href="http://localhost:3000/contractor/login"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-md bg-[var(--vt-color-green-700,#1F6B3E)] hover:bg-[var(--vt-color-green-800,#134427)] text-white text-xs font-bold transition-all shadow-2xs self-start sm:self-center"
                  >
                    <span>Launch Login</span>
                    <IconExternalLink className="w-3.5 h-3.5 text-white" />
                  </a>
                </div>
              )}
            </div>

            {/* Modal Actions Footer */}
            <div className="p-4 border-t border-[var(--vt-color-neutral-100,#EFEEF5)] bg-[var(--vt-color-neutral-50,#F7F7FA)] flex items-center justify-between gap-3">
              <button
                type="button"
                onClick={() => setSelectedSub(null)}
                className="h-9 px-4 rounded-md border border-[var(--vt-color-border-default,#E2E0EC)] bg-white text-xs font-bold text-[var(--vt-color-indigo-900,#261A66)] hover:bg-[var(--vt-color-neutral-50,#F7F7FA)] transition-all"
              >
                Close
              </button>

              <div className="flex items-center gap-2.5">
                {selectedSub.status !== "REJECTED" && (
                  <button
                    type="button"
                    onClick={() => setIsRejectOpen(true)}
                    className="h-9 px-4 rounded-md border border-rose-200 bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-bold transition-all"
                  >
                    Reject Submission
                  </button>
                )}

                {selectedSub.status !== "VERIFIED" && (
                  <button
                    type="button"
                    onClick={() => setIsApproveOpen(true)}
                    className="h-9 px-5 rounded-md bg-[var(--vt-color-orange-500,#EF5F18)] hover:bg-[var(--vt-color-orange-600,#D84C0B)] text-white text-xs font-bold transition-all shadow-[0_2px_8px_rgba(239,95,24,0.3)] flex items-center gap-2"
                  >
                    <span>Approve Firm & Issue Credentials</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Confirmation Modal: Approve Contractor */}
      {isApproveOpen && selectedSub && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="bg-white rounded-2xl border border-[var(--vt-color-border-default,#E2E0EC)] shadow-2xl max-w-lg w-full p-6 animate-in fade-in-50 zoom-in-95">
            <div className="w-12 h-12 rounded-xl bg-[var(--vt-color-green-50,#E9F6EC)] text-[var(--vt-color-green-700,#1F6B3E)] border border-[var(--vt-color-green-200,#A3D9B1)] flex items-center justify-center mb-4">
              <IconCheckCircle className="w-6 h-6" />
            </div>

            <h3 className="text-lg font-extrabold text-[var(--vt-color-indigo-900,#261A66)] tracking-tight">
              Approve Contractor & Issue Credentials?
            </h3>

            <p className="text-xs text-[var(--vt-color-neutral-600,#5E5A7D)] leading-relaxed mt-2">
              You are approving <span className="font-bold text-[var(--vt-color-indigo-900,#261A66)]">{selectedSub.companyName}</span> ({selectedSub.rcNumber}).
              This will assign verified compliance badges, activate their enterprise account, and authorize login at:
            </p>

            <div className="mt-3 p-3 rounded-lg bg-[var(--vt-color-neutral-50,#F7F7FA)] border border-[var(--vt-color-border-default,#E2E0EC)] font-mono text-xs text-[var(--vt-color-orange-600,#D84C0B)] font-bold">
              http://localhost:3000/contractor/login
            </div>

            <div className="mt-4 flex flex-col gap-2 text-xs text-[var(--vt-color-neutral-600,#5E5A7D)]">
              <div className="flex items-center gap-2">
                <span className="text-[var(--vt-color-green-600,#2E9E57)] font-bold">✓</span>
                <span>COREN Certified Contractor badge attached to public profile</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[var(--vt-color-green-600,#2E9E57)] font-bold">✓</span>
                <span>NUBAN escrow payout verified for automated milestone releases</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[var(--vt-color-green-600,#2E9E57)] font-bold">✓</span>
                <span>Notification email dispatched to {selectedSub.email}</span>
              </div>
            </div>

            <div className="mt-6 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setIsApproveOpen(false)}
                className="h-9 px-4 rounded-md border border-[var(--vt-color-border-default,#E2E0EC)] bg-white text-xs font-bold text-[var(--vt-color-indigo-900,#261A66)] hover:bg-[var(--vt-color-neutral-50,#F7F7FA)]"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleApprove}
                className="h-9 px-5 rounded-md bg-[var(--vt-color-green-600,#2E9E57)] hover:bg-[var(--vt-color-green-700,#1F6B3E)] text-white text-xs font-bold transition-all shadow-[0_2px_8px_rgba(46,158,87,0.3)]"
              >
                Confirm Approval & Issue Access
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Confirmation Modal: Reject Submission */}
      {isRejectOpen && selectedSub && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="bg-white rounded-2xl border border-[var(--vt-color-border-default,#E2E0EC)] shadow-2xl max-w-lg w-full p-6 animate-in fade-in-50 zoom-in-95">
            <div className="w-12 h-12 rounded-xl bg-rose-50 text-rose-700 border border-rose-200 flex items-center justify-center mb-4">
              <span className="text-xl font-bold">!</span>
            </div>

            <h3 className="text-lg font-extrabold text-[var(--vt-color-indigo-900,#261A66)] tracking-tight">
              Reject Contractor Packet
            </h3>

            <p className="text-xs text-[var(--vt-color-neutral-600,#5E5A7D)] mt-1.5">
              Select the regulatory rationale for rejecting the submission from <span className="font-bold">{selectedSub.companyName}</span>.
            </p>

            <div className="mt-4 space-y-3">
              <div>
                <label className="block text-xs font-bold text-[var(--vt-color-indigo-900,#261A66)] mb-1">
                  Regulatory Reason
                </label>
                <select
                  value={rejectReason}
                  onChange={(e) => setRejectReason(e.target.value)}
                  className="w-full h-9 px-3 rounded-md border border-[var(--vt-color-border-default,#E2E0EC)] bg-white text-xs text-[var(--vt-color-text-default,#261A66)] outline-none focus:border-[var(--vt-color-orange-500,#EF5F18)]"
                >
                  <option value="CAC_INACTIVE">CAC Entity Inactive or Name Dissimilar</option>
                  <option value="TIN_INVALID">FIRS Tax Identification Number (TIN) Unverified</option>
                  <option value="NUBAN_MISMATCH">Bank Account Name Mismatch vs Corporate Registration</option>
                  <option value="DIRECTOR_ID_FAILED">Director Identity (NIN/Passport) Biometric Failure</option>
                  <option value="COREN_EXPIRED">COREN Practice Certificate Expired or Unverified</option>
                  <option value="INCOMPLETE_PACKET">Incomplete Corporate Packet / Missing Documentation</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-[var(--vt-color-indigo-900,#261A66)] mb-1">
                  Administrative Notes (Optional)
                </label>
                <textarea
                  value={rejectNotes}
                  onChange={(e) => setRejectNotes(e.target.value)}
                  placeholder="Detail exact findings for audit record..."
                  rows={3}
                  className="w-full p-2.5 rounded-md border border-[var(--vt-color-border-default,#E2E0EC)] bg-white text-xs text-[var(--vt-color-text-default,#261A66)] outline-none focus:border-[var(--vt-color-orange-500,#EF5F18)]"
                />
              </div>
            </div>

            <div className="mt-6 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setIsRejectOpen(false)}
                className="h-9 px-4 rounded-md border border-[var(--vt-color-border-default,#E2E0EC)] bg-white text-xs font-bold text-[var(--vt-color-indigo-900,#261A66)] hover:bg-[var(--vt-color-neutral-50,#F7F7FA)]"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleReject}
                className="h-9 px-5 rounded-md bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold transition-all shadow-[0_2px_8px_rgba(225,29,72,0.3)]"
              >
                Confirm Rejection
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Document Inspection Lightbox / Viewer Modal */}
      {inspectingDoc && selectedSub && (
        <div className="fixed inset-0 z-70 flex items-center justify-center p-3 sm:p-6 bg-black/65 backdrop-blur-xs animate-in fade-in-50">
          <div className="bg-white rounded-2xl border border-[var(--vt-color-border-default,#E2E0EC)] shadow-2xl max-w-lg w-full max-h-[90vh] flex flex-col overflow-hidden animate-in zoom-in-95 font-sans">
            {/* Viewer Header */}
            <div className="px-5 py-4 border-b border-[var(--vt-color-neutral-100,#EFEEF5)] bg-[var(--vt-color-neutral-50,#F7F7FA)] flex items-center justify-between gap-3">
              <div className="flex items-center gap-2.5 min-w-0">
                <span className="w-8 h-8 rounded-lg bg-[var(--vt-color-orange-50,#FFF4EE)] text-[var(--vt-color-orange-600,#D84C0B)] flex items-center justify-center border border-[var(--vt-color-orange-200,#FDCAA9)] shrink-0">
                  <IconDocument className="w-4 h-4" />
                </span>
                <div className="min-w-0">
                  <h4 className="font-extrabold text-sm text-[var(--vt-color-indigo-900,#261A66)] truncate">
                    {inspectingDoc.title}
                  </h4>
                  <div className="text-[11px] font-mono text-[var(--vt-color-neutral-500,#7C7894)] flex items-center gap-2 mt-0.5">
                    <span>{inspectingDoc.fileName}</span>
                    <span>·</span>
                    <span>{inspectingDoc.fileSize}</span>
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setInspectingDoc(null)}
                className="w-8 h-8 rounded-lg flex items-center justify-center text-[var(--vt-color-neutral-500,#7C7894)] hover:text-[var(--vt-color-indigo-900,#261A66)] hover:bg-[var(--vt-color-neutral-100,#EFEEF5)] transition-colors cursor-pointer font-bold"
              >
                ✕
              </button>
            </div>

            {/* Viewer Area */}
            <div className="flex-1 p-6 sm:p-7 bg-[var(--vt-color-neutral-50,#F7F7FA)] flex flex-col items-center justify-center">
              {inspectingDoc.fileData ? (
                inspectingDoc.fileType.startsWith("image/") ? (
                  <img
                    src={inspectingDoc.fileData}
                    alt={inspectingDoc.title}
                    className="max-w-full max-h-[48vh] object-contain rounded-lg shadow-sm border border-[var(--vt-color-border-default,#E2E0EC)]"
                  />
                ) : (
                  <iframe
                    src={inspectingDoc.fileData}
                    title={inspectingDoc.title}
                    className="w-full h-[48vh] rounded-lg border border-[var(--vt-color-border-default,#E2E0EC)] bg-white"
                  />
                )
              ) : (
                /* Simplified Document Review Card */
                <div className="w-full bg-white rounded-xl border border-[var(--vt-color-border-default,#E2E0EC)] p-6 shadow-2xs text-center">
                  <div className="w-12 h-12 rounded-xl bg-[var(--vt-color-indigo-50,#F4F3FC)] text-[var(--vt-color-indigo-900,#261A66)] mx-auto flex items-center justify-center mb-3 border border-[var(--vt-color-indigo-100,#EAE8F9)]">
                    <IconDocument className="w-6 h-6" />
                  </div>

                  <h5 className="text-base font-extrabold text-[var(--vt-color-indigo-900,#261A66)]">
                    {inspectingDoc.title}
                  </h5>

                  <p className="font-mono text-xs text-[var(--vt-color-neutral-500,#7C7894)] mt-1">
                    {inspectingDoc.fileName} · {inspectingDoc.fileSize}
                  </p>

                  <div className="my-4 py-3 px-3.5 rounded-lg bg-[var(--vt-color-neutral-50,#F7F7FA)] border border-[var(--vt-color-neutral-200,#E2E0EC)] text-left space-y-1.5 text-xs">
                    <div className="flex justify-between py-0.5 border-b border-[var(--vt-color-neutral-200,#E2E0EC)]">
                      <span className="text-[var(--vt-color-neutral-500,#7C7894)]">Company:</span>
                      <span className="font-bold text-[var(--vt-color-indigo-900,#261A66)] truncate max-w-[200px] text-right">{selectedSub.companyName}</span>
                    </div>
                    <div className="flex justify-between py-0.5 border-b border-[var(--vt-color-neutral-200,#E2E0EC)]">
                      <span className="text-[var(--vt-color-neutral-500,#7C7894)]">RC Number:</span>
                      <span className="font-mono font-bold text-[var(--vt-color-indigo-900,#261A66)]">{selectedSub.rcNumber}</span>
                    </div>
                    <div className="flex justify-between py-0.5">
                      <span className="text-[var(--vt-color-neutral-500,#7C7894)]">Authorized Director:</span>
                      <span className="font-medium text-[var(--vt-color-indigo-900,#261A66)]">{selectedSub.directorName}</span>
                    </div>
                  </div>

                  <p className="text-[11px] text-[var(--vt-color-neutral-400,#A3A0B8)] leading-relaxed">
                    Uploaded file record attached. Live document preview link will connect here once cloud document storage is configured.
                  </p>
                </div>
              )}
            </div>

            {/* Viewer Footer Actions */}
            <div className="px-5 py-3 border-t border-[var(--vt-color-neutral-100,#EFEEF5)] bg-[var(--vt-color-neutral-50,#F7F7FA)] flex items-center justify-end">
              <button
                type="button"
                onClick={() => setInspectingDoc(null)}
                className="h-9 px-4 rounded-md border border-[var(--vt-color-border-default,#E2E0EC)] bg-white text-xs font-bold text-[var(--vt-color-indigo-900,#261A66)] hover:bg-[var(--vt-color-neutral-50,#F7F7FA)] transition-all cursor-pointer"
              >
                Close Viewer
              </button>
            </div>

            {/* Viewer Footer Actions */}
            <div className="px-5 py-3 border-t border-[var(--vt-color-neutral-100,#EFEEF5)] bg-[var(--vt-color-neutral-50,#F7F7FA)] flex items-center justify-between gap-3">
              <button
                type="button"
                onClick={() => setInspectingDoc(null)}
                className="h-9 px-4 rounded-md border border-[var(--vt-color-border-default,#E2E0EC)] bg-white text-xs font-bold text-[var(--vt-color-indigo-900,#261A66)] hover:bg-[var(--vt-color-neutral-50,#F7F7FA)] transition-all cursor-pointer"
              >
                Close Viewer
              </button>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    handleToggleDocVerified(inspectingDoc.id, inspectingDoc.verified);
                    setInspectingDoc((prev) => prev ? { ...prev, verified: !prev.verified } : null);
                  }}
                  className={`h-9 px-4 rounded-md text-xs font-bold transition-all cursor-pointer ${
                    inspectingDoc.verified
                      ? "bg-rose-50 text-rose-700 border border-rose-200 hover:bg-rose-100"
                      : "bg-[var(--vt-color-green-500,#2E9E57)] hover:bg-[var(--vt-color-green-600,#248447)] text-white shadow-2xs"
                  }`}
                >
                  {inspectingDoc.verified ? "Revoke Verification" : "Mark as Verified ✓"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

