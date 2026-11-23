"use client";

import React, { useState, useEffect, useMemo, useRef } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { DirectorSidebarNav } from "../components/DirectorSidebarNav";
import { DirectorHeaderBar } from "../components/DirectorHeaderBar";
import { useContractorUser } from "../hooks/useContractorUser";
import { useDirectorDemoMode } from "../hooks/useDirectorDemoMode";
import {
  CONTRACTOR_SYNC_EVENT,
  SHARED_SYNC_EVENT,
  SharedConversationThread,
  appendSharedMessage,
  markConversationRead,
  readSharedConversations,
} from "../../../shared/vantagedSyncBridge";

export function DirectorMessagesPage() {
  const searchParams = useSearchParams();
  const initialConvParam = searchParams?.get("conv") || null;
  const user = useContractorUser();
  const { isDemoMode } = useDirectorDemoMode();

  const [threads, setThreads] = useState<SharedConversationThread[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(initialConvParam);
  const [searchQuery, setSearchQuery] = useState("");
  const [inputText, setInputText] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const sync = () => {
      const all = readSharedConversations();
      setThreads(all);
      setSelectedId((prev) => {
        if (prev && all.some((t) => t.id === prev)) return prev;
        if (initialConvParam && all.some((t) => t.id === initialConvParam)) {
          return initialConvParam;
        }
        return all[0]?.id || null;
      });
    };
    sync();
    window.addEventListener(SHARED_SYNC_EVENT, sync);
    window.addEventListener(CONTRACTOR_SYNC_EVENT, sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener(SHARED_SYNC_EVENT, sync);
      window.removeEventListener(CONTRACTOR_SYNC_EVENT, sync);
      window.removeEventListener("storage", sync);
    };
  }, [initialConvParam]);

  const visibleThreads = useMemo(() => {
    const base = isDemoMode ? threads : threads.filter((t) => t.messages.length > 0);
    const q = searchQuery.trim().toLowerCase();
    if (!q) return base;
    return base.filter(
      (t) =>
        t.ownerName.toLowerCase().includes(q) ||
        t.projectTitle.toLowerCase().includes(q) ||
        t.lastMessage.toLowerCase().includes(q)
    );
  }, [threads, isDemoMode, searchQuery]);

  const activeThread = useMemo(() => {
    return (
      visibleThreads.find((t) => t.id === selectedId) ||
      visibleThreads[0] ||
      null
    );
  }, [visibleThreads, selectedId]);

  const handleSelectThread = (id: string) => {
    setSelectedId(id);
    const updated = markConversationRead(id, "contractor");
    setThreads(updated);
  };

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || !activeThread) return;

    const updated = appendSharedMessage({
      conversationId: activeThread.id,
      sender: "contractor",
      senderName: user.fullName || "Engr. Kenneth Adeleke",
      text: inputText.trim(),
    });
    setThreads(updated);
    setInputText("");

    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 80);
  };

  const totalUnread = useMemo(
    () => visibleThreads.reduce((acc, t) => acc + t.contractorUnreadCount, 0),
    [visibleThreads]
  );

  return (
    <div
      style={{ fontFamily: "'Outfit', var(--vt-font-sans), sans-serif" }}
      className="flex flex-col md:flex-row h-screen w-screen max-w-full max-h-full overflow-hidden bg-[var(--vt-color-background-subtle,#F7F7FA)] text-[var(--vt-color-text-default,#261A66)] select-none"
    >
      <DirectorSidebarNav currentActiveItem="messages" />

      <main className="flex-1 h-full max-h-screen overflow-hidden px-4 sm:px-6 lg:px-8 py-4 sm:py-5 flex flex-col gap-4 pb-20 md:pb-5">
        <DirectorHeaderBar />

        {/* Page Header */}
        <div className="flex flex-wrap items-center justify-between gap-3 shrink-0">
          <div>
            <div className="flex items-center gap-2.5">
              <h1 className="text-xl sm:text-2xl font-extrabold text-[var(--vt-color-indigo-900,#261A66)] tracking-tight">
                Client Messages
              </h1>
              {totalUnread > 0 && (
                <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-[var(--vt-color-orange-500,#EF5F18)] text-white">
                  {totalUnread} unread
                </span>
              )}
            </div>
            <p className="text-xs text-[var(--vt-color-neutral-500,#7C7894)] mt-0.5">
              Direct project conversations synced live with each Property Owner&apos;s inbox.
            </p>
          </div>
        </div>

        {/* Two-Pane Chat Layout */}
        {visibleThreads.length === 0 ? (
          <div className="flex-1 w-full bg-white rounded-2xl border border-dashed border-[var(--vt-color-border-default,#E2E0EC)] p-8 sm:p-14 shadow-2xs flex flex-col items-center justify-center text-center">
            <div className="w-16 h-16 rounded-2xl bg-[var(--vt-color-orange-50,#FFF4EE)] text-[var(--vt-color-orange-600,#D84C0B)] flex items-center justify-center mb-4 border border-[var(--vt-color-orange-200,#FDCAA9)] shadow-xs">
              <svg
                className="w-8 h-8"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
              </svg>
            </div>
            <h3 className="text-xl font-extrabold text-[var(--vt-color-indigo-900,#261A66)]">
              No Client Conversations Yet
            </h3>
            <p className="text-xs sm:text-sm text-[var(--vt-color-neutral-500,#7C7894)] max-w-md mt-2">
              Once a Property Owner accepts a project or sends a message, your shared conversation thread will appear here.
            </p>
          </div>
        ) : (
          <div className="flex-1 min-h-0 grid grid-cols-1 lg:grid-cols-12 gap-4 overflow-hidden">
            {/* Left Thread List */}
            <aside className="lg:col-span-4 bg-white rounded-2xl border border-[var(--vt-color-border-default,#E2E0EC)] shadow-2xs flex flex-col overflow-hidden min-h-0">
              <div className="p-3.5 border-b border-[var(--vt-color-neutral-100,#EFEEF5)] shrink-0">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search owner or project..."
                  className="w-full h-9 px-3 rounded-md bg-[var(--vt-color-neutral-50,#F7F7FA)] border border-[var(--vt-color-border-default,#E2E0EC)] focus:border-[var(--vt-color-orange-500,#EF5F18)] focus:bg-white text-xs text-[var(--vt-color-indigo-900,#261A66)] outline-none transition-all"
                />
              </div>

              <div className="flex-1 overflow-y-auto divide-y divide-[var(--vt-color-neutral-100,#EFEEF5)]">
                {visibleThreads.map((thread) => {
                  const isActive = activeThread?.id === thread.id;
                  const initials = thread.ownerName
                    .replace(/^(Dr\.|Engr\.|Chief|Alhaji|Mrs?\.?)\s+/i, "")
                    .split(/\s+/)
                    .slice(0, 2)
                    .map((p) => p.charAt(0).toUpperCase())
                    .join("");

                  return (
                    <button
                      key={thread.id}
                      type="button"
                      onClick={() => handleSelectThread(thread.id)}
                      className={`w-full text-left p-3.5 transition-colors flex items-start gap-3 cursor-pointer ${
                        isActive
                          ? "bg-[var(--vt-color-orange-50,#FFF4EE)]/70 border-l-3 border-l-[var(--vt-color-orange-500,#EF5F18)]"
                          : "hover:bg-[var(--vt-color-neutral-50,#F7F7FA)]"
                      }`}
                    >
                      <div className="w-10 h-10 rounded-full bg-[var(--vt-color-indigo-900,#261A66)] text-white flex items-center justify-center text-xs font-extrabold shrink-0">
                        {initials}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between gap-2">
                          <p className="text-xs font-extrabold text-[var(--vt-color-indigo-900,#261A66)] truncate">
                            {thread.ownerName}
                          </p>
                          <span className="text-[10px] font-semibold text-[var(--vt-color-neutral-400,#A3A0B8)] shrink-0">
                            {thread.lastMessageTime}
                          </span>
                        </div>
                        <p className="text-[11px] font-semibold text-[var(--vt-color-orange-600,#D84C0B)] truncate mt-0.5">
                          {thread.projectTitle}
                        </p>
                        <div className="flex items-center justify-between gap-2 mt-1">
                          <p className="text-[11px] text-[var(--vt-color-neutral-500,#7C7894)] truncate">
                            {thread.lastMessage}
                          </p>
                          {thread.contractorUnreadCount > 0 && (
                            <span className="px-1.5 py-0.5 rounded-full text-[10px] font-bold bg-[var(--vt-color-orange-500,#EF5F18)] text-white shrink-0">
                              {thread.contractorUnreadCount}
                            </span>
                          )}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </aside>

            {/* Right Active Chat */}
            <section className="lg:col-span-8 bg-white rounded-2xl border border-[var(--vt-color-border-default,#E2E0EC)] shadow-2xs flex flex-col overflow-hidden min-h-0">
              {activeThread ? (
                <>
                  {/* Chat Header */}
                  <div className="px-4 sm:px-5 py-3.5 border-b border-[var(--vt-color-neutral-100,#EFEEF5)] flex flex-wrap items-center justify-between gap-3 shrink-0 bg-white">
                    <div className="min-w-0">
                      <h2 className="text-sm font-extrabold text-[var(--vt-color-indigo-900,#261A66)] truncate">
                        {activeThread.ownerName}
                      </h2>
                      <p className="text-[11px] text-[var(--vt-color-neutral-500,#7C7894)] truncate">
                        Property Owner · {activeThread.projectTitle} · {activeThread.ownerPhone}
                      </p>
                    </div>
                    <Link
                      href={`/contractor/projects/${activeThread.projectId}`}
                      className="px-3 py-1.5 rounded-md bg-[var(--vt-color-neutral-50,#F7F7FA)] hover:bg-[var(--vt-color-orange-50,#FFF4EE)] border border-[var(--vt-color-border-default,#E2E0EC)] hover:border-[var(--vt-color-orange-300,#FBA674)] text-xs font-bold text-[var(--vt-color-indigo-900,#261A66)] hover:text-[var(--vt-color-orange-700,#B33C08)] transition-colors"
                    >
                      Open Project Workspace →
                    </Link>
                  </div>

                  {/* Messages Feed */}
                  <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-3 bg-[var(--vt-color-neutral-50,#F7F7FA)]/50 select-text">
                    {activeThread.messages.map((msg) => {
                      const isMe = msg.sender === "contractor";
                      return (
                        <div
                          key={msg.id}
                          className={`flex flex-col ${
                            isMe ? "items-end" : "items-start"
                          }`}
                        >
                          <div
                            className={`max-w-[82%] sm:max-w-[70%] rounded-2xl px-4 py-2.5 text-xs sm:text-sm leading-relaxed shadow-2xs ${
                              isMe
                                ? "bg-[var(--vt-color-indigo-900,#261A66)] text-white rounded-br-sm"
                                : "bg-white border border-[var(--vt-color-border-default,#E2E0EC)] text-[var(--vt-color-indigo-900,#261A66)] rounded-bl-sm"
                            }`}
                          >
                            <p
                              className={`text-[10px] font-bold mb-1 ${
                                isMe
                                  ? "text-white/75"
                                  : "text-[var(--vt-color-orange-600,#D84C0B)]"
                              }`}
                            >
                              {isMe ? "You (Company)" : msg.senderName}
                            </p>
                            <p className="whitespace-pre-wrap break-words">{msg.text}</p>
                          </div>
                          <span className="text-[10px] text-[var(--vt-color-neutral-400,#A3A0B8)] mt-1 px-1">
                            {msg.timestamp}
                            {isMe ? " · Sent to Owner" : ""}
                          </span>
                        </div>
                      );
                    })}
                    <div ref={messagesEndRef} />
                  </div>

                  {/* Composer */}
                  <form
                    onSubmit={handleSend}
                    className="p-3.5 border-t border-[var(--vt-color-neutral-100,#EFEEF5)] bg-white flex items-center gap-2.5 shrink-0"
                  >
                    <input
                      type="text"
                      value={inputText}
                      onChange={(e) => setInputText(e.target.value)}
                      placeholder={`Reply to ${activeThread.ownerName}...`}
                      className="flex-1 h-10 px-3.5 rounded-md bg-[var(--vt-color-neutral-50,#F7F7FA)] border border-[var(--vt-color-border-default,#E2E0EC)] focus:border-[var(--vt-color-orange-500,#EF5F18)] focus:bg-white text-xs sm:text-sm text-[var(--vt-color-indigo-900,#261A66)] outline-none transition-all"
                    />
                    <button
                      type="submit"
                      disabled={!inputText.trim()}
                      className="h-10 px-4 rounded-md bg-[var(--vt-color-orange-500,#EF5F18)] hover:bg-[var(--vt-color-orange-600,#D84C0B)] disabled:opacity-40 text-white text-xs font-bold transition-colors cursor-pointer shrink-0"
                    >
                      Send Message
                    </button>
                  </form>
                </>
              ) : null}
            </section>
          </div>
        )}
      </main>
    </div>
  );
}
