"use client";

import React, { useState, useEffect } from "react";
import { ACTIVE_PROJECTS } from "../pages/OwnerProjectsPage";

export interface ShareLinkItem {
  id: string;
  projectId: string;
  projectTitle: string;
  projectLocation: string;
  token: string;
  url: string;
  expiresInDays: number | null; // null = never
  expiryDateStr: string;
  createdAt: string;
  viewsCount: number;
  recipientEmail?: string;
  isRevoked: boolean;
}

const DEFAULT_SHARE_LINKS: ShareLinkItem[] = [
  {
    id: "sh-1",
    projectId: "proj-lekki",
    projectTitle: "Lekki Phase 1 Luxury Villa",
    projectLocation: "Plot 14, Admiralty Way, Lekki",
    token: "vnt-lekki-4821a",
    url: "/s/vnt-lekki-4821a",
    expiresInDays: 30,
    expiryDateStr: "Nov 18, 2026",
    createdAt: "Oct 19, 2026",
    viewsCount: 8,
    recipientEmail: "emeka.okonkwo@gmail.com",
    isRevoked: false,
  },
  {
    id: "sh-2",
    projectId: "proj-banana",
    projectTitle: "Banana Island Horizon Penthouse",
    projectLocation: "Zone C, Banana Island, Ikoyi",
    token: "vnt-banana-7311b",
    url: "/s/vnt-banana-7311b",
    expiresInDays: 14,
    expiryDateStr: "Nov 02, 2026",
    createdAt: "Oct 18, 2026",
    viewsCount: 3,
    recipientEmail: "auditor@diasporainvest.com",
    isRevoked: false,
  },
];

interface ShareLinkModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultProjectId?: string;
}

export function ShareLinkModal({
  isOpen,
  onClose,
  defaultProjectId = "proj-lekki",
}: ShareLinkModalProps) {
  const [activeTab, setActiveTab] = useState<"create" | "manage">("create");
  const [selectedProjectId, setSelectedProjectId] = useState<string>(defaultProjectId);
  const [expiryOption, setExpiryOption] = useState<number | null>(30); // 7, 30, 90, null (never)
  const [recipientEmail, setRecipientEmail] = useState("");
  const [copyFeedback, setCopyFeedback] = useState(false);
  const [origin, setOrigin] = useState("");

  const [shareLinks, setShareLinks] = useState<ShareLinkItem[]>(DEFAULT_SHARE_LINKS);
  const [recentlyCreatedLink, setRecentlyCreatedLink] = useState<ShareLinkItem | null>(null);

  // Load saved links from localStorage on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      setOrigin(window.location.origin);
      const saved = localStorage.getItem("vantaged_active_share_links");
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed) && parsed.length > 0) {
            setShareLinks(parsed);
          }
        } catch {
          // ignore parsing error
        }
      }
    }
  }, []);

  const persistLinks = (next: ShareLinkItem[]) => {
    setShareLinks(next);
    if (typeof window !== "undefined") {
      localStorage.setItem("vantaged_active_share_links", JSON.stringify(next));
    }
  };

  const selectedProject =
    ACTIVE_PROJECTS.find((p) => p.id === selectedProjectId) || ACTIVE_PROJECTS[0];

  const handleGenerateLink = (e: React.FormEvent) => {
    e.preventDefault();
    const now = new Date();
    const expiryDate = expiryOption
      ? new Date(now.getTime() + expiryOption * 24 * 60 * 60 * 1000).toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        })
      : "Never expires";

    const slug = selectedProject.id.replace("proj-", "");
    const randomHex = Math.random().toString(36).substring(2, 7);
    const token = `vnt-${slug}-${randomHex}`;

    const newLink: ShareLinkItem = {
      id: `sh-${Date.now()}`,
      projectId: selectedProject.id,
      projectTitle: selectedProject.title,
      projectLocation: selectedProject.location,
      token,
      url: `/s/${token}`,
      expiresInDays: expiryOption,
      expiryDateStr: expiryDate,
      createdAt: "Today",
      viewsCount: 0,
      recipientEmail: recipientEmail.trim() || undefined,
      isRevoked: false,
    };

    const next = [newLink, ...shareLinks];
    persistLinks(next);
    setRecentlyCreatedLink(newLink);
  };

  const handleCopyLink = (urlToCopy?: string) => {
    const target = urlToCopy || (recentlyCreatedLink ? `${origin || "https://vantaged.com"}${recentlyCreatedLink.url}` : "");
    if (navigator?.clipboard && target) {
      navigator.clipboard.writeText(target);
    }
    setCopyFeedback(true);
    setTimeout(() => setCopyFeedback(false), 2500);
  };

  const handleOpenPreview = (urlToOpen?: string) => {
    const targetUrl = urlToOpen || recentlyCreatedLink?.url || `/s/vnt-lekki-4821a`;
    window.open(targetUrl, "_blank");
  };

  const handleSendToGmail = (linkToShare?: ShareLinkItem) => {
    const targetLink = linkToShare || recentlyCreatedLink;
    if (!targetLink) return;

    const fullUrl = `${origin || "https://vantaged.com"}${targetLink.url}`;
    const subject = encodeURIComponent(
      `Live Building Progress: ${targetLink.projectTitle} on Vantaged`
    );
    const body = encodeURIComponent(
      `Hello,\n\nHere is your private, view-only observer link to follow the live construction progress for ${targetLink.projectTitle} on Vantaged:\n\n${fullUrl}\n\nThis link allows you to review verified stage photos, GPS-verified inspection checklists, and construction milestones in real time.\n\n(Note: Private financial accounts and internal communications remain protected).\n\nBest regards.`
    );
    const toParam = targetLink.recipientEmail ? `&to=${encodeURIComponent(targetLink.recipientEmail)}` : "";
    const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1${toParam}&su=${subject}&body=${body}`;

    window.open(gmailUrl, "_blank");
  };

  const handleRevokeLink = (id: string) => {
    if (confirm("Are you sure you want to revoke this link? Anyone holding this link will immediately lose access.")) {
      const next = shareLinks.map((l) =>
        l.id === id ? { ...l, isRevoked: true } : l
      );
      persistLinks(next);
      if (recentlyCreatedLink?.id === id) {
        setRecentlyCreatedLink(null);
      }
    }
  };

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/45 backdrop-blur-xs font-sans select-none animate-in fade-in duration-150"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{ fontFamily: "var(--vt-font-sans), 'Outfit', sans-serif" }}
        className="w-full max-w-xl max-h-[90vh] bg-white border border-[var(--vt-color-border-default,#E2E0EC)] rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-in zoom-in-95 duration-150"
      >
        {/* ── Modal Header ── */}
        <div className="px-5 sm:px-6 py-4 border-b border-[var(--vt-color-border-default,#E2E0EC)] flex items-center justify-between gap-3 bg-[var(--vt-color-neutral-50,#F7F7FA)]/80">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-[var(--vt-color-orange-50,#FFF4EE)] text-[var(--vt-color-orange-600,#D84C0B)] border border-[var(--vt-color-orange-200,#FDCAA9)] flex items-center justify-center shrink-0">
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
                <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
              </svg>
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-extrabold text-[var(--vt-color-indigo-900,#261A66)] tracking-tight">
                Share Live Building Progress
              </h2>
              <p className="text-xs text-[var(--vt-color-neutral-500,#7C7894)]">
                Create a secure, read-only link for family or lenders
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            title="Close"
            className="w-8 h-8 rounded-lg bg-white hover:bg-[var(--vt-color-neutral-100,#EFEEF5)] border border-[var(--vt-color-border-default,#E2E0EC)] text-[var(--vt-color-neutral-600,#5E5A7D)] flex items-center justify-center transition-colors cursor-pointer"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        {/* ── Segmented Tabs: Create New vs Active Links ── */}
        <div className="px-5 sm:px-6 pt-3 pb-2 border-b border-[var(--vt-color-border-default,#E2E0EC)] flex items-center gap-2 bg-white">
          <button
            type="button"
            onClick={() => {
              setActiveTab("create");
            }}
            className={`pb-2 px-3 text-xs font-bold transition-all border-b-2 cursor-pointer ${
              activeTab === "create"
                ? "border-[var(--vt-color-orange-500,#EF5F18)] text-[var(--vt-color-orange-700,#B33C08)]"
                : "border-transparent text-[var(--vt-color-neutral-500,#7C7894)] hover:text-[var(--vt-color-indigo-900,#261A66)]"
            }`}
          >
            Create New Link
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("manage")}
            className={`pb-2 px-3 text-xs font-bold transition-all border-b-2 cursor-pointer flex items-center gap-1.5 ${
              activeTab === "manage"
                ? "border-[var(--vt-color-orange-500,#EF5F18)] text-[var(--vt-color-orange-700,#B33C08)]"
                : "border-transparent text-[var(--vt-color-neutral-500,#7C7894)] hover:text-[var(--vt-color-indigo-900,#261A66)]"
            }`}
          >
            <span>Active Links</span>
            <span className="px-1.5 py-0.2 rounded-full bg-[var(--vt-color-neutral-100,#EFEEF5)] text-[var(--vt-color-neutral-700,#46425F)] text-[10px] font-bold">
              {shareLinks.filter((l) => !l.isRevoked).length}
            </span>
          </button>
        </div>

        {/* ── Modal Body (Scrollable) ── */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 flex flex-col gap-5 text-xs text-[var(--vt-color-neutral-700,#46425F)]">
          {activeTab === "create" ? (
            recentlyCreatedLink ? (
              /* SUCCESS / CREATED LINK STATE */
              <div className="flex flex-col gap-4 animate-in fade-in zoom-in-95 duration-150">
                <div className="p-4 rounded-xl bg-[var(--vt-color-green-50,#E9F6EC)] border border-[var(--vt-color-green-200,#BCE5C8)] flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-[var(--vt-color-green-600,#248246)] text-white flex items-center justify-center shrink-0 font-bold text-sm">
                    ✓
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-[var(--vt-color-green-900,#0E3C21)]">
                      Unique Share Link Created & Saved!
                    </h3>
                    <p className="text-xs text-[var(--vt-color-green-800,#134E2C)] mt-0.5">
                      This link has been committed and stored in your <strong>Active Links</strong> list.
                    </p>
                  </div>
                </div>

                {/* Project Details Banner */}
                <div className="p-3.5 rounded-xl bg-[var(--vt-color-neutral-50,#F7F7FA)] border border-[var(--vt-color-border-default,#E2E0EC)] flex items-center justify-between">
                  <div>
                    <p className="font-bold text-xs text-[var(--vt-color-indigo-900,#261A66)]">
                      {recentlyCreatedLink.projectTitle}
                    </p>
                    <p className="text-[11px] text-[var(--vt-color-neutral-500,#7C7894)] mt-0.5">
                      {recentlyCreatedLink.projectLocation} · Expires: <strong>{recentlyCreatedLink.expiryDateStr}</strong>
                    </p>
                  </div>
                  <span className="px-2 py-0.5 rounded-full bg-white text-[var(--vt-color-orange-700,#B33C08)] border border-[var(--vt-color-orange-200,#FDCAA9)] text-[10.5px] font-bold">
                    View-only
                  </span>
                </div>

                {/* Unique URL & Copy Link Button */}
                <div>
                  <label className="block text-xs font-bold text-[var(--vt-color-indigo-900,#261A66)] mb-1.5">
                    Your Unique Observer Link:
                  </label>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 h-9 px-3 rounded-lg bg-[var(--vt-color-neutral-50,#F7F7FA)] border border-[var(--vt-color-border-default,#E2E0EC)] flex items-center overflow-hidden font-mono text-[11px] text-[var(--vt-color-indigo-900,#261A66)]">
                      <span className="truncate">{origin || "https://vantaged.com"}{recentlyCreatedLink.url}</span>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleCopyLink()}
                      className={`h-9 px-3.5 rounded-lg font-bold text-xs transition-all shadow-2xs flex items-center gap-1.5 cursor-pointer shrink-0 ${
                        copyFeedback
                          ? "bg-[var(--vt-color-green-600,#248246)] text-white"
                          : "bg-[var(--vt-color-orange-500,#EF5F18)] hover:bg-[var(--vt-color-orange-600,#D84C0B)] text-white"
                      }`}
                    >
                      {copyFeedback ? (
                        <>
                          <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                            <polyline points="20 6 9 17 4 12" />
                          </svg>
                          <span>Copied!</span>
                        </>
                      ) : (
                        <>
                          <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                            <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                            <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                          </svg>
                          <span>Copy Link</span>
                        </>
                      )}
                    </button>

                    <button
                      type="button"
                      onClick={() => handleOpenPreview()}
                      title="Open live view in new tab"
                      className="h-9 px-3 rounded-lg bg-white hover:bg-[var(--vt-color-neutral-100,#EFEEF5)] border border-[var(--vt-color-border-default,#E2E0EC)] text-[var(--vt-color-indigo-900,#261A66)] font-bold text-xs transition-all flex items-center gap-1 cursor-pointer shrink-0"
                    >
                      <span>Preview</span>
                      <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                        <polyline points="15 3 21 3 21 9" />
                        <line x1="10" y1="14" x2="21" y2="3" />
                      </svg>
                    </button>
                  </div>
                </div>

                {/* Send via Gmail Direct */}
                <div className="pt-3 border-t border-[var(--vt-color-border-default,#E2E0EC)] flex flex-col gap-2">
                  <span className="text-xs font-bold text-[var(--vt-color-indigo-900,#261A66)]">
                    Share directly with someone:
                  </span>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => handleSendToGmail()}
                      className="flex-1 h-9 px-4 rounded-lg bg-[#EA4335] hover:bg-[#D93025] text-white font-bold text-xs transition-all shadow-2xs flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                        <path d="M24 5.457v13.909c0 .904-.732 1.636-1.636 1.636h-3.819V11.73L12 16.64l-6.545-4.91v9.273H1.636A1.636 1.636 0 0 1 0 19.366V5.457c0-2.023 2.309-3.178 3.927-1.964L12 9.545l8.073-6.052C21.69 2.279 24 3.434 24 5.457z" />
                      </svg>
                      <span>Open in Gmail (Pre-filled Draft)</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setActiveTab("manage")}
                      className="h-9 px-4 rounded-lg bg-[var(--vt-color-neutral-100,#EFEEF5)] hover:bg-[var(--vt-color-neutral-200,#E2E0EC)] text-[var(--vt-color-indigo-900,#261A66)] font-bold text-xs transition-all cursor-pointer"
                    >
                      View in Active Links
                    </button>
                  </div>
                </div>

                <div className="pt-2 text-center">
                  <button
                    type="button"
                    onClick={() => setRecentlyCreatedLink(null)}
                    className="text-xs font-bold text-[var(--vt-color-orange-600,#D84C0B)] hover:underline cursor-pointer"
                  >
                    + Create another share link
                  </button>
                </div>
              </div>
            ) : (
              /* FORM TO CREATE A LINK */
              <form onSubmit={handleGenerateLink} className="flex flex-col gap-4">
                {/* STEP 1: Choose Project */}
                <div>
                  <label className="block text-xs font-bold text-[var(--vt-color-indigo-900,#261A66)] mb-2">
                    1. Which project do you want to create a link for?
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {ACTIVE_PROJECTS.map((proj) => {
                      const isSelected = proj.id === selectedProjectId;
                      return (
                        <div
                          key={proj.id}
                          onClick={() => setSelectedProjectId(proj.id)}
                          className={`p-3 rounded-xl border transition-all cursor-pointer flex flex-col justify-between gap-2 ${
                            isSelected
                              ? "bg-[var(--vt-color-orange-50,#FFF4EE)] border-[var(--vt-color-orange-500,#EF5F18)] shadow-2xs"
                              : "bg-white hover:bg-[var(--vt-color-neutral-50,#F7F7FA)] border-[var(--vt-color-border-default,#E2E0EC)]"
                          }`}
                        >
                          <div className="flex items-start justify-between gap-2">
                            <div>
                              <p className="font-bold text-[var(--vt-color-indigo-900,#261A66)] text-xs line-clamp-1">
                                {proj.title}
                              </p>
                              <p className="text-[10.5px] text-[var(--vt-color-neutral-500,#7C7894)] mt-0.5 truncate">
                                {proj.location}
                              </p>
                            </div>
                            <span
                              className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 mt-0.5 ${
                                isSelected
                                  ? "bg-[var(--vt-color-orange-500,#EF5F18)] border-[var(--vt-color-orange-500,#EF5F18)] text-white"
                                  : "border-[var(--vt-color-neutral-300,#CBC8DA)] bg-white"
                              }`}
                            >
                              {isSelected && (
                                <svg className="w-2.5 h-2.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5">
                                  <polyline points="20 6 9 17 4 12" />
                                </svg>
                              )}
                            </span>
                          </div>

                          <div className="flex items-center justify-between text-[10.5px] pt-1.5 border-t border-[var(--vt-color-border-default,#E2E0EC)]/60">
                            <span className="font-bold text-[var(--vt-color-orange-700,#B33C08)]">
                              {proj.progressPercent}% verified
                            </span>
                            <span className="text-[var(--vt-color-neutral-400,#A3A0B8)] truncate max-w-[120px]">
                              {proj.contractor.name}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* STEP 2: Link Expiration Period */}
                <div>
                  <label className="block text-xs font-bold text-[var(--vt-color-indigo-900,#261A66)] mb-1.5">
                    2. Link Expiry
                  </label>
                  <div className="flex items-center gap-2">
                    {[
                      { label: "7 Days", value: 7 },
                      { label: "30 Days (Standard)", value: 30 },
                      { label: "90 Days", value: 90 },
                      { label: "Never Expires", value: null },
                    ].map((opt) => (
                      <button
                        key={opt.label}
                        type="button"
                        onClick={() => setExpiryOption(opt.value)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all cursor-pointer ${
                          expiryOption === opt.value
                            ? "bg-[var(--vt-color-indigo-900,#261A66)] text-white border-[var(--vt-color-indigo-900,#261A66)]"
                            : "bg-white text-[var(--vt-color-neutral-600,#5E5A7D)] border border-[var(--vt-color-border-default,#E2E0EC)] hover:border-[var(--vt-color-neutral-400,#A3A0B8)]"
                        }`}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* STEP 3: Optional Recipient Note / Email */}
                <div>
                  <label className="block text-xs font-bold text-[var(--vt-color-indigo-900,#261A66)] mb-1.5">
                    3. Recipient Note or Email (Optional)
                  </label>
                  <input
                    type="text"
                    value={recipientEmail}
                    onChange={(e) => setRecipientEmail(e.target.value)}
                    placeholder="e.g. For Uncle Emeka or uncle.emeka@gmail.com"
                    className="w-full h-9 px-3 rounded-lg bg-white border border-[var(--vt-color-border-default,#E2E0EC)] focus:border-[var(--vt-color-orange-500,#EF5F18)] text-xs text-[var(--vt-color-indigo-900,#261A66)] outline-none shadow-2xs"
                  />
                  <p className="text-[11px] text-[var(--vt-color-neutral-400,#A3A0B8)] mt-1">
                    Helps you remember who this link was given to in your active links manager.
                  </p>
                </div>

                {/* PRIMARY ACTION BUTTON: Generate Link */}
                <div className="pt-2">
                  <button
                    type="submit"
                    className="w-full h-10 rounded-xl bg-[var(--vt-color-orange-500,#EF5F18)] hover:bg-[var(--vt-color-orange-600,#D84C0B)] text-white text-xs font-bold transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2 cursor-pointer active:scale-[0.99]"
                  >
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
                      <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
                    </svg>
                    <span>Generate Share Link</span>
                  </button>
                </div>
              </form>
            )
          ) : (
            /* TAB 2: ACTIVE SHARE LINKS MANAGEMENT */
            <div className="flex flex-col gap-3">
              {shareLinks.filter((l) => !l.isRevoked).length === 0 ? (
                <div className="p-8 text-center bg-[var(--vt-color-neutral-50,#F7F7FA)] rounded-xl border border-dashed border-[var(--vt-color-border-default,#E2E0EC)]">
                  <p className="font-bold text-xs text-[var(--vt-color-indigo-900,#261A66)]">
                    No active share links
                  </p>
                  <p className="text-[11px] text-[var(--vt-color-neutral-500,#7C7894)] mt-1">
                    You haven&apos;t generated any live observer links yet.
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setRecentlyCreatedLink(null);
                      setActiveTab("create");
                    }}
                    className="mt-3 px-3 py-1.5 rounded-lg bg-[var(--vt-color-orange-500,#EF5F18)] text-white text-xs font-bold cursor-pointer"
                  >
                    Create a link now
                  </button>
                </div>
              ) : (
                shareLinks
                  .filter((l) => !l.isRevoked)
                  .map((link) => (
                    <div
                      key={link.id}
                      className="p-3.5 rounded-xl bg-white border border-[var(--vt-color-border-default,#E2E0EC)] flex flex-col gap-2.5 shadow-2xs"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <p className="font-bold text-xs text-[var(--vt-color-indigo-900,#261A66)]">
                            {link.projectTitle}
                          </p>
                          <p className="text-[10.5px] text-[var(--vt-color-neutral-500,#7C7894)] mt-0.5">
                            {link.projectLocation}
                          </p>
                        </div>
                        <span className="px-2 py-0.5 rounded-full bg-[var(--vt-color-green-50,#E9F6EC)] text-[var(--vt-color-green-700,#1F6B3E)] border border-[var(--vt-color-green-200,#BCE5C8)] text-[10px] font-bold">
                          Active · {link.viewsCount} views
                        </span>
                      </div>

                      <div className="p-2 rounded-lg bg-[var(--vt-color-neutral-50,#F7F7FA)] font-mono text-[10.5px] text-[var(--vt-color-neutral-700,#46425F)] flex items-center justify-between gap-2">
                        <span className="truncate">{origin || "https://vantaged.com"}{link.url}</span>
                        <div className="flex items-center gap-1.5 shrink-0">
                          <button
                            type="button"
                            onClick={() => handleCopyLink(`${origin || "https://vantaged.com"}${link.url}`)}
                            className="px-2 py-0.5 rounded bg-white hover:bg-[var(--vt-color-orange-50,#FFF4EE)] border border-[var(--vt-color-border-default,#E2E0EC)] text-[10px] font-bold text-[var(--vt-color-orange-700,#B33C08)] cursor-pointer"
                          >
                            Copy
                          </button>
                          <button
                            type="button"
                            onClick={() => handleSendToGmail(link)}
                            className="px-2 py-0.5 rounded bg-[#EA4335]/10 hover:bg-[#EA4335]/20 text-[#EA4335] text-[10px] font-bold cursor-pointer"
                          >
                            Gmail
                          </button>
                          <button
                            type="button"
                            onClick={() => handleOpenPreview(link.url)}
                            className="px-2 py-0.5 rounded bg-white hover:bg-[var(--vt-color-neutral-100,#EFEEF5)] border border-[var(--vt-color-border-default,#E2E0EC)] text-[10px] font-bold text-[var(--vt-color-indigo-900,#261A66)] cursor-pointer"
                          >
                            Open
                          </button>
                        </div>
                      </div>

                      <div className="flex items-center justify-between text-[10.5px] text-[var(--vt-color-neutral-500,#7C7894)] pt-1 border-t border-[var(--vt-color-border-default,#E2E0EC)]/60">
                        <span>
                          {link.recipientEmail ? `For: ${link.recipientEmail} · ` : ""}
                          Expires: <strong className="text-[var(--vt-color-indigo-900,#261A66)]">{link.expiryDateStr}</strong>
                        </span>

                        <button
                          type="button"
                          onClick={() => handleRevokeLink(link.id)}
                          className="font-bold text-[var(--vt-color-scarlet-600,#E11D48)] hover:underline cursor-pointer"
                        >
                          Revoke link
                        </button>
                      </div>
                    </div>
                  ))
              )}
            </div>
          )}
        </div>

        {/* ── Modal Footer ── */}
        <div className="px-5 sm:px-6 py-3 bg-[var(--vt-color-neutral-50,#F7F7FA)] border-t border-[var(--vt-color-border-default,#E2E0EC)] flex items-center justify-between text-xs">
          <span className="text-[11px] text-[var(--vt-color-neutral-500,#7C7894)]">
            Observer links update automatically as new stages get approved on site.
          </span>
          <button
            type="button"
            onClick={onClose}
            className="h-8 px-4 rounded-lg bg-[var(--vt-color-indigo-900,#261A66)] hover:bg-[var(--vt-color-indigo-950,#191142)] text-white font-bold transition-all cursor-pointer shadow-2xs"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
