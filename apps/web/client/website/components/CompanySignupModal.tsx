"use client";

import React, { useState, useEffect } from "react";

export interface CompanySignupModalProps {
  isOpen?: boolean;
  onClose?: () => void;
  initialPlan?: "starter" | "verified" | "prime";
}

export interface UploadedDocumentMeta {
  fileName: string;
  fileSize: string;
  fileType: string;
  fileData?: string;
}

interface FormData {
  // Step 1: Corporate Profile
  companyName: string;
  rcNumber: string;
  tin: string;
  category: string;
  email: string;
  phone: string;
  officeAddress: string;
  state: string;

  // Step 2: Director Identity
  directorName: string;
  directorRole: string;
  directorEmail: string;
  directorPhone: string;
  idType: "NIN" | "PASSPORT";
  idNumber: string;

  // Step 3: Bank Account
  bankName: string;
  accountNumber: string;
  accountName: string;

  // Step 4: Compliance Documents
  cacDoc: UploadedDocumentMeta | null;
  tinDoc: UploadedDocumentMeta | null;
  directorIdDoc: UploadedDocumentMeta | null;
  corenDoc: UploadedDocumentMeta | null;

  // Step 5: Accreditations & Plan
  corenNumber: string;
  bppCategory: string;
  selectedPlan: "starter" | "verified" | "prime";
  yearsInBusiness: string;
}

const NIGERIAN_BANKS = [
  "Zenith Bank",
  "Access Bank",
  "Guaranty Trust Bank (GTBank)",
  "First Bank of Nigeria",
  "United Bank for Africa (UBA)",
  "Stanbic IBTC Bank",
  "Fidelity Bank",
  "Sterling Bank",
  "Union Bank",
  "FCMB",
  "Wema Bank",
  "Ecobank Nigeria",
];

const CONTRACTOR_CATEGORIES = [
  "General Building & Construction",
  "Civil Engineering & Infrastructure",
  "Mechanical, Electrical & Plumbing (MEP)",
  "High-End Luxury Residential",
  "Commercial & Estate Development",
];

/**
 * Global helper to open the Contractor Sign Up Modal from anywhere on the current page
 * without navigating away or redirecting to the owner signup page.
 */
export function openCompanySignupModal(plan: "starter" | "verified" | "prime" = "starter") {
  if (typeof window !== "undefined") {
    window.dispatchEvent(
      new CustomEvent("vantaged:open-company-signup", {
        detail: { plan },
      })
    );
  }
}

export function CompanySignupModal({
  isOpen: controlledIsOpen,
  onClose: controlledOnClose,
  initialPlan = "starter",
}: CompanySignupModalProps) {
  const [internalIsOpen, setInternalIsOpen] = useState(false);
  const [step, setStep] = useState<1 | 2 | 3 | 4 | 5>(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [submissionSuccess, setSubmissionSuccess] = useState<any | null>(null);

  // Pre-filled with realistic development test data for quick step testing
  const [formData, setFormData] = useState<FormData>({
    companyName: "Crane & Stone Engineering Limited",
    rcNumber: "RC-1849202",
    tin: "24910294-0001",
    category: CONTRACTOR_CATEGORIES[0],
    email: "info@craneandstone.com",
    phone: "+234 803 123 4567",
    officeAddress: "Plot 14, Commercial Avenue, Victoria Island",
    state: "Lagos",
    directorName: "Engr. Babatunde Julius Adeleke",
    directorRole: "Managing Director",
    directorEmail: "b.adeleke@craneandstone.com",
    directorPhone: "+234 802 319 8421",
    idType: "NIN",
    idNumber: "19283746501",
    bankName: NIGERIAN_BANKS[0],
    accountNumber: "1012345678",
    accountName: "Crane & Stone Engineering Limited",
    cacDoc: {
      fileName: "Crane_Stone_CAC_RC1849202.pdf",
      fileSize: "1.4 MB",
      fileType: "application/pdf",
    },
    tinDoc: {
      fileName: "FIRS_TaxClearance_24910294.pdf",
      fileSize: "840 KB",
      fileType: "application/pdf",
    },
    directorIdDoc: {
      fileName: "Babatunde_Adeleke_NIN_Slip.pdf",
      fileSize: "620 KB",
      fileType: "application/pdf",
    },
    corenDoc: {
      fileName: "COREN_R49201_License_2026.pdf",
      fileSize: "1.1 MB",
      fileType: "application/pdf",
    },
    corenNumber: "COREN/R/49201",
    bppCategory: "Category B - Federal Works",
    selectedPlan: initialPlan,
    yearsInBusiness: "6–10 years",
  });

  // Listen to global open event only if uncontrolled (global host)
  useEffect(() => {
    if (controlledIsOpen !== undefined) return;

    function handleGlobalOpen(e: Event) {
      const customEvent = e as CustomEvent<{ plan?: "starter" | "verified" | "prime" }>;
      if (customEvent.detail?.plan) {
        setFormData((prev) => ({ ...prev, selectedPlan: customEvent.detail.plan! }));
      }
      setInternalIsOpen(true);
      setErrorMsg(null);
    }

    if (typeof window !== "undefined") {
      window.addEventListener("vantaged:open-company-signup", handleGlobalOpen);

      // Check URL params on initial load
      const params = new URLSearchParams(window.location.search);
      const role = params.get("role");
      const signup = params.get("signup");
      if (role === "contractor" && (signup === "true" || signup === "company" || !signup)) {
        const plan = params.get("plan");
        if (plan === "verified" || plan === "prime" || plan === "starter") {
          setFormData((prev) => ({ ...prev, selectedPlan: plan }));
        }
        setInternalIsOpen(true);
      }
    }

    return () => {
      if (typeof window !== "undefined") {
        window.removeEventListener("vantaged:open-company-signup", handleGlobalOpen);
      }
    };
  }, []);

  const isOpen = controlledIsOpen !== undefined ? controlledIsOpen : internalIsOpen;

  const handleClose = () => {
    if (controlledOnClose) {
      controlledOnClose();
    } else {
      setInternalIsOpen(false);
    }
  };

  if (!isOpen) return null;

  const handleChange = (field: keyof FormData, value: string) => {
    setFormData((prev) => {
      const updated = { ...prev, [field]: value };
      if (field === "companyName" && !prev.accountName) {
        updated.accountName = value;
      }
      return updated;
    });
    setErrorMsg(null);
  };

  const handleFileUpload = (
    field: "cacDoc" | "tinDoc" | "directorIdDoc" | "corenDoc",
    file: File
  ) => {
    if (file.size > 10 * 1024 * 1024) {
      setErrorMsg("File size exceeds 10MB limit. Please upload a smaller document.");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const formattedSize =
        file.size > 1024 * 1024
          ? `${(file.size / (1024 * 1024)).toFixed(1)} MB`
          : `${Math.round(file.size / 1024)} KB`;

      setFormData((prev) => ({
        ...prev,
        [field]: {
          fileName: file.name,
          fileSize: formattedSize,
          fileType: file.type || "application/pdf",
          fileData: reader.result as string,
        },
      }));
    };
    reader.readAsDataURL(file);
    setErrorMsg(null);
  };

  const handleRemoveDoc = (field: "cacDoc" | "tinDoc" | "directorIdDoc" | "corenDoc") => {
    setFormData((prev) => ({
      ...prev,
      [field]: null,
    }));
  };

  const validateStep = (currentStep: number): boolean => {
    if (currentStep === 1) {
      if (!formData.companyName.trim()) {
        setErrorMsg("Company Legal Name is required");
        return false;
      }
      if (!formData.rcNumber.trim()) {
        setErrorMsg("RC / Business Registration Number is required (e.g., RC-1849202)");
        return false;
      }
      if (!formData.tin.trim()) {
        setErrorMsg("Tax Identification Number (TIN) is required");
        return false;
      }
      if (!formData.email.trim() || !formData.email.includes("@")) {
        setErrorMsg("A valid corporate email address is required");
        return false;
      }
      if (!formData.phone.trim()) {
        setErrorMsg("Official corporate phone number is required");
        return false;
      }
    } else if (currentStep === 2) {
      if (!formData.directorName.trim()) {
        setErrorMsg("Director / Principal Executive Name is required");
        return false;
      }
      if (!formData.idNumber.trim()) {
        setErrorMsg(`Director ${formData.idType} number is required`);
        return false;
      }
    } else if (currentStep === 3) {
      if (!formData.accountNumber.trim() || formData.accountNumber.length < 10) {
        setErrorMsg("A valid 10-digit NUBAN account number is required");
        return false;
      }
      if (!formData.accountName.trim()) {
        setErrorMsg("Settlement Account Name is required");
        return false;
      }
    } else if (currentStep === 4) {
      if (!formData.cacDoc) {
        setErrorMsg("CAC Certificate of Incorporation / Status Report is required");
        return false;
      }
      if (!formData.tinDoc) {
        setErrorMsg("FIRS Tax Clearance Certificate / TIN Document is required");
        return false;
      }
      if (!formData.directorIdDoc) {
        setErrorMsg(`Managing Director ${formData.idType} identity document is required`);
        return false;
      }
    }
    return true;
  };

  const handleNext = () => {
    if (validateStep(step)) {
      setErrorMsg(null);
      setStep((prev) => (prev < 5 ? ((prev + 1) as any) : prev));
    }
  };

  const handleBack = () => {
    setErrorMsg(null);
    setStep((prev) => (prev > 1 ? ((prev - 1) as any) : prev));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateStep(step)) return;

    setIsSubmitting(true);
    setErrorMsg(null);

    try {
      const documentsPayload = [
        formData.cacDoc
          ? {
              id: `doc_cac_${Date.now()}`,
              type: "CAC_CERTIFICATE",
              title: "CAC Certificate of Incorporation",
              fileName: formData.cacDoc.fileName,
              fileSize: formData.cacDoc.fileSize,
              fileType: formData.cacDoc.fileType,
              fileData: formData.cacDoc.fileData,
              uploadedAt: new Date().toISOString(),
              verified: false,
            }
          : null,
        formData.tinDoc
          ? {
              id: `doc_tin_${Date.now()}`,
              type: "TIN_CERTIFICATE",
              title: "FIRS Tax Clearance Certificate",
              fileName: formData.tinDoc.fileName,
              fileSize: formData.tinDoc.fileSize,
              fileType: formData.tinDoc.fileType,
              fileData: formData.tinDoc.fileData,
              uploadedAt: new Date().toISOString(),
              verified: false,
            }
          : null,
        formData.directorIdDoc
          ? {
              id: `doc_id_${Date.now()}`,
              type: "DIRECTOR_ID",
              title: `Director ${formData.idType} Verification Slip`,
              fileName: formData.directorIdDoc.fileName,
              fileSize: formData.directorIdDoc.fileSize,
              fileType: formData.directorIdDoc.fileType,
              fileData: formData.directorIdDoc.fileData,
              uploadedAt: new Date().toISOString(),
              verified: false,
            }
          : null,
        formData.corenDoc
          ? {
              id: `doc_coren_${Date.now()}`,
              type: "COREN_LICENSE",
              title: "COREN Practicing License",
              fileName: formData.corenDoc.fileName,
              fileSize: formData.corenDoc.fileSize,
              fileType: formData.corenDoc.fileType,
              fileData: formData.corenDoc.fileData,
              uploadedAt: new Date().toISOString(),
              verified: false,
            }
          : null,
      ].filter(Boolean);

      const payload = {
        ...formData,
        documents: documentsPayload,
      };

      const res = await fetch("/api/contractors/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to submit verification packet");
      }

      try {
        const existing = JSON.parse(localStorage.getItem("vantaged_contractor_submissions") || "[]");
        existing.unshift(data.submission);
        localStorage.setItem("vantaged_contractor_submissions", JSON.stringify(existing));
      } catch {}

      setSubmissionSuccess(data.submission);
    } catch (err: any) {
      setErrorMsg(err.message || "An unexpected error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-black/65 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5 overflow-hidden"
      onClick={handleClose}
    >
      <div
        className="relative w-full max-w-xl max-h-[86vh] sm:max-h-[82vh] bg-white dark:bg-[#18123F] rounded-xl border border-[#E2E0EC] dark:border-[#2C2460] shadow-2xl flex flex-col overflow-hidden text-left font-sans"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Compact Pinned Header Bar */}
        <div className="shrink-0 px-5 sm:px-6 py-3.5 border-b border-[#E2E0EC] dark:border-[#2C2460] bg-[#F7F7FA] dark:bg-[#120D31] flex items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-1.5 mb-0.5">
              <span className="h-0.5 w-4 bg-[#EF5F18]" />
              <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-[#EF5F18]">
                Contractor Verification
              </span>
            </div>
            <h2 className="text-lg sm:text-xl font-extrabold text-[#261A66] dark:text-[#F4F3FC] leading-tight">
              Register Construction Company
            </h2>
          </div>

          <button
            type="button"
            onClick={handleClose}
            aria-label="Close modal"
            className="w-7 h-7 rounded-md flex items-center justify-center text-[#5E5A7D] hover:text-[#261A66] dark:text-[#B8B1E9] dark:hover:text-white hover:bg-[#E2E0EC] dark:hover:bg-[#2C2460] transition-colors cursor-pointer shrink-0 font-bold text-sm"
          >
            ✕
          </button>
        </div>

        {/* ── Success Confirmation Screen ── */}
        {submissionSuccess ? (
          <div className="flex-1 min-h-0 overflow-y-auto p-5 sm:p-6 space-y-4">
            <div className="p-4 rounded-lg bg-[#E9F6EC] dark:bg-[#1A3824] border border-[#A3D9B1] dark:border-[#25633A] text-left">
              <div className="flex items-center gap-2 mb-1.5">
                <span className="w-5 h-5 rounded-full bg-[#1F6B3E] text-white flex items-center justify-center font-bold text-xs shrink-0">
                  ✓
                </span>
                <h3 className="text-sm sm:text-base font-bold text-[#1F6B3E] dark:text-[#52B874]">
                  Verification Packet Submitted to Vantaged Admin
                </h3>
              </div>
              <p className="text-[11px] text-[#2E7D4E] dark:text-[#8CD6A4] leading-relaxed">
                Your corporate registration packet has been received and queued for review by the Vantaged Compliance team.
              </p>
            </div>

            {/* Application Summary Box */}
            <div className="p-4 rounded-lg bg-[#F7F7FA] dark:bg-[#211A4D] border border-[#E2E0EC] dark:border-[#2C2460] space-y-2 text-xs">
              <div className="flex justify-between items-center py-1 border-b border-[#E2E0EC] dark:border-[#2C2460]">
                <span className="text-[#5E5A7D] dark:text-[#B8B1E9]">Application Reference:</span>
                <span className="font-mono font-extrabold text-[#261A66] dark:text-[#F4F3FC]">
                  {submissionSuccess.referenceNumber}
                </span>
              </div>
              <div className="flex justify-between items-center py-1 border-b border-[#E2E0EC] dark:border-[#2C2460]">
                <span className="text-[#5E5A7D] dark:text-[#B8B1E9]">Registered Name:</span>
                <span className="font-bold text-[#261A66] dark:text-[#F4F3FC] truncate max-w-[240px]">
                  {submissionSuccess.companyName}
                </span>
              </div>
              <div className="flex justify-between items-center py-1 border-b border-[#E2E0EC] dark:border-[#2C2460]">
                <span className="text-[#5E5A7D] dark:text-[#B8B1E9]">RC Number:</span>
                <span className="font-mono font-bold text-[#261A66] dark:text-[#F4F3FC]">
                  {submissionSuccess.rcNumber}
                </span>
              </div>
              <div className="flex justify-between items-center py-1 border-b border-[#E2E0EC] dark:border-[#2C2460]">
                <span className="text-[#5E5A7D] dark:text-[#B8B1E9]">Bank Account:</span>
                <span className="font-bold text-[#261A66] dark:text-[#F4F3FC]">
                  {submissionSuccess.bankName} · {submissionSuccess.accountNumber}
                </span>
              </div>
              <div className="flex justify-between items-center py-1">
                <span className="text-[#5E5A7D] dark:text-[#B8B1E9]">Review Status:</span>
                <span className="font-mono font-bold text-[#EF5F18]">
                  UNDER REVIEW (24-Hour SLA)
                </span>
              </div>
            </div>

            {/* Next Steps Checklist */}
            <div className="space-y-1.5 text-[11px] text-[#5E5A7D] dark:text-[#B8B1E9]">
              <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-[#7C7894] dark:text-[#918ADA] block">
                What Happens Next
              </span>
              <div className="flex items-start gap-1.5">
                <span className="text-[#1F6B3E] font-bold">1.</span>
                <span>Registry cross-checks verify CAC Active status, TIN, and Director Identity.</span>
              </div>
              <div className="flex items-start gap-1.5">
                <span className="text-[#1F6B3E] font-bold">2.</span>
                <span>Vantaged Platform Admin reviews physical office proof and issues verified badges.</span>
              </div>
              <div className="flex items-start gap-1.5">
                <span className="text-[#1F6B3E] font-bold">3.</span>
                <span>Once approved, you receive login credentials via email and your first build is free.</span>
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="button"
                onClick={handleClose}
                className="h-9 px-5 rounded-md bg-[#261A66] hover:bg-[#EF5F18] text-white text-xs font-bold transition-all duration-150 cursor-pointer shadow-sm"
              >
                Close &amp; Return
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col flex-1 min-h-0 overflow-hidden">
            {/* Step Progress Tracker */}
            <div className="shrink-0 px-5 sm:px-6 py-2 bg-[#EDEBF5]/60 dark:bg-[#1F174C]/60 border-b border-[#E2E0EC] dark:border-[#2C2460] grid grid-cols-5 gap-1 text-center select-none text-xs">
              {[
                { s: 1, label: "Company" },
                { s: 2, label: "Director" },
                { s: 3, label: "Banking" },
                { s: 4, label: "Documents" },
                { s: 5, label: "Plan" },
              ].map((item) => (
                <div
                  key={item.s}
                  className={`py-0.5 rounded text-[11px] transition-colors flex items-center justify-center gap-1 ${
                    step === item.s
                      ? "font-bold text-[#EF5F18] border-b-2 border-[#EF5F18]"
                      : step > item.s
                      ? "text-[#1F6B3E] font-semibold"
                      : "text-[#7C7894] dark:text-[#918ADA]"
                  }`}
                >
                  <span className="font-mono text-[10px]">
                    {step > item.s ? "✓" : `0${item.s}`}
                  </span>
                  <span className="hidden sm:inline">{item.label}</span>
                </div>
              ))}
            </div>

            {/* Error Banner */}
            {errorMsg && (
              <div className="shrink-0 mx-5 sm:mx-6 mt-2.5 p-2 rounded-md bg-[#FDF2F2] dark:bg-[#3D1A1A] border border-[#F8B4B4] dark:border-[#7A2727] text-xs text-[#9B1C1C] dark:text-[#F98080] flex items-center gap-2">
                <span className="font-bold">⚠</span>
                <span>{errorMsg}</span>
              </div>
            )}

            {/* Scrollable Step Body */}
            <div className="flex-1 min-h-0 overflow-y-auto px-5 sm:px-6 py-3.5 space-y-3">
              {/* ── STEP 1: Corporate Profile ── */}
              {step === 1 && (
                <div className="space-y-3">
                  <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-[#7C7894] dark:text-[#918ADA] block">
                    Step 1 of 4 · Corporate Affairs Commission (CAC)
                  </span>

                  <div>
                    <label className="block text-[11px] font-bold text-[#261A66] dark:text-[#F4F3FC] mb-1">
                      Registered Company Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Crane & Stone Engineering Limited"
                      value={formData.companyName}
                      onChange={(e) => handleChange("companyName", e.target.value)}
                      className="w-full h-9 px-3 rounded-md bg-white dark:bg-[#211A4D] border border-[#E2E0EC] dark:border-[#2C2460] text-xs text-[#261A66] dark:text-[#F4F3FC] focus:outline-none focus:border-[#EF5F18]"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-bold text-[#261A66] dark:text-[#F4F3FC] mb-1">
                        CAC RC Number *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. RC-1849202"
                        value={formData.rcNumber}
                        onChange={(e) => handleChange("rcNumber", e.target.value)}
                        className="w-full h-9 px-3 rounded-md bg-white dark:bg-[#211A4D] border border-[#E2E0EC] dark:border-[#2C2460] text-xs text-[#261A66] dark:text-[#F4F3FC] focus:outline-none focus:border-[#EF5F18]"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-[#261A66] dark:text-[#F4F3FC] mb-1">
                        Tax Identification Number (TIN) *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. 24910294-0001"
                        value={formData.tin}
                        onChange={(e) => handleChange("tin", e.target.value)}
                        className="w-full h-9 px-3 rounded-md bg-white dark:bg-[#211A4D] border border-[#E2E0EC] dark:border-[#2C2460] text-xs text-[#261A66] dark:text-[#F4F3FC] focus:outline-none focus:border-[#EF5F18]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-[#261A66] dark:text-[#F4F3FC] mb-1">
                      Primary Construction Category *
                    </label>
                    <select
                      value={formData.category}
                      onChange={(e) => handleChange("category", e.target.value)}
                      className="w-full h-9 px-3 rounded-md bg-white dark:bg-[#211A4D] border border-[#E2E0EC] dark:border-[#2C2460] text-xs text-[#261A66] dark:text-[#F4F3FC] focus:outline-none focus:border-[#EF5F18] cursor-pointer"
                    >
                      {CONTRACTOR_CATEGORIES.map((cat) => (
                        <option key={cat} value={cat}>
                          {cat}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-bold text-[#261A66] dark:text-[#F4F3FC] mb-1">
                        Corporate Email *
                      </label>
                      <input
                        type="email"
                        required
                        placeholder="info@craneandstone.com"
                        value={formData.email}
                        onChange={(e) => handleChange("email", e.target.value)}
                        className="w-full h-9 px-3 rounded-md bg-white dark:bg-[#211A4D] border border-[#E2E0EC] dark:border-[#2C2460] text-xs text-[#261A66] dark:text-[#F4F3FC] focus:outline-none focus:border-[#EF5F18]"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-[#261A66] dark:text-[#F4F3FC] mb-1">
                        Corporate Phone *
                      </label>
                      <input
                        type="tel"
                        required
                        placeholder="+234 803 123 4567"
                        value={formData.phone}
                        onChange={(e) => handleChange("phone", e.target.value)}
                        className="w-full h-9 px-3 rounded-md bg-white dark:bg-[#211A4D] border border-[#E2E0EC] dark:border-[#2C2460] text-xs text-[#261A66] dark:text-[#F4F3FC] focus:outline-none focus:border-[#EF5F18]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-[#261A66] dark:text-[#F4F3FC] mb-1">
                      Head Office Physical Address *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Plot 14, Commercial Avenue, Victoria Island, Lagos"
                      value={formData.officeAddress}
                      onChange={(e) => handleChange("officeAddress", e.target.value)}
                      className="w-full h-9 px-3 rounded-md bg-white dark:bg-[#211A4D] border border-[#E2E0EC] dark:border-[#2C2460] text-xs text-[#261A66] dark:text-[#F4F3FC] focus:outline-none focus:border-[#EF5F18]"
                    />
                  </div>
                </div>
              )}

              {/* ── STEP 2: Director Identity ── */}
              {step === 2 && (
                <div className="space-y-3">
                  <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-[#7C7894] dark:text-[#918ADA] block">
                    Step 2 of 4 · Principal Director &amp; Executive Identity
                  </span>

                  <div>
                    <label className="block text-[11px] font-bold text-[#261A66] dark:text-[#F4F3FC] mb-1">
                      Director Legal Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Engr. Babatunde Julius Adeleke"
                      value={formData.directorName}
                      onChange={(e) => handleChange("directorName", e.target.value)}
                      className="w-full h-9 px-3 rounded-md bg-white dark:bg-[#211A4D] border border-[#E2E0EC] dark:border-[#2C2460] text-xs text-[#261A66] dark:text-[#F4F3FC] focus:outline-none focus:border-[#EF5F18]"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-bold text-[#261A66] dark:text-[#F4F3FC] mb-1">
                        Corporate Title
                      </label>
                      <input
                        type="text"
                        value={formData.directorRole}
                        onChange={(e) => handleChange("directorRole", e.target.value)}
                        className="w-full h-9 px-3 rounded-md bg-white dark:bg-[#211A4D] border border-[#E2E0EC] dark:border-[#2C2460] text-xs text-[#261A66] dark:text-[#F4F3FC] focus:outline-none focus:border-[#EF5F18]"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-[#261A66] dark:text-[#F4F3FC] mb-1">
                        Identity Document *
                      </label>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => handleChange("idType", "NIN")}
                          className={`flex-1 h-9 rounded-md text-xs font-bold border transition-colors ${
                            formData.idType === "NIN"
                              ? "bg-[#261A66] text-white border-[#261A66] dark:bg-[#EF5F18] dark:border-[#EF5F18]"
                              : "bg-[#F7F7FA] dark:bg-[#211A4D] text-[#5E5A7D] dark:text-[#B8B1E9] border-[#E2E0EC] dark:border-[#2C2460]"
                          }`}
                        >
                          NIN
                        </button>
                        <button
                          type="button"
                          onClick={() => handleChange("idType", "PASSPORT")}
                          className={`flex-1 h-9 rounded-md text-xs font-bold border transition-colors ${
                            formData.idType === "PASSPORT"
                              ? "bg-[#261A66] text-white border-[#261A66] dark:bg-[#EF5F18] dark:border-[#EF5F18]"
                              : "bg-[#F7F7FA] dark:bg-[#211A4D] text-[#5E5A7D] dark:text-[#B8B1E9] border-[#E2E0EC] dark:border-[#2C2460]"
                          }`}
                        >
                          Passport
                        </button>
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-[#261A66] dark:text-[#F4F3FC] mb-1">
                      {formData.idType === "NIN" ? "11-Digit National Identification Number (NIN) *" : "Passport Number *"}
                    </label>
                    <input
                      type="text"
                      required
                      placeholder={formData.idType === "NIN" ? "e.g. 19283746501" : "e.g. A12345678"}
                      value={formData.idNumber}
                      onChange={(e) => handleChange("idNumber", e.target.value)}
                      className="w-full h-9 px-3 rounded-md bg-white dark:bg-[#211A4D] border border-[#E2E0EC] dark:border-[#2C2460] text-xs text-[#261A66] dark:text-[#F4F3FC] focus:outline-none focus:border-[#EF5F18]"
                    />
                  </div>

                  <div className="p-2.5 rounded-md bg-[#EDEBF5] dark:bg-[#211A4D] text-[11px] text-[#5E5A7D] dark:text-[#B8B1E9] leading-relaxed">
                    ℹ Verified via automated national registry lookup with biometric liveness check to confirm authentic identity.
                  </div>
                </div>
              )}

              {/* ── STEP 3: Banking & Payout Settlement ── */}
              {step === 3 && (
                <div className="space-y-3">
                  <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-[#7C7894] dark:text-[#918ADA] block">
                    Step 3 of 4 · Settlement Bank Account
                  </span>

                  <div>
                    <label className="block text-[11px] font-bold text-[#261A66] dark:text-[#F4F3FC] mb-1">
                      Commercial Bank *
                    </label>
                    <select
                      value={formData.bankName}
                      onChange={(e) => handleChange("bankName", e.target.value)}
                      className="w-full h-9 px-3 rounded-md bg-white dark:bg-[#211A4D] border border-[#E2E0EC] dark:border-[#2C2460] text-xs text-[#261A66] dark:text-[#F4F3FC] focus:outline-none focus:border-[#EF5F18] cursor-pointer"
                    >
                      {NIGERIAN_BANKS.map((b) => (
                        <option key={b} value={b}>
                          {b}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-[#261A66] dark:text-[#F4F3FC] mb-1">
                      10-Digit NUBAN Corporate Account *
                    </label>
                    <input
                      type="text"
                      maxLength={10}
                      required
                      placeholder="e.g. 1012345678"
                      value={formData.accountNumber}
                      onChange={(e) => handleChange("accountNumber", e.target.value.replace(/\D/g, ""))}
                      className="w-full h-9 px-3 rounded-md bg-white dark:bg-[#211A4D] border border-[#E2E0EC] dark:border-[#2C2460] text-xs text-[#261A66] dark:text-[#F4F3FC] focus:outline-none focus:border-[#EF5F18] font-mono tracking-wider"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-[#261A66] dark:text-[#F4F3FC] mb-1">
                      Account Registered Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Crane & Stone Engineering Ltd"
                      value={formData.accountName}
                      onChange={(e) => handleChange("accountName", e.target.value)}
                      className="w-full h-9 px-3 rounded-md bg-white dark:bg-[#211A4D] border border-[#E2E0EC] dark:border-[#2C2460] text-xs text-[#261A66] dark:text-[#F4F3FC] focus:outline-none focus:border-[#EF5F18]"
                    />
                  </div>

                  <div className="p-2.5 rounded-md bg-[#FFF4EE] dark:bg-[#3A1A0E] border border-[#FDCAA9] dark:border-[#5E2B15] text-[11px] text-[#D84C0B] dark:text-[#F17C42] leading-relaxed">
                    <strong>Security Verification:</strong> The bank account name resolved automatically from your NUBAN must match your verified CAC registered name to ensure secure milestone payouts.
                  </div>
                </div>
              )}

              {/* ── STEP 4: Compliance Document Upload ── */}
              {step === 4 && (
                <div className="space-y-3">
                  <div className="pb-1 border-b border-[#E2E0EC] dark:border-[#2C2460]">
                    <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-[#7C7894] dark:text-[#918ADA] block">
                      Step 4 of 5 · Compliance Document Upload
                    </span>
                    <p className="text-[11px] text-[#5E5A7D] dark:text-[#B8B1E9]">
                      Upload corporate and regulatory documents for admin compliance review.
                    </p>
                  </div>

                  {/* Document List */}
                  <div className="space-y-2.5">
                    {[
                      {
                        key: "cacDoc" as const,
                        title: "CAC Certificate / Status Report *",
                        desc: "Official Certificate of Incorporation or Form CAC 1.1 / Status Report.",
                        doc: formData.cacDoc,
                        required: true,
                        accept: ".pdf,.png,.jpg,.jpeg",
                      },
                      {
                        key: "tinDoc" as const,
                        title: "FIRS Tax Clearance / TIN Document *",
                        desc: "Valid corporate Tax Identification Number certificate or clearance slip.",
                        doc: formData.tinDoc,
                        required: true,
                        accept: ".pdf,.png,.jpg,.jpeg",
                      },
                      {
                        key: "directorIdDoc" as const,
                        title: `Managing Director ${formData.idType} Document *`,
                        desc: `Clear copy of ${formData.idType === "NIN" ? "National NIN Slip / Card" : "International Passport Bio Page"}.`,
                        doc: formData.directorIdDoc,
                        required: true,
                        accept: ".pdf,.png,.jpg,.jpeg",
                      },
                      {
                        key: "corenDoc" as const,
                        title: "COREN / Technical Practicing License (Optional)",
                        desc: "Engineering, quantity surveying or architectural council license.",
                        doc: formData.corenDoc,
                        required: false,
                        accept: ".pdf,.png,.jpg,.jpeg",
                      },
                    ].map((item) => (
                      <div
                        key={item.key}
                        className={`p-3 rounded-lg border transition-all ${
                          item.doc
                            ? "bg-[#E9F6EC]/50 dark:bg-[#1A3824]/40 border-[#A3D9B1] dark:border-[#25633A]"
                            : "bg-[#F7F7FA] dark:bg-[#211A4D] border-[#E2E0EC] dark:border-[#2C2460]"
                        }`}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-1.5">
                              <span className="text-xs font-bold text-[#261A66] dark:text-[#F4F3FC]">
                                {item.title}
                              </span>
                              {item.doc && (
                                <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-[#1F6B3E] text-white">
                                  Ready ✓
                                </span>
                              )}
                            </div>
                            <p className="text-[10px] text-[#5E5A7D] dark:text-[#B8B1E9] mt-0.5">
                              {item.desc}
                            </p>
                          </div>

                          {item.doc ? (
                            <button
                              type="button"
                              onClick={() => handleRemoveDoc(item.key)}
                              className="text-[10px] font-bold text-rose-600 hover:text-rose-700 dark:text-rose-400 cursor-pointer shrink-0"
                            >
                              ✕ Remove
                            </button>
                          ) : null}
                        </div>

                        {item.doc ? (
                          <div className="mt-2 flex items-center justify-between p-2 rounded bg-white dark:bg-[#18123F] border border-[#A3D9B1]/60 text-xs">
                            <div className="flex items-center gap-2 truncate">
                              <span className="text-[#1F6B3E] font-bold">📄</span>
                              <span className="font-mono text-[11px] font-semibold text-[#261A66] dark:text-[#F4F3FC] truncate">
                                {item.doc.fileName}
                              </span>
                              <span className="text-[10px] text-[#7C7894] font-mono shrink-0">
                                ({item.doc.fileSize})
                              </span>
                            </div>
                            <label className="text-[10px] font-bold text-[#EF5F18] hover:underline cursor-pointer shrink-0 ml-2">
                              Change
                              <input
                                type="file"
                                accept={item.accept}
                                className="hidden"
                                onChange={(e) => {
                                  const file = e.target.files?.[0];
                                  if (file) handleFileUpload(item.key, file);
                                }}
                              />
                            </label>
                          </div>
                        ) : (
                          <label className="mt-2 flex items-center justify-center gap-2 p-2.5 rounded border border-dashed border-[#CBC8DA] dark:border-[#3D3478] bg-white/70 dark:bg-[#18123F]/70 hover:border-[#EF5F18] hover:bg-white dark:hover:bg-[#18123F] transition-all cursor-pointer">
                            <span className="text-[#EF5F18] font-bold text-xs">📁</span>
                            <span className="text-[11px] font-medium text-[#5E5A7D] dark:text-[#B8B1E9]">
                              Click or drop file <span className="text-[10px] text-[#7C7894]">(PDF, PNG, JPG max 10MB)</span>
                            </span>
                            <input
                              type="file"
                              accept={item.accept}
                              className="hidden"
                              onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) handleFileUpload(item.key, file);
                              }}
                            />
                          </label>
                        )}
                      </div>
                    ))}
                  </div>

                  <div className="p-2.5 rounded-md bg-[#EDEBF5] dark:bg-[#211A4D] text-[11px] text-[#5E5A7D] dark:text-[#B8B1E9] leading-relaxed">
                    🔒 Documents are encrypted and sent directly to the Vantaged Compliance Officer for manual document inspection.
                  </div>
                </div>
              )}

              {/* ── STEP 5: Accreditations & Plan Selection ── */}
              {step === 5 && (
                <div className="space-y-3">
                  <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-[#7C7894] dark:text-[#918ADA] block">
                    Step 5 of 5 · Capacity Tier &amp; Professional Badges
                  </span>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-bold text-[#261A66] dark:text-[#F4F3FC] mb-1">
                        COREN / CORBON Reg. (Optional)
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. R.19245"
                        value={formData.corenNumber}
                        onChange={(e) => handleChange("corenNumber", e.target.value)}
                        className="w-full h-9 px-3 rounded-md bg-white dark:bg-[#211A4D] border border-[#E2E0EC] dark:border-[#2C2460] text-xs text-[#261A66] dark:text-[#F4F3FC] focus:outline-none focus:border-[#EF5F18]"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-[#261A66] dark:text-[#F4F3FC] mb-1">
                        BPP / Ministry Category (Optional)
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Category C (Federal)"
                        value={formData.bppCategory}
                        onChange={(e) => handleChange("bppCategory", e.target.value)}
                        className="w-full h-9 px-3 rounded-md bg-white dark:bg-[#211A4D] border border-[#E2E0EC] dark:border-[#2C2460] text-xs text-[#261A66] dark:text-[#F4F3FC] focus:outline-none focus:border-[#EF5F18]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-[#261A66] dark:text-[#F4F3FC] mb-1.5">
                      Select Project Capacity Tier *
                    </label>

                    <div className="space-y-2">
                      {[
                        {
                          id: "starter",
                          name: "Starter Contractor",
                          slot: "1 Active Slot",
                          price: "1st Build 100% Free",
                          sub: "then $79.99/mo (₦100,000/mo) after completion",
                        },
                        {
                          id: "verified",
                          name: "Verified Builder",
                          slot: "Up to 3 Active Contracts",
                          price: "$199.99/mo · ₦260,000/mo",
                          sub: "For active commercial firms with multiple sites",
                        },
                        {
                          id: "prime",
                          name: "Prime Consortium",
                          slot: "Up to 8 Active Contracts",
                          price: "$449.99/mo · ₦600,000/mo",
                          sub: "For Tier-1 contractors managing large estates",
                        },
                      ].map((plan) => (
                        <div
                          key={plan.id}
                          onClick={() => handleChange("selectedPlan", plan.id as any)}
                          className={`p-2.5 rounded-lg border cursor-pointer transition-all flex items-center justify-between ${
                            formData.selectedPlan === plan.id
                              ? "border-[#EF5F18] bg-[#FFF5EB] dark:bg-[#3A1A0E]"
                              : "border-[#E2E0EC] dark:border-[#2C2460] bg-white dark:bg-[#211A4D] hover:border-[#EF5F18]/50"
                          }`}
                        >
                          <div>
                            <span className="font-bold text-xs text-[#261A66] dark:text-[#F4F3FC] block">
                              {plan.name} — <span className="text-[#EF5F18]">{plan.slot}</span>
                            </span>
                            <span className="text-[10px] text-[#5E5A7D] dark:text-[#B8B1E9]">
                              {plan.sub}
                            </span>
                          </div>
                          <span className="font-mono text-[11px] font-extrabold text-[#261A66] dark:text-[#F4F3FC] shrink-0 ml-2">
                            {plan.price}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Pinned Bottom Actions Bar */}
            <div className="shrink-0 px-5 sm:px-6 py-3 bg-[#F7F7FA] dark:bg-[#120D31] border-t border-[#E2E0EC] dark:border-[#2C2460] flex items-center justify-between gap-3">
              {step > 1 ? (
                <button
                  type="button"
                  onClick={handleBack}
                  disabled={isSubmitting}
                  className="h-9 px-3.5 rounded-md border border-[#E2E0EC] dark:border-[#2C2460] bg-white dark:bg-[#211A4D] text-[#5E5A7D] hover:text-[#261A66] dark:text-[#B8B1E9] dark:hover:text-white text-xs font-bold transition-colors cursor-pointer"
                >
                  &larr; Back
                </button>
              ) : (
                <div />
              )}

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleClose}
                  disabled={isSubmitting}
                  className="h-9 px-3 rounded-md text-xs font-bold text-[#5E5A7D] hover:text-[#261A66] dark:text-[#B8B1E9] dark:hover:text-white cursor-pointer"
                >
                  Cancel
                </button>

                {step < 5 ? (
                  <button
                    type="button"
                    onClick={handleNext}
                    className="h-9 px-4.5 rounded-md bg-[#261A66] hover:bg-[#EF5F18] text-white text-xs font-bold transition-all duration-150 cursor-pointer shadow-sm"
                  >
                    Continue &rarr;
                  </button>
                ) : (
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="h-9 px-5 rounded-md bg-[#EF5F18] hover:bg-[#D84C0B] active:bg-[#B33C08] text-white text-xs font-bold transition-all duration-150 cursor-pointer shadow-md disabled:opacity-50"
                  >
                    {isSubmitting ? "Submitting..." : "Submit Verification Packet"}
                  </button>
                )}
              </div>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

/**
 * Self-contained global modal host to be placed in root layout.
 * Listens to global events and renders the modal wherever triggered.
 */
export function GlobalCompanySignupModal() {
  return <CompanySignupModal />;
}
