"use client";

import { TransactionItem } from "../pages/OwnerTransactionsPage";

export interface PaymentSummaryFilterOptions {
  projectFilter: string; // "all" or specific projectTitle
  timePeriod: "all" | "this-month" | "30-days" | "90-days" | "ytd" | "2025" | "custom";
  customStartDate?: string;
  customEndDate?: string;
  typeFilter: "all" | "Work Payment" | "Deposited on Vantaged" | "Extra Work Added" | "Final Holdback Released";
  statusFilter: "all" | "Received by Builder" | "Sent – Builder to Confirm" | "Deposited on Vantaged";
  format: "pdf" | "csv";
}

export function filterTransactions(
  transactions: TransactionItem[],
  options: PaymentSummaryFilterOptions
): TransactionItem[] {
  return transactions.filter((t) => {
    // 1. Project filter
    if (options.projectFilter !== "all" && t.projectTitle !== options.projectFilter) {
      return false;
    }

    // 2. Type filter
    if (options.typeFilter !== "all" && t.type !== options.typeFilter) {
      return false;
    }

    // 3. Status filter
    if (options.statusFilter !== "all" && t.status !== options.statusFilter) {
      return false;
    }

    // 4. Time period filter
    if (options.timePeriod !== "all") {
      const txDate = new Date(t.rawDate || Date.now());
      const now = new Date("2026-10-24T12:00:00Z");

      if (options.timePeriod === "this-month") {
        if (txDate.getMonth() !== now.getMonth() || txDate.getFullYear() !== now.getFullYear()) {
          return false;
        }
      } else if (options.timePeriod === "30-days") {
        const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        if (txDate < thirtyDaysAgo || txDate > now) return false;
      } else if (options.timePeriod === "90-days") {
        const ninetyDaysAgo = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
        if (txDate < ninetyDaysAgo || txDate > now) return false;
      } else if (options.timePeriod === "ytd") {
        if (txDate.getFullYear() !== 2026) return false;
      } else if (options.timePeriod === "2025") {
        if (txDate.getFullYear() !== 2025) return false;
      } else if (options.timePeriod === "custom") {
        if (options.customStartDate) {
          const start = new Date(options.customStartDate);
          if (txDate < start) return false;
        }
        if (options.customEndDate) {
          const end = new Date(options.customEndDate);
          end.setHours(23, 59, 59, 999);
          if (txDate > end) return false;
        }
      }
    }

    return true;
  });
}

export function formatNairaAmount(val: number): string {
  return `₦${val.toLocaleString("en-NG", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

export function generateCSVContent(
  transactions: TransactionItem[],
  options: PaymentSummaryFilterOptions
): string {
  const headers = [
    "Reference",
    "Date & Time",
    "Bank Session ID (NIBSS)",
    "Building Project",
    "Milestone Stage",
    "Recipient / Contractor",
    "Payment Type",
    "Payment Method",
    "Approval Sign-Off",
    "Status",
    "Amount (NGN)",
  ];

  const escapeCsv = (str: string | number | undefined) => {
    if (str === undefined || str === null) return '""';
    const s = String(str).replace(/"/g, '""');
    return `"${s}"`;
  };

  const rows = transactions.map((t) => [
    escapeCsv(t.reference),
    escapeCsv(t.date),
    escapeCsv(t.bankSessionId),
    escapeCsv(t.projectTitle),
    escapeCsv(t.stageTitle),
    escapeCsv(t.contractorName),
    escapeCsv(t.type),
    escapeCsv(t.paymentMethod),
    escapeCsv(t.verifiedBy ? `${t.verifiedBy} (${t.verifiedRole || "Inspector"})` : "Owner Approved"),
    escapeCsv(t.status),
    escapeCsv(t.amount),
  ]);

  const totalAmount = transactions.reduce((acc, t) => acc + t.amount, 0);
  const totalRow = [
    '"TOTAL"',
    '""',
    '""',
    `"Filtered: ${options.projectFilter === "all" ? "All Projects" : options.projectFilter}"`,
    `"Period: ${options.timePeriod}"`,
    '""',
    '""',
    '""',
    `"Transactions: ${transactions.length}"`,
    '"AUDITED"',
    escapeCsv(totalAmount),
  ];

  return "\uFEFF" + [headers.join(","), ...rows.map((r) => r.join(",")), totalRow.join(",")].join("\r\n");
}

export function downloadCSVFile(
  transactions: TransactionItem[],
  options: PaymentSummaryFilterOptions
): void {
  const csvData = generateCSVContent(transactions, options);
  const blob = new Blob([csvData], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const safeProjectName =
    options.projectFilter === "all" ? "All_Projects" : options.projectFilter.replace(/[^a-zA-Z0-9]/g, "_");
  const fileName = `Vantaged_Payment_Summary_${safeProjectName}_${new Date().toISOString().slice(0, 10)}.csv`;

  const link = document.createElement("a");
  link.setAttribute("href", url);
  link.setAttribute("download", fileName);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export function generateStatementHTML(
  transactions: TransactionItem[],
  options: PaymentSummaryFilterOptions,
  forPrintWindow = false
): string {
  const totalAmount = transactions.reduce((acc, t) => acc + t.amount, 0);
  const paidToBuilder = transactions
    .filter((t) => t.status === "Received by Builder" || t.status === "Sent – Builder to Confirm")
    .reduce((acc, t) => acc + t.amount, 0);
  const heldInEscrow = transactions
    .filter((t) => t.status === "Deposited on Vantaged")
    .reduce((acc, t) => acc + t.amount, 0);
  const retainageTotal = Math.round(totalAmount * 0.05);

  const scopeLabel =
    options.projectFilter === "all"
      ? "All Construction Sites (Complete Portfolio)"
      : options.projectFilter;

  const periodLabel =
    options.timePeriod === "all"
      ? "All Historical Payments (Complete Ledger)"
      : options.timePeriod === "this-month"
      ? "October 2026 (Current Month)"
      : options.timePeriod === "30-days"
      ? "Last 30 Days"
      : options.timePeriod === "90-days"
      ? "Last 90 Days (Q3 - Q4 2026)"
      : options.timePeriod === "ytd"
      ? "Year to Date (Calendar Year 2026)"
      : options.timePeriod === "2025"
      ? "Calendar Year 2025"
      : `Custom Range (${options.customStartDate || "Start"} to ${options.customEndDate || "Present"})`;

  const generatedDate = "24 October 2026, 12:00 PM WAT";
  const statementRef = `VT-STM-${Math.floor(100000 + Math.random() * 900000)}`;
  const checksum = `SHA256-${Array.from({ length: 16 }, () => Math.floor(Math.random() * 16).toString(16)).join("")}`;

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Vantaged Payment Summary Statement - ${statementRef}</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800;900&display=swap" rel="stylesheet">
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: 'Outfit', sans-serif;
      color: #261A66;
      background: #F7F7FA;
      padding: 30px;
      -webkit-font-smoothing: antialiased;
    }
    .sheet {
      max-width: 960px;
      margin: 0 auto;
      background: #FFFFFF;
      border: 1px solid #E2E0EC;
      border-radius: 20px;
      padding: 40px;
      box-shadow: 0 16px 40px rgba(38, 26, 102, 0.08);
      position: relative;
      overflow: hidden;
    }
    .top-bar-stripe {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 6px;
      background: linear-gradient(90deg, #EF5F18 0%, #F78241 50%, #261A66 100%);
    }
    .header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      padding-bottom: 24px;
      border-bottom: 1px solid #E2E0EC;
      margin-bottom: 24px;
    }
    .brand-title {
      font-size: 24px;
      font-weight: 900;
      letter-spacing: -0.5px;
      color: #261A66;
      display: flex;
      align-items: center;
      gap: 10px;
    }
    .brand-pill {
      background: #FFF4EE;
      color: #EF5F18;
      border: 1px solid #FDCAA9;
      padding: 3px 10px;
      border-radius: 999px;
      font-size: 11px;
      font-weight: 800;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    .header-sub {
      font-size: 12px;
      color: #6C6882;
      margin-top: 4px;
      max-width: 480px;
      line-height: 1.5;
    }
    .statement-meta-box {
      text-align: right;
    }
    .statement-code {
      font-size: 14px;
      font-weight: 800;
      color: #261A66;
      font-family: monospace;
    }
    .meta-line {
      font-size: 11px;
      color: #7C7894;
      margin-top: 3px;
    }
    .info-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 16px;
      margin-bottom: 24px;
      background: #F7F7FA;
      border: 1px solid #E2E0EC;
      border-radius: 14px;
      padding: 18px 22px;
    }
    .info-item {
      display: flex;
      flex-direction: column;
    }
    .info-label {
      font-size: 10.5px;
      font-weight: 800;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      color: #A3A0B8;
      margin-bottom: 3px;
    }
    .info-val {
      font-size: 13px;
      font-weight: 700;
      color: #261A66;
    }
    .kpi-row {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 12px;
      margin-bottom: 28px;
    }
    .kpi-card {
      border: 1px solid #E2E0EC;
      border-radius: 12px;
      padding: 14px;
      background: #FFFFFF;
    }
    .kpi-card.highlight {
      border-color: #FDCAA9;
      background: #FFF4EE;
    }
    .kpi-title {
      font-size: 10px;
      font-weight: 800;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      color: #7C7894;
      margin-bottom: 4px;
    }
    .kpi-card.highlight .kpi-title {
      color: #B33C08;
    }
    .kpi-val {
      font-size: 17px;
      font-weight: 900;
      color: #261A66;
      letter-spacing: -0.3px;
    }
    .kpi-card.highlight .kpi-val {
      color: #D84C0B;
    }
    .table-container {
      margin-bottom: 28px;
    }
    .section-heading {
      font-size: 13px;
      font-weight: 800;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      color: #261A66;
      margin-bottom: 10px;
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
    table {
      width: 100%;
      border-collapse: separate;
      border-spacing: 0;
      border: 1px solid #E2E0EC;
      border-radius: 12px;
      overflow: hidden;
      font-size: 11.5px;
    }
    th {
      background: #F7F7FA;
      color: #5E5A7D;
      font-weight: 800;
      text-transform: uppercase;
      font-size: 10px;
      letter-spacing: 0.5px;
      padding: 11px 14px;
      text-align: left;
      border-bottom: 1px solid #E2E0EC;
    }
    th.text-right, td.text-right {
      text-align: right;
    }
    td {
      padding: 12px 14px;
      border-bottom: 1px solid #F0EEF7;
      color: #261A66;
      vertical-align: middle;
    }
    tr:last-child td {
      border-bottom: none;
    }
    tr:nth-child(even) td {
      background: #FAFAFD;
    }
    .badge {
      display: inline-block;
      padding: 2.5px 8px;
      border-radius: 999px;
      font-size: 9.5px;
      font-weight: 800;
      text-transform: uppercase;
      letter-spacing: 0.3px;
    }
    .badge-success {
      background: #E9F6EC;
      color: #1F6B3E;
      border: 1px solid #A3D9B1;
    }
    .badge-pending {
      background: #FFF4EE;
      color: #B33C08;
      border: 1px solid #FDCAA9;
    }
    .badge-escrow {
      background: #F0EEF7;
      color: #4C3C99;
      border: 1px solid #DBD7E7;
    }
    .t-foot-row {
      background: #F7F7FA !important;
      font-weight: 800;
      font-size: 12.5px;
    }
    .t-foot-row td {
      border-top: 2px solid #E2E0EC;
      padding: 14px;
    }
    .footer-guarantee {
      background: #F7F7FA;
      border: 1px solid #E2E0EC;
      border-radius: 14px;
      padding: 18px 22px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 16px;
      margin-bottom: 24px;
    }
    .trustee-info {
      font-size: 11px;
      color: #5E5A7D;
      line-height: 1.5;
    }
    .trustee-bold {
      font-weight: 800;
      color: #261A66;
    }
    .seal-box {
      border: 2px dashed #EF5F18;
      border-radius: 8px;
      padding: 8px 14px;
      text-align: center;
      color: #EF5F18;
      font-weight: 900;
      font-size: 10px;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      white-space: nowrap;
    }
    .legal-notice {
      font-size: 10px;
      color: #A3A0B8;
      text-align: center;
      line-height: 1.5;
      padding-top: 10px;
    }
    .print-button-bar {
      margin-bottom: 20px;
      display: flex;
      justify-content: flex-end;
      gap: 10px;
    }
    .btn-action {
      background: #EF5F18;
      color: #FFFFFF;
      font-family: inherit;
      font-size: 12px;
      font-weight: 800;
      padding: 10px 18px;
      border-radius: 8px;
      border: none;
      cursor: pointer;
      display: inline-flex;
      align-items: center;
      gap: 6px;
      box-shadow: 0 4px 12px rgba(239, 95, 24, 0.25);
    }
    .btn-secondary {
      background: #FFFFFF;
      color: #261A66;
      border: 1px solid #E2E0EC;
      box-shadow: 0 2px 6px rgba(0,0,0,0.04);
    }
    @media print {
      body { background: #FFFFFF; padding: 0; }
      .sheet { border: none; box-shadow: none; padding: 10px; }
      .print-button-bar { display: none !important; }
      @page {
        size: A4 portrait;
        margin: 10mm;
      }
    }
  </style>
</head>
<body>
  <div class="sheet">
    <div class="top-bar-stripe"></div>

    ${
      forPrintWindow
        ? `<div class="print-button-bar">
        <button class="btn-action btn-secondary" onclick="window.close()">Close Preview</button>
        <button class="btn-action" onclick="window.print()">Print / Save as PDF</button>
      </div>`
        : ""
    }

    <!-- Header -->
    <div class="header">
      <div>
        <div class="brand-title">
          <span>VANTAGED</span>
        </div>
        <p class="header-sub">
          Payment Summary & Milestone Settlement Ledger
        </p>
      </div>
      <div class="statement-meta-box">
        <div class="statement-code">${statementRef}</div>
        <div class="meta-line">Generated: <strong>${generatedDate}</strong></div>
      </div>
    </div>

    <!-- Client & Scope Meta Box -->
    <div class="info-grid">
      <div class="info-item">
        <span class="info-label">Account Holder / Owner</span>
        <span class="info-val">Dr. James Arinze</span>
      </div>
      <div class="info-item">
        <span class="info-label">Corporate Entity</span>
        <span class="info-val">Robinson Prime Holdings Ltd (RC-1849204)</span>
      </div>
      <div class="info-item">
        <span class="info-label">Project Scope Filter</span>
        <span class="info-val">${scopeLabel}</span>
      </div>
      <div class="info-item">
        <span class="info-label">Time Period Filter</span>
        <span class="info-val">${periodLabel}</span>
      </div>
    </div>

    <!-- KPI Summary Row -->
    <div class="kpi-row">
      <div class="kpi-card highlight">
        <div class="kpi-title">Total Disbursed to Builders</div>
        <div class="kpi-val">${formatNairaAmount(paidToBuilder)}</div>
      </div>
      <div class="kpi-card">
        <div class="kpi-title">Vault Balance in Escrow</div>
        <div class="kpi-val">${formatNairaAmount(heldInEscrow)}</div>
      </div>
      <div class="kpi-card">
        <div class="kpi-title">Post-Handover Retention</div>
        <div class="kpi-val">${formatNairaAmount(retainageTotal)}</div>
      </div>
      <div class="kpi-card">
        <div class="kpi-title">Transactions Included</div>
        <div class="kpi-val">${transactions.length} Payment${transactions.length === 1 ? "" : "s"}</div>
      </div>
    </div>

    <!-- Itemized Ledger Table -->
    <div class="table-container">
      <div class="section-heading">
        <span>Itemized Settlement Ledger</span>
        <span style="font-size:11px;color:#7C7894;font-weight:600;">Currency: NGN (₦)</span>
      </div>
      <table>
        <thead>
          <tr>
            <th>Date</th>
            <th>Reference & NIBSS ID</th>
            <th>Building & Milestone</th>
            <th>Recipient / Contractor</th>
            <th>Approval Authority</th>
            <th>Status</th>
            <th class="text-right">Amount</th>
          </tr>
        </thead>
        <tbody>
          ${
            transactions.length === 0
              ? `<tr><td colspan="7" style="text-align:center;padding:30px;color:#A3A0B8;">No transactions found matching the selected filter criteria.</td></tr>`
              : transactions
                  .map((t) => {
                    const badgeClass =
                      t.status === "Received by Builder"
                        ? "badge-success"
                        : t.status === "Sent – Builder to Confirm"
                        ? "badge-pending"
                        : "badge-escrow";
                    return `<tr>
                      <td style="white-space:nowrap;font-weight:600;">${t.date}</td>
                      <td>
                        <div style="font-weight:700;font-family:monospace;font-size:11px;">${t.reference}</div>
                        <div style="font-size:9.5px;color:#7C7894;font-family:monospace;">${t.bankSessionId}</div>
                      </td>
                      <td>
                        <div style="font-weight:700;">${t.projectTitle}</div>
                        <div style="font-size:10.5px;color:#6C6882;">${t.stageTitle}</div>
                      </td>
                      <td style="font-weight:600;">${t.contractorName}</td>
                      <td>
                        <div style="font-weight:600;">${t.verifiedBy || "Dr. James Arinze"}</div>
                        <div style="font-size:10px;color:#7C7894;">${t.verifiedRole || "Building Owner"}</div>
                      </td>
                      <td><span class="badge ${badgeClass}">${t.status}</span></td>
                      <td class="text-right" style="font-weight:800;font-family:monospace;font-size:12px;">${formatNairaAmount(t.amount)}</td>
                    </tr>`;
                  })
                  .join("")
          }
        </tbody>
        <tfoot>
          <tr class="t-foot-row">
            <td colspan="6">TOTAL SETTLEMENT VALUE</td>
            <td class="text-right">${formatNairaAmount(totalAmount)}</td>
          </tr>
        </tfoot>
      </table>
    </div>

    <!-- Guarantee & Trustee Seal Box -->
    <div class="footer-guarantee">
      <div class="trustee-info">
        <span class="trustee-bold">Escrow Verification:</span><br>
        All funds recorded herein were held under secure bank custody and released upon client milestone approval and verification.
      </div>
      <div class="seal-box">
        VANTAGED<br>
        <span style="font-size:8px;letter-spacing:1px;font-weight:600;">VERIFIED RECORD</span>
      </div>
    </div>

    <!-- Legal disclaimer -->
    <div class="legal-notice">
      Official payment summary generated from Vantaged • Statement Ref: <strong>${statementRef}</strong>
    </div>
  </div>

  ${
    forPrintWindow
      ? `<script>
      window.onload = function() {
        setTimeout(function() {
          window.print();
        }, 400);
      };
    </script>`
      : ""
  }
</body>
</html>`;
}

export function downloadStatementHTMLFile(
  transactions: TransactionItem[],
  options: PaymentSummaryFilterOptions
): void {
  const htmlContent = generateStatementHTML(transactions, options, false);
  const blob = new Blob([htmlContent], { type: "text/html;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const safeProjectName =
    options.projectFilter === "all" ? "All_Projects" : options.projectFilter.replace(/[^a-zA-Z0-9]/g, "_");
  const fileName = `Vantaged_Payment_Summary_${safeProjectName}_${new Date().toISOString().slice(0, 10)}.html`;

  const link = document.createElement("a");
  link.setAttribute("href", url);
  link.setAttribute("download", fileName);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export function openPrintStatementWindow(
  transactions: TransactionItem[],
  options: PaymentSummaryFilterOptions
): void {
  const htmlContent = generateStatementHTML(transactions, options, true);
  const printWindow = window.open("", "_blank", "width=1000,height=800");
  if (printWindow) {
    printWindow.document.open();
    printWindow.document.write(htmlContent);
    printWindow.document.close();
  }
}
