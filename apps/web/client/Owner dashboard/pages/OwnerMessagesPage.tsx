"use client";

import React, { useState, useEffect, useMemo, useRef, useCallback } from "react";
import Link from "next/link";
import { SidebarNav } from "../components/SidebarNav";
import { HeaderBar } from "../components/HeaderBar";
import { useScrollRestoration } from "../hooks/useScrollRestoration";
import { useDemoMode } from "../hooks/useDemoMode";
import { useOwnerSubscription } from "../hooks/useOwnerSubscription";
import {
  CONTRACTOR_SYNC_EVENT,
  SHARED_SYNC_EVENT,
  appendSharedMessage,
  markConversationRead,
  readSharedConversations,
} from "../../../shared/vantagedSyncBridge";

export interface MessageItem {
  id: string;
  sender: "owner" | "counterpart";
  senderName: string;
  avatar?: string;
  text: string;
  timestamp: string;
  status: "sent" | "delivered" | "read";
  mediaUrl?: string;
  mediaType?: "image" | "file";
}

export interface ConversationItem {
  id: string;
  counterpartName: string;
  counterpartRole: string;
  counterpartCompany: string;
  avatar: string;
  isOnline: boolean;
  projectTitle: string;
  projectId: string;
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
  phone: string;
  messages: MessageItem[];
}

const INITIAL_CONVERSATIONS: ConversationItem[] = [
  {
    id: "conv-1",
    counterpartName: "Engr. Kenneth Adeleke",
    counterpartRole: "Lead Site Engineer",
    counterpartCompany: "Julius B. Consortium",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&h=120&fit=crop&crop=face",
    isOnline: true,
    projectTitle: "Lekki Phase 1 Luxury Villa",
    projectId: "proj-lekki",
    lastMessage: "Good day sir, the concrete slump test reports for the first floor deck have been uploaded.",
    lastMessageTime: "09:42 AM",
    unreadCount: 1,
    phone: "+234 803 219 0042",
    messages: [
      {
        id: "msg-1",
        sender: "counterpart",
        senderName: "Engr. Kenneth Adeleke",
        avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&h=120&fit=crop&crop=face",
        text: "Good morning Alhaji. We commenced the rebar placement for the cantilever beams at 07:30 WAT.",
        timestamp: "08:15 AM",
        status: "read",
      },
      {
        id: "msg-2",
        sender: "owner",
        senderName: "Owner",
        text: "Good morning Engr. Adeleke. Please confirm the batch of Dangote 42.5R cement delivery was verified at the gate.",
        timestamp: "08:22 AM",
        status: "read",
      },
      {
        id: "msg-3",
        sender: "counterpart",
        senderName: "Engr. Kenneth Adeleke",
        avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&h=120&fit=crop&crop=face",
        text: "Yes, verified 100%. Gate pass #WP-2092 logged by security. All 600 bags are stacked off-ground in the dry shed.",
        timestamp: "08:35 AM",
        status: "read",
      },
      {
        id: "msg-4",
        sender: "counterpart",
        senderName: "Engr. Kenneth Adeleke",
        avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&h=120&fit=crop&crop=face",
        text: "Good day sir, the concrete slump test reports for the first floor deck have been uploaded.",
        timestamp: "09:42 AM",
        status: "delivered",
      },
    ],
  },
  {
    id: "conv-2",
    counterpartName: "Arc. Amina Yusuf",
    counterpartRole: "Design Architect & Client Rep",
    counterpartCompany: "Amina Yusuf Studio",
    avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=120&h=120&fit=crop&crop=face",
    isOnline: false,
    projectTitle: "Lekki Phase 1 Luxury Villa",
    projectId: "proj-lekki",
    lastMessage: "I inspected the soundproofing membranes yesterday. Excellent craftsmanship.",
    lastMessageTime: "Yesterday",
    unreadCount: 0,
    phone: "+234 809 445 1092",
    messages: [
      {
        id: "msg-201",
        sender: "counterpart",
        senderName: "Arc. Amina Yusuf",
        text: "Good day. I reviewed the revised window schedule submitted by the aluminum glazier.",
        timestamp: "Yesterday, 03:10 PM",
        status: "read",
      },
      {
        id: "msg-202",
        sender: "counterpart",
        senderName: "Arc. Amina Yusuf",
        text: "I inspected the soundproofing membranes yesterday. Excellent craftsmanship.",
        timestamp: "Yesterday, 04:45 PM",
        status: "read",
      },
    ],
  },
];

export function OwnerMessagesPage() {
  const scrollRef = useScrollRestoration<HTMLElement>("owner_messages");
  const { isDemoMode } = useDemoMode();
  const subscription = useOwnerSubscription();

  const getSourceConversations = useCallback((): ConversationItem[] => {
    const shared = readSharedConversations().map(
      (t): ConversationItem => ({
        id: t.id,
        counterpartName: t.contractorName,
        counterpartRole: t.contractorRole,
        counterpartCompany: t.contractorCompany,
        avatar: t.avatar,
        isOnline: t.isOnline,
        projectTitle: t.projectTitle,
        projectId: t.projectId,
        lastMessage: t.lastMessage,
        lastMessageTime: t.lastMessageTime,
        unreadCount: t.ownerUnreadCount,
        phone: t.contractorPhone,
        messages: t.messages.map((m) => ({
          id: m.id,
          sender: m.sender === "owner" ? "owner" : "counterpart",
          senderName: m.senderName,
          avatar: m.sender === "contractor" ? t.avatar : undefined,
          text: m.text,
          timestamp: m.timestamp,
          status: m.status,
        })),
      })
    );

    if (!isDemoMode) {
      return shared.filter((c) => c.messages.some((m) => m.timestamp === "Just now"));
    }
    if (subscription.tierId === "owner-private") {
      return shared.filter((c) => c.projectId === "proj-lekki");
    }
    return shared;
  }, [isDemoMode, subscription.tierId]);

  const [conversations, setConversations] = useState<ConversationItem[]>([]);
  const [selectedConvId, setSelectedConvId] = useState<string | null>(null);
  const [inputText, setInputText] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const sync = () => {
      const updated = getSourceConversations();
      setConversations(updated);
      setSelectedConvId((prev) => {
        if (prev && updated.some((c) => c.id === prev)) return prev;
        return updated[0]?.id || null;
      });
    };
    sync();
    window.addEventListener(SHARED_SYNC_EVENT, sync);
    window.addEventListener(CONTRACTOR_SYNC_EVENT, sync);
    window.addEventListener("vantaged_demo_toggle", sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener(SHARED_SYNC_EVENT, sync);
      window.removeEventListener(CONTRACTOR_SYNC_EVENT, sync);
      window.removeEventListener("vantaged_demo_toggle", sync);
      window.removeEventListener("storage", sync);
    };
  }, [getSourceConversations]);

  const activeConversation = useMemo(() => {
    return conversations.find((c) => c.id === selectedConvId) || conversations[0] || null;
  }, [conversations, selectedConvId]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || !activeConversation) return;

    appendSharedMessage({
      conversationId: activeConversation.id,
      sender: "owner",
      senderName: "Property Owner",
      text: inputText.trim(),
    });
    markConversationRead(activeConversation.id, "owner");
    setConversations(getSourceConversations());
    setInputText("");

    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  };

  return (
    <div
      style={{ fontFamily: "'Outfit', var(--vt-font-sans), sans-serif" }}
      className="flex flex-col md:flex-row h-screen w-screen max-w-full max-h-full overflow-hidden bg-[var(--vt-color-background-subtle,#F7F7FA)] text-[var(--vt-color-text-default,#261A66)] select-none"
    >
      {/* ── Left Sidebar Navigation ── */}
      <SidebarNav currentActiveItem="messages" />

      {/* ── Main Workspace ── */}
      <main ref={scrollRef} className="flex-1 h-full max-h-screen overflow-hidden px-4 sm:px-6 lg:px-8 py-4 sm:py-5 flex flex-col gap-4 pb-20 md:pb-5">
        {/* Top Header Bar */}
        <HeaderBar
          leftSlot={
            <Link
              href="/owner/dashboard"
              title="Back to Dashboard"
              className="w-8 h-8 rounded-lg bg-white hover:bg-[var(--vt-color-orange-50,#FFF4EE)] border border-[var(--vt-color-border-default,#E2E0EC)] hover:border-[var(--vt-color-orange-300,#FBA674)] text-[var(--vt-color-indigo-900,#261A66)] hover:text-[var(--vt-color-orange-700,#B33C08)] flex items-center justify-center transition-all shadow-2xs cursor-pointer"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="19" y1="12" x2="5" y2="12" />
                <polyline points="12 19 5 12 12 5" />
              </svg>
            </Link>
          }
        />

        {/* ── Page Title Row ── */}
        <div className="flex items-center justify-between gap-3 shrink-0">
          <div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-[var(--vt-color-indigo-900,#261A66)] tracking-tight">
              Contractor & Rep Messages
            </h1>
            <p className="text-xs text-[var(--vt-color-neutral-500,#7C7894)] mt-0.5">
              Direct, encrypted messaging with lead site engineers and client representatives.
            </p>
          </div>
        </div>

        {/* ── Layout: Two-Pane Chat or Empty State ── */}
        {conversations.length === 0 ? (
          <div className="flex-1 w-full bg-white rounded-2xl border border-dashed border-[var(--vt-color-border-default,#E2E0EC)] p-8 sm:p-14 shadow-2xs flex flex-col items-center justify-center text-center">
            <div className="w-16 h-16 rounded-2xl bg-[var(--vt-color-orange-50,#FFF4EE)] text-[var(--vt-color-orange-600,#D84C0B)] flex items-center justify-center mb-4 border border-[var(--vt-color-orange-200,#FDCAA9)] shadow-xs">
              <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
              </svg>
            </div>
            <h3 className="text-xl sm:text-2xl font-extrabold text-[var(--vt-color-indigo-900,#261A66)]">
              No Messages Yet
            </h3>
            <p className="text-xs sm:text-sm text-[var(--vt-color-neutral-500,#7C7894)] max-w-md mt-2 leading-relaxed">
              You haven't started any conversations with builders or site representatives yet. When you request a proposal from a contractor or appoint a representative, your live chat will appear here.
            </p>
            <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
              <Link
                href="/owner/find-companies"
                className="h-9 px-4 rounded-md bg-[var(--vt-color-orange-500,#EF5F18)] hover:bg-[var(--vt-color-orange-600,#D84C0B)] text-white text-xs font-bold transition-all shadow-[0_2px_8px_rgba(239,95,24,0.3)] hover:shadow-[0_4px_14px_rgba(239,95,24,0.4)] flex items-center gap-1.5 font-sans cursor-pointer"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <line x1="12" y1="5" x2="12" y2="19" />
                  <line x1="5" y1="12" x2="19" y2="12" />
                </svg>
                <span>Find Verified Builders</span>
              </Link>
              <Link
                href="/owner/client-reps"
                className="h-9 px-3.5 rounded-md bg-white hover:bg-[var(--vt-color-neutral-50,#F7F7FA)] border border-[var(--vt-color-border-default,#E2E0EC)] text-xs font-bold text-[var(--vt-color-indigo-900,#261A66)] flex items-center gap-2 shadow-2xs transition-all cursor-pointer active:scale-98 font-sans"
              >
                <span>View Appointed Representatives</span>
              </Link>
            </div>
          </div>
        ) : (
          <div className="flex-1 min-h-0 bg-white rounded-2xl border border-[var(--vt-color-border-default,#E2E0EC)] shadow-2xs overflow-hidden flex flex-col md:flex-row">
            {/* Left Column: Conversations List */}
            <div className="w-full md:w-80 lg:w-96 border-r border-[var(--vt-color-border-default,#E2E0EC)] flex flex-col h-full bg-[var(--vt-color-neutral-50,#F7F7FA)]/40 shrink-0">
              <div className="p-3.5 border-b border-[var(--vt-color-border-default,#E2E0EC)] bg-white">
                <input
                  type="text"
                  placeholder="Search conversations..."
                  className="w-full h-8.5 px-3 rounded-lg bg-[var(--vt-color-neutral-50,#F7F7FA)] border border-[var(--vt-color-border-default,#E2E0EC)] text-xs text-[var(--vt-color-indigo-900,#261A66)] placeholder:text-[var(--vt-color-neutral-400,#A3A0B8)] outline-none focus:border-[var(--vt-color-orange-500,#EF5F18)] transition-all"
                />
              </div>

              <div className="flex-1 overflow-y-auto divide-y divide-[var(--vt-color-border-default,#E2E0EC)]/70">
                {conversations.map((conv) => {
                  const isSelected = activeConversation?.id === conv.id;
                  return (
                    <div
                      key={conv.id}
                      onClick={() => setSelectedConvId(conv.id)}
                      className={`p-3.5 flex items-start gap-3 transition-colors cursor-pointer ${
                        isSelected
                          ? "bg-[var(--vt-color-orange-50,#FFF4EE)] border-l-4 border-l-[var(--vt-color-orange-500,#EF5F18)]"
                          : "hover:bg-white"
                      }`}
                    >
                      <div className="relative shrink-0">
                        <img
                          src={conv.avatar}
                          alt={conv.counterpartName}
                          className="w-11 h-11 rounded-full object-cover border border-white shadow-2xs"
                        />
                        {conv.isOnline && (
                          <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-[var(--vt-color-green-500,#2E9E57)] ring-2 ring-white" />
                        )}
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between gap-1">
                          <h4 className="text-xs font-bold text-[var(--vt-color-indigo-900,#261A66)] truncate">
                            {conv.counterpartName}
                          </h4>
                          <span className="text-[10px] text-[var(--vt-color-neutral-400,#A3A0B8)] whitespace-nowrap">
                            {conv.lastMessageTime}
                          </span>
                        </div>
                        <p className="text-[11px] font-semibold text-[var(--vt-color-orange-600,#D84C0B)] truncate">
                          {conv.projectTitle}
                        </p>
                        <p className="text-[11px] text-[var(--vt-color-neutral-500,#7C7894)] truncate mt-0.5">
                          {conv.lastMessage}
                        </p>
                      </div>

                      {conv.unreadCount > 0 && (
                        <span className="w-4.5 h-4.5 rounded-full bg-[var(--vt-color-orange-500,#EF5F18)] text-white text-[10px] font-bold flex items-center justify-center shrink-0">
                          {conv.unreadCount}
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Right Column: Active Conversation Pane */}
            {activeConversation ? (
              <div className="flex-1 flex flex-col h-full bg-white min-w-0">
                {/* Chat Header */}
                <div className="p-3.5 sm:p-4 border-b border-[var(--vt-color-border-default,#E2E0EC)] flex items-center justify-between gap-3 shrink-0 bg-white">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="relative shrink-0">
                      <img
                        src={activeConversation.avatar}
                        alt={activeConversation.counterpartName}
                        className="w-10 h-10 rounded-full object-cover border border-[var(--vt-color-border-default,#E2E0EC)]"
                      />
                      {activeConversation.isOnline && (
                        <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-[var(--vt-color-green-500,#2E9E57)] ring-1.5 ring-white" />
                      )}
                    </div>
                    <div className="min-w-0">
                      <h3 className="text-sm font-bold text-[var(--vt-color-indigo-900,#261A66)] leading-tight truncate">
                        {activeConversation.counterpartName}
                      </h3>
                      <p className="text-[11px] text-[var(--vt-color-neutral-500,#7C7894)] truncate">
                        {activeConversation.counterpartRole} · {activeConversation.counterpartCompany}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-1 rounded-md text-[11px] font-bold bg-[var(--vt-color-orange-50,#FFF4EE)] text-[var(--vt-color-orange-700,#B33C08)] border border-[var(--vt-color-orange-200,#FDCAA9)] hidden sm:inline-block">
                      {activeConversation.projectTitle}
                    </span>
                    <a
                      href={`tel:${activeConversation.phone}`}
                      className="w-8 h-8 rounded-lg bg-[var(--vt-color-neutral-50,#F7F7FA)] hover:bg-[var(--vt-color-orange-50,#FFF4EE)] border border-[var(--vt-color-border-default,#E2E0EC)] text-[var(--vt-color-indigo-900,#261A66)] hover:text-[var(--vt-color-orange-600,#D84C0B)] flex items-center justify-center transition-colors"
                      title="Call"
                    >
                      <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                      </svg>
                    </a>
                  </div>
                </div>

                {/* Messages Body */}
                <div className="flex-1 overflow-y-auto p-4 sm:p-5 flex flex-col gap-3 bg-[var(--vt-color-neutral-50,#F7F7FA)]/30">
                  {activeConversation.messages.map((msg) => {
                    const isOwner = msg.sender === "owner";
                    return (
                      <div
                        key={msg.id}
                        className={`flex flex-col max-w-[80%] sm:max-w-[70%] ${
                          isOwner ? "self-end items-end" : "self-start items-start"
                        }`}
                      >
                        <div
                          className={`p-3 sm:p-3.5 rounded-2xl text-xs sm:text-[13px] leading-relaxed shadow-2xs ${
                            isOwner
                              ? "bg-[var(--vt-color-orange-500,#EF5F18)] text-white rounded-br-none"
                              : "bg-white text-[var(--vt-color-indigo-900,#261A66)] border border-[var(--vt-color-border-default,#E2E0EC)] rounded-bl-none"
                          }`}
                        >
                          {msg.text}
                        </div>
                        <div className="flex items-center gap-1.5 mt-1 px-1 text-[10px] text-[var(--vt-color-neutral-400,#A3A0B8)] font-medium">
                          <span>{msg.timestamp}</span>
                          {isOwner && (
                            <span>{msg.status === "read" ? "✓✓" : "✓"}</span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                  <div ref={messagesEndRef} />
                </div>

                {/* Chat Input Bar */}
                <form
                  onSubmit={handleSendMessage}
                  className="p-3 sm:p-4 border-t border-[var(--vt-color-border-default,#E2E0EC)] bg-white flex items-center gap-2"
                >
                  <input
                    type="text"
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    placeholder="Type a message or milestone request..."
                    className="flex-1 h-10 px-3.5 rounded-xl bg-[var(--vt-color-neutral-50,#F7F7FA)] border border-[var(--vt-color-border-default,#E2E0EC)] text-xs text-[var(--vt-color-indigo-900,#261A66)] placeholder:text-[var(--vt-color-neutral-400,#A3A0B8)] outline-none focus:border-[var(--vt-color-orange-500,#EF5F18)] transition-all font-sans"
                  />
                  <button
                    type="submit"
                    className="h-10 px-4 rounded-xl bg-[var(--vt-color-orange-500,#EF5F18)] hover:bg-[var(--vt-color-orange-600,#D84C0B)] text-white text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
                  >
                    <span>Send</span>
                    <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <line x1="22" y1="2" x2="11" y2="13" />
                      <polygon points="22 2 15 22 11 13 2 9 22 2" />
                    </svg>
                  </button>
                </form>
              </div>
            ) : null}
          </div>
        )}
      </main>
    </div>
  );
}
