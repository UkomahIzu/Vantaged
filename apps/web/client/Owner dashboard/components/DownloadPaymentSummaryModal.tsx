"use client";

import React, { useState, useMemo } from "react";
import { TransactionItem, ProjectFinancialSummary } from "../pages/OwnerTransactionsPage";
import { VantagedSelect } from "./VantagedSelect";
import {
  PaymentSummaryFilterOptions,
  filterTransactions,
  formatNairaAmount,
  downloadCSVFile,
  downloadStatementHTMLFile,
  openPrintStatementWindow,
} from "./paymentSummaryGenerator";

interface DownloadPaymentSummaryModalProps {
  isOpen: boolean;
  onClose: () => void;
  transactions: TransactionItem[];
  projectSummaries: ProjectFinancialSummary[];
}

export function DownloadPaymentSummaryModal({
  isOpen,
  onClose,
  transactions,
  projectSummaries,
}: DownloadPaymentSummaryModalProps) {
  const [selectedProject, setSelectedProject] = useState<string>("all");
  const [timePeriod, setTimePeriod] = useState<PaymentSummaryFilterOptions["timePeriod"]>("all");
  const [customStartDate, setCustomStartDate] = useState<string>("2026-01-01");
  const [customEndDate, setCustomEndDate] = useState<string>("2026-10-24");
  const [selectedType, setSelectedType] = useState<PaymentSummaryFilterOptions["typeFilter"]>("all");
  const [selectedStatus, setSelectedStatus] = useState<PaymentSummaryFilterOptions["statusFilter"]>("all");
  const [format, setFormat] = useState<"pdf" | "csv">("pdf");
  const [isSuccess, setIsSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  // Distinct projects list
  const projectOptions = useMemo(() => {
    const list = [{ value: "all", label: "All Projects (All Payments Ever Made)" }];
    const titles = Array.from(
      new Set([
        ...projectSummaries.map((p) => p.title),
        ...transactions.map((t) => t.projectTitle),
      ])
    );
    titles.forEach((t) => {
      list.push({ value: t, label: t });
    });
    return list;
  }, [projectSummaries, transactions]);

  // Current filter options
  const filterOptions: PaymentSummaryFilterOptions = useMemo(
    () => ({
      projectFilter: selectedProject,
      timePeriod,
      customStartDate,
      customEndDate,
      typeFilter: selectedType,
      statusFilter: selectedStatus,
      format,
    }),
    [selectedProject, timePeriod, customStartDate, customEndDate, selectedType, selectedStatus, format]
  );

  // Filtered matching transactions
  const filteredList = useMemo(() => {
    return filterTransactions(transactions, filterOptions);
  }, [transactions, filterOptions]);

  const totalAmount = useMemo(() => {
    return filteredList.reduce((acc, t) => acc + t.amount, 0);
  }, [filteredList]);

  if (!isOpen) return null;

  const handleDownload = () => {
    if (format === "csv") {
      downloadCSVFile(filteredList, filterOptions);
      setSuccessMessage("Excel / CSV Payment Ledger downloaded successfully!");
    } else {
      // Download official statement file and open the print-to-PDF statement window
      downloadStatementHTMLFile(filteredList, filterOptions);
      openPrintStatementWindow(filteredList, filterOptions);
      setSuccessMessage("Official Payment Summary Statement generated! Print/Save as PDF opened.");
    }

    setIsSuccess(true);
    setTimeout(() => {
      setIsSuccess(false);
      onClose();
    }, 2500);
  };

  return (
    <div
      style={{ fontFamily: "'Outfit', var(--vt-font-sans), sans-serif" }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[var(--vt-color-indigo-950,#140B3B)]/60 backdrop-blur-xs animate-in fade-in duration-200"
    >
      <div
        className="w-full max-w-lg bg-white rounded-2xl border border-[var(--vt-color-border-default,#E2E0EC)] shadow-2xl overflow-hidden flex flex-col max-h-[92vh] animate-in zoom-in-95 duration-200"
      >
        {/* Modal Header */}
        <div className="p-5 sm:p-6 bg-white border-b border-[var(--vt-color-border-default,#E2E0EC)] flex items-start justify-between gap-4">
          <div>
            <h2 className="text-lg font-black text-[var(--vt-color-indigo-900,#261A66)] tracking-tight">
              Download Payment Summary
            </h2>
            <p className="text-xs text-[var(--vt-color-neutral-500,#7C7894)] mt-0.5">
              Choose your filter options to download your payment records.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-lg hover:bg-[var(--vt-color-neutral-100,#EFEEF5)] flex items-center justify-center text-[var(--vt-color-neutral-400,#A3A0B8)] hover:text-[var(--vt-color-indigo-900,#261A66)] transition-colors cursor-pointer shrink-0"
          >
            ✕
          </button>
        </div>

        {/* Modal Body / Filters Form */}
        <div className="p-5 sm:p-6 overflow-y-auto flex flex-col gap-4 text-xs">
          {/* Success Banner */}
          {isSuccess && (
            <div className="p-3.5 rounded-xl bg-[var(--vt-color-green-50,#E9F6EC)] border border-[var(--vt-color-green-200,#A3D9B1)] text-[var(--vt-color-green-900,#0F331E)] font-bold flex items-center gap-2 animate-in fade-in duration-150">
              <svg className="w-4 h-4 text-[var(--vt-color-green-600,#248246)] shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <polyline points="20 6 9 17 4 12" />
              </svg>
              <span>{successMessage}</span>
            </div>
          )}

          {/* 1. Project Filter (Includes "All Projects / All Payments Ever Made") */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[11px] font-extrabold uppercase tracking-wider text-[var(--vt-color-neutral-500,#7C7894)]">
              Building Project
            </label>
            <VantagedSelect
              value={selectedProject}
              onChange={(val) => setSelectedProject(val)}
              options={projectOptions}
            />
          </div>

          {/* 2. Time Period Filter */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] font-extrabold uppercase tracking-wider text-[var(--vt-color-neutral-500,#7C7894)]">
                Time Period
              </label>
              <VantagedSelect
                value={timePeriod}
                onChange={(val) => setTimePeriod(val as any)}
                options={[
                  { value: "all", label: "All Time (Complete Record)" },
                  { value: "this-month", label: "This Month (Oct 2026)" },
                  { value: "30-days", label: "Last 30 Days" },
                  { value: "90-days", label: "Last 90 Days (Q3 - Q4)" },
                  { value: "ytd", label: "Year to Date (2026)" },
                  { value: "2025", label: "Calendar Year 2025" },
                  { value: "custom", label: "Custom Date Range" },
                ]}
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] font-extrabold uppercase tracking-wider text-[var(--vt-color-neutral-500,#7C7894)]">
                Payment Type
              </label>
              <VantagedSelect
                value={selectedType}
                onChange={(val) => setSelectedType(val as any)}
                options={[
                  { value: "all", label: "All Payment Types" },
                  { value: "Work Payment", label: "Work Payment (Milestones)" },
                  { value: "Deposited on Vantaged", label: "Deposited on Vantaged" },
                  { value: "Extra Work Added", label: "Extra Work Added" },
                  { value: "Final Holdback Released", label: "Final 5% Holdback" },
                ]}
              />
            </div>
          </div>

          {/* Custom Date Pickers (if chosen) */}
          {timePeriod === "custom" && (
            <div className="grid grid-cols-2 gap-3 p-3 rounded-xl bg-[var(--vt-color-neutral-50,#F7F7FA)] border border-[var(--vt-color-border-default,#E2E0EC)] animate-in fade-in duration-150">
              <div>
                <label className="text-[10px] font-bold text-[var(--vt-color-neutral-400,#A3A0B8)] uppercase block mb-1">
                  Start Date
                </label>
                <input
                  type="date"
                  value={customStartDate}
                  onChange={(e) => setCustomStartDate(e.target.value)}
                  className="w-full h-8 px-2.5 rounded-lg bg-white border border-[var(--vt-color-border-default,#E2E0EC)] text-xs font-semibold text-[var(--vt-color-indigo-900,#261A66)]"
                />
              </div>
              <div>
                <label className="text-[10px] font-bold text-[var(--vt-color-neutral-400,#A3A0B8)] uppercase block mb-1">
                  End Date
                </label>
                <input
                  type="date"
                  value={customEndDate}
                  onChange={(e) => setCustomEndDate(e.target.value)}
                  className="w-full h-8 px-2.5 rounded-lg bg-white border border-[var(--vt-color-border-default,#E2E0EC)] text-xs font-semibold text-[var(--vt-color-indigo-900,#261A66)]"
                />
              </div>
            </div>
          )}

          {/* 3. Export Format Selector */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[11px] font-extrabold uppercase tracking-wider text-[var(--vt-color-neutral-500,#7C7894)]">
              File Format
            </label>
            <div className="grid grid-cols-2 gap-2.5">
              <button
                type="button"
                onClick={() => setFormat("pdf")}
                className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex items-center justify-between ${
                  format === "pdf"
                    ? "border-[var(--vt-color-orange-500,#EF5F18)] bg-[var(--vt-color-orange-50,#FFF4EE)] ring-2 ring-[var(--vt-color-orange-500,#EF5F18)]/15"
                    : "border-[var(--vt-color-border-default,#E2E0EC)] bg-white hover:bg-[var(--vt-color-neutral-50,#F7F7FA)]"
                }`}
              >
                <div className="font-bold text-xs text-[var(--vt-color-indigo-900,#261A66)] flex items-center gap-2">
                  <svg className="w-4 h-4 text-[var(--vt-color-orange-600,#EF5F18)] shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                    <polyline points="14 2 14 8 20 8" />
                  </svg>
                  <span>PDF Statement</span>
                </div>
                <div
                  className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 ${
                    format === "pdf"
                      ? "border-[var(--vt-color-orange-500,#EF5F18)] bg-[var(--vt-color-orange-500,#EF5F18)] text-white"
                      : "border-[var(--vt-color-neutral-300,#CBC8DA)]"
                  }`}
                >
                  {format === "pdf" && <span className="w-1.5 h-1.5 rounded-full bg-white" />}
                </div>
              </button>

              <button
                type="button"
                onClick={() => setFormat("csv")}
                className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex items-center justify-between ${
                  format === "csv"
                    ? "border-[var(--vt-color-orange-500,#EF5F18)] bg-[var(--vt-color-orange-50,#FFF4EE)] ring-2 ring-[var(--vt-color-orange-500,#EF5F18)]/15"
                    : "border-[var(--vt-color-border-default,#E2E0EC)] bg-white hover:bg-[var(--vt-color-neutral-50,#F7F7FA)]"
                }`}
              >
                <div className="font-bold text-xs text-[var(--vt-color-indigo-900,#261A66)] flex items-center gap-2">
                  <svg className="w-4 h-4 text-[var(--vt-color-green-600,#248246)] shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                    <polyline points="14 2 14 8 20 8" />
                    <line x1="8" y1="13" x2="16" y2="13" />
                    <line x1="8" y1="17" x2="16" y2="17" />
                  </svg>
                  <span>Excel / CSV</span>
                </div>
                <div
                  className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 ${
                    format === "csv"
                      ? "border-[var(--vt-color-orange-500,#EF5F18)] bg-[var(--vt-color-orange-50,#FFF4EE)] text-white"
                      : "border-[var(--vt-color-neutral-300,#CBC8DA)]"
                  }`}
                >
                  {format === "csv" && <span className="w-1.5 h-1.5 rounded-full bg-white" />}
                </div>
              </button>
            </div>
          </div>

          {/* 4. Live Summary */}
          <div className="px-4 py-3 rounded-xl bg-[var(--vt-color-neutral-50,#F7F7FA)] border border-[var(--vt-color-border-default,#E2E0EC)] flex items-center justify-between text-xs">
            <span className="text-[var(--vt-color-neutral-600,#5E5A7D)]">
              Selected: <strong className="text-[var(--vt-color-indigo-900,#261A66)]">{filteredList.length}</strong> of {transactions.length} payments
            </span>
            <span className="font-black text-sm text-[var(--vt-color-indigo-900,#261A66)]">
              {formatNairaAmount(totalAmount)}
            </span>
          </div>
        </div>

        {/* Modal Footer / Actions */}
        <div className="p-4 sm:p-5 bg-[var(--vt-color-neutral-50,#F7F7FA)]/80 border-t border-[var(--vt-color-border-default,#E2E0EC)] flex items-center justify-end gap-3 shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="h-9 px-4 rounded-lg bg-white hover:bg-[var(--vt-color-neutral-100,#EFEEF5)] border border-[var(--vt-color-border-default,#E2E0EC)] text-xs font-bold text-[var(--vt-color-neutral-600,#5E5A7D)] transition-colors cursor-pointer"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={handleDownload}
            className="h-9 px-4 rounded-lg bg-[var(--vt-color-orange-500,#EF5F18)] hover:bg-[var(--vt-color-orange-600,#D84C0B)] text-white text-xs font-extrabold transition-all shadow-xs cursor-pointer flex items-center gap-2 active:scale-98"
          >
            <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="7 10 12 15 17 10" />
              <line x1="12" y1="15" x2="12" y2="3" />
            </svg>
            <span>Download {format === "pdf" ? "PDF" : "CSV"}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
