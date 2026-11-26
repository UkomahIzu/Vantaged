"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  broadcastPortalSync,
  pushCompanyLiveNotification,
  pushOwnerLiveNotification,
  SHARED_SYNC_EVENT,
} from "./vantagedSyncBridge";
import {
  IconCheck,
  IconClock,
  IconMessage,
  IconSend,
  IconShieldCheck,
} from "../client/Owner dashboard/pages/projects dashboard/ProjectIcons";

export interface ProposalChatMessage {
  id: string;
  sender: "owner" | "company";
  senderName: string;
  text: string;
  timestamp: string;
}

interface ProposalNegotiationChatProps {
  requestId: string;
  planId?: string;
  currentRole: "owner" | "company";
  currentUserName: string;
  counterpartyName: string;
  projectTitle: string;
  ownerId?: string;
  ownerEmail?: string;
  companyId?: string;
  companyName?: string;
  compact?: boolean;
}

const OWNER_QUICK_PROMPTS = [
  "Can we review the total contract price?",
  "Can we adjust the 10% mobilization deposit?",
  "Please clarify materials included in Stage 1.",
];

const COMPANY_QUICK_PROMPTS = [
  "We can review the quote — what budget works for you?",
  "I have updated the milestone plan and pricing.",
  "All structural materials and lab tests are included.",
];

function getInitials(name: string): string {
  return (
    name
      .trim()
      .split(/\s+/)
      .slice(0, 2)
      .map((part) => part[0]?.toUpperCase() || "")
      .join("") || "VT"
  );
}

export function ProposalNegotiationChat({
  requestId,
  planId,
  currentRole,
  currentUserName,
  counterpartyName,
  projectTitle,
  ownerId,
  ownerEmail,
  companyId,
  companyName,
  compact = false,
}: ProposalNegotiationChatProps) {
  const storageKey = `vantaged_proposal_chat_${planId || requestId}`;
  const [messages, setMessages] = useState<ProposalChatMessage[]>([]);
  const [draft, setDraft] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [resolvedMeta, setResolvedMeta] = useState<{
    requestId: string;
    planId?: string;
    ownerId?: string;
    ownerEmail?: string;
    companyId?: string;
    companyName?: string;
  }>({
    requestId,
    planId,
    ownerId,
    ownerEmail,
    companyId,
    companyName,
  });
  const bottomRef = useRef<HTMLDivElement | null>(null);

  const loadMessages = useCallback(async () => {
    let localMsgs: ProposalChatMessage[] = [];
    if (typeof window !== "undefined") {
      try {
        const raw = localStorage.getItem(storageKey);
        if (raw) {
          const parsed = JSON.parse(raw);
          if (Array.isArray(parsed)) localMsgs = parsed;
        }
      } catch {}
    }

    try {
      const query = planId
        ? `planId=${encodeURIComponent(planId)}`
        : `id=${encodeURIComponent(requestId)}`;
      const res = await fetch(`/api/project-requests?${query}`, { cache: "no-store" });
      if (res.ok) {
        const json = await res.json();
        const match = Array.isArray(json?.data) ? json.data[0] : null;
        if (match) {
          setResolvedMeta((prev) => ({
            requestId: match.id || prev.requestId,
            planId: match.planId || prev.planId,
            ownerId: match.ownerId || prev.ownerId,
            ownerEmail: match.ownerEmail || match.ownerIdentifier || prev.ownerEmail,
            companyId: match.companyId || prev.companyId,
            companyName: match.companyName || prev.companyName,
          }));
        }
        const remoteMsgs: ProposalChatMessage[] = Array.isArray(match?.negotiationMessages)
          ? match.negotiationMessages
          : [];

        const byId = new Map<string, ProposalChatMessage>();
        for (const m of remoteMsgs) byId.set(m.id, m);
        for (const m of localMsgs) {
          if (!byId.has(m.id)) byId.set(m.id, m);
        }
        const merged = Array.from(byId.values());
        setMessages(merged);
        if (typeof window !== "undefined" && merged.length > 0) {
          try {
            localStorage.setItem(storageKey, JSON.stringify(merged));
          } catch {}
        }
        return;
      }
    } catch {}

    if (localMsgs.length > 0) {
      setMessages(localMsgs);
    }
  }, [requestId, planId, storageKey]);

  useEffect(() => {
    loadMessages();
    const interval = setInterval(loadMessages, 4000);
    window.addEventListener(SHARED_SYNC_EVENT, loadMessages);
    window.addEventListener("storage", loadMessages);
    return () => {
      clearInterval(interval);
      window.removeEventListener(SHARED_SYNC_EVENT, loadMessages);
      window.removeEventListener("storage", loadMessages);
    };
  }, [loadMessages]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }, [messages.length]);

  const sendMessage = async (textOverride?: string) => {
    const text = (textOverride ?? draft).trim();
    if (!text || isSending) return;

    const newMsg: ProposalChatMessage = {
      id: `pmsg-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      sender: currentRole,
      senderName:
        currentUserName ||
        (currentRole === "company" ? "Project Director" : "Property Owner"),
      text,
      timestamp: new Date().toLocaleTimeString("en-NG", {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };

    setIsSending(true);
    setDraft("");

    const optimistic = [...messages, newMsg];
    setMessages(optimistic);
    if (typeof window !== "undefined") {
      try {
        localStorage.setItem(storageKey, JSON.stringify(optimistic));
      } catch {}
    }

    try {
      await fetch("/api/project-requests", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: resolvedMeta.requestId || requestId,
          ...(resolvedMeta.planId || planId
            ? { planId: resolvedMeta.planId || planId }
            : {}),
          upsert: true,
          title: projectTitle,
          appendMessage: newMsg,
        }),
      });

      // Push live unread notification alert to the counterparty with deep link straight to the Plan & Contract thread
      const effectiveReqId = resolvedMeta.requestId || requestId;
      const effectivePlanId = resolvedMeta.planId || planId || `prop-${effectiveReqId}`;
      const senderLabel = newMsg.senderName;
      if (currentRole === "owner") {
        pushCompanyLiveNotification({
          targetCompanyId: companyId || resolvedMeta.companyId,
          targetCompanyName: companyName || resolvedMeta.companyName || counterpartyName,
          category: "request",
          projectTitle,
          title: `Price Negotiation Message from ${senderLabel}`,
          description: text.length > 120 ? `${text.slice(0, 120)}...` : text,
          href: `/contractor/requests/${effectiveReqId}/plan`,
        });
      } else {
        pushOwnerLiveNotification({
          targetOwnerId: ownerId || resolvedMeta.ownerId,
          targetOwnerIdentifier: ownerEmail || resolvedMeta.ownerEmail,
          category: "site",
          projectTitle,
          title: `Price Negotiation Reply from ${senderLabel}`,
          description: text.length > 120 ? `${text.slice(0, 120)}...` : text,
          linkUrl: `/owner/projects/${effectivePlanId}/plan`,
        });
      }

      broadcastPortalSync();
    } catch {} finally {
      setIsSending(false);
    }
  };

  const quickPrompts =
    currentRole === "owner" ? OWNER_QUICK_PROMPTS : COMPANY_QUICK_PROMPTS;

  return (
    <div className="bg-white rounded-2xl border border-[var(--vt-color-border-default,#E2E0EC)] shadow-2xs overflow-hidden flex flex-col font-sans">
      {/* Executive Negotiation Header */}
      <div className="px-4 sm:px-5 py-3.5 bg-gradient-to-r from-[var(--vt-color-neutral-50,#F7F7FA)] via-white to-[var(--vt-color-orange-50,#FFF4EE)]/40 border-b border-[var(--vt-color-border-default,#E2E0EC)] flex items-center justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-9 h-9 rounded-xl bg-[var(--vt-color-orange-50,#FFF4EE)] text-[var(--vt-color-orange-600,#D84C0B)] border border-[var(--vt-color-orange-200,#FDCAA9)] flex items-center justify-center shrink-0 shadow-2xs">
            <IconMessage className="w-4 h-4" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h4 className="text-xs sm:text-sm font-black text-[var(--vt-color-indigo-900,#261A66)] tracking-tight truncate">
                Contract Price &amp; Stage Negotiation
              </h4>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-[var(--vt-color-orange-50,#FFF4EE)] text-[var(--vt-color-orange-700,#B33C08)] border border-[var(--vt-color-orange-200,#FDCAA9)] shrink-0">
                <span>{messages.length}</span>
                <span>{messages.length === 1 ? "message" : "messages"}</span>
              </span>
            </div>
            <p className="text-[11px] text-[var(--vt-color-neutral-500,#7C7894)] truncate mt-0.5">
              Direct pre-contract thread with <strong className="text-[var(--vt-color-indigo-900,#261A66)]">{counterpartyName}</strong>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <span className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[var(--vt-color-green-50,#E9F6EC)] border border-[var(--vt-color-green-200,#A3D9B1)] text-[10.5px] font-bold text-[var(--vt-color-green-700,#1F6B3E)]">
            <IconShieldCheck className="w-3.5 h-3.5" />
            <span>Logged to Audit Trail</span>
          </span>
          <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded-lg bg-[var(--vt-color-neutral-100,#EFEEF5)] text-[10px] font-bold text-[var(--vt-color-indigo-900,#261A66)]">
            <span className="w-1.5 h-1.5 rounded-full bg-[var(--vt-color-green-500,#2E9E57)] animate-pulse" />
            <span>Live</span>
          </span>
        </div>
      </div>

      {/* Messages Feed */}
      <div
        className={`p-4 overflow-y-auto flex flex-col gap-3 bg-[var(--vt-color-neutral-50,#F7F7FA)]/60 ${
          compact ? "max-h-52 min-h-[135px]" : "max-h-72 min-h-[175px]"
        }`}
      >
        {messages.length === 0 ? (
          <div className="my-auto text-center py-5 px-3 flex flex-col items-center">
            <div className="w-10 h-10 rounded-2xl bg-white border border-[var(--vt-color-border-default,#E2E0EC)] text-[var(--vt-color-orange-500,#EF5F18)] flex items-center justify-center mb-2 shadow-2xs">
              <IconMessage className="w-4 h-4" />
            </div>
            <p className="text-xs font-extrabold text-[var(--vt-color-indigo-900,#261A66)]">
              Discuss Pricing, Deposit &amp; Stage Milestones
            </p>
            <p className="text-[11px] text-[var(--vt-color-neutral-500,#7C7894)] mt-0.5 max-w-md leading-relaxed">
              Send a message below or tap a quick prompt to negotiate the proposed contract price and stage weights with {counterpartyName} before locking the agreement.
            </p>
          </div>
        ) : (
          messages.map((msg) => {
            const isMine = msg.sender === currentRole;
            const senderLabel = isMine ? currentUserName || "You" : msg.senderName;
            return (
              <div
                key={msg.id}
                className={`flex items-end gap-2.5 max-w-[88%] ${
                  isMine ? "self-end flex-row-reverse" : "self-start"
                }`}
              >
                <div
                  className={`w-7 h-7 rounded-lg text-[10px] font-black flex items-center justify-center shrink-0 shadow-2xs ${
                    isMine
                      ? "bg-[var(--vt-color-orange-500,#EF5F18)] text-white"
                      : "bg-[var(--vt-color-indigo-900,#261A66)] text-white"
                  }`}
                >
                  {getInitials(senderLabel)}
                </div>

                <div className={`flex flex-col ${isMine ? "items-end" : "items-start"}`}>
                  <div className="flex items-center gap-1.5 text-[10px] font-semibold text-[var(--vt-color-neutral-400,#A3A0B8)] mb-1 px-1">
                    <span className="font-bold text-[var(--vt-color-neutral-600,#5E5A7D)]">
                      {isMine ? "You" : msg.senderName}
                    </span>
                    <span>•</span>
                    <span className="inline-flex items-center gap-1">
                      <IconClock className="w-2.5 h-2.5" />
                      <span>{msg.timestamp}</span>
                    </span>
                  </div>

                  <div
                    className={`px-3.5 py-2.5 rounded-2xl text-xs leading-relaxed shadow-2xs ${
                      isMine
                        ? "bg-[var(--vt-color-indigo-900,#261A66)] text-white rounded-br-xs"
                        : "bg-white border border-[var(--vt-color-border-default,#E2E0EC)] text-[var(--vt-color-indigo-900,#261A66)] rounded-bl-xs"
                    }`}
                  >
                    {msg.text}
                  </div>
                </div>
              </div>
            );
          })
        )}
        <div ref={bottomRef} />
      </div>

      {/* Quick Prompt Chips */}
      <div className="px-4 py-2 bg-white border-t border-[var(--vt-color-neutral-100,#EFEEF5)] flex items-center gap-1.5 overflow-x-auto">
        <span className="text-[10px] font-extrabold uppercase tracking-wider text-[var(--vt-color-neutral-400,#A3A0B8)] shrink-0 mr-1">
          Quick Ask:
        </span>
        {quickPrompts.map((prompt) => (
          <button
            key={prompt}
            type="button"
            onClick={() => sendMessage(prompt)}
            className="shrink-0 px-2.5 py-1 rounded-lg bg-[var(--vt-color-neutral-50,#F7F7FA)] hover:bg-[var(--vt-color-orange-50,#FFF4EE)] border border-[var(--vt-color-border-default,#E2E0EC)] hover:border-[var(--vt-color-orange-200,#FDCAA9)] text-[11px] font-semibold text-[var(--vt-color-neutral-600,#5E5A7D)] hover:text-[var(--vt-color-orange-700,#B33C08)] transition-colors cursor-pointer inline-flex items-center gap-1"
          >
            <IconCheck className="w-3 h-3 text-[var(--vt-color-orange-500,#EF5F18)]" />
            <span>{prompt}</span>
          </button>
        ))}
      </div>

      {/* Composer */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          sendMessage();
        }}
        className="p-3 sm:px-4 bg-white border-t border-[var(--vt-color-neutral-100,#EFEEF5)] flex items-center gap-2.5"
      >
        <input
          type="text"
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          placeholder={`Write a message to ${counterpartyName} about pricing, deposit, or stages...`}
          className="flex-1 h-10 px-3.5 rounded-xl bg-[var(--vt-color-neutral-50,#F7F7FA)] border border-[var(--vt-color-border-default,#E2E0EC)] focus:bg-white focus:border-[var(--vt-color-orange-500,#EF5F18)] text-xs font-medium text-[var(--vt-color-indigo-900,#261A66)] outline-none transition-all"
        />
        <button
          type="submit"
          disabled={!draft.trim() || isSending}
          className="h-10 px-4 rounded-xl bg-[var(--vt-color-orange-500,#EF5F18)] hover:bg-[var(--vt-color-orange-600,#D84C0B)] disabled:opacity-45 text-white text-xs font-bold transition-all cursor-pointer shrink-0 shadow-2xs inline-flex items-center gap-1.5"
        >
          <IconSend className="w-3.5 h-3.5" />
          <span>Send</span>
        </button>
      </form>
    </div>
  );
}
