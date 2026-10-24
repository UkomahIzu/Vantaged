"use client";

import React, { useState, useRef, useEffect } from "react";
import { VantagedSelect } from "./VantagedSelect";

interface DeskMessage {
  id: string;
  sender: "owner" | "support" | "contractor";
  senderName: string;
  senderRole: string;
  avatar: string;
  text: string;
  timestamp: string;
  tag?: string;
}

interface ProjectDeskTarget {
  id: string;
  title: string;
  jobId: string;
  contractorName: string;
  contractorRep: string;
  repRole: string;
  repAvatar: string;
  currentScope: string;
  escrowSecured: string;
}

const DESK_PROJECTS: ProjectDeskTarget[] = [
  {
    id: "proj-lekki",
    title: "Lekki Phase 1 Luxury Villa",
    jobId: "JOB-4821",
    contractorName: "Julius B. Consortium",
    contractorRep: "Engr. Chidi O.",
    repRole: "Lead Site Engineer",
    repAvatar: "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=120&h=120&fit=crop&crop=face",
    currentScope: "1st Floor Slab Casting & Rebar Ties",
    escrowSecured: "₦145.0M",
  },
  {
    id: "proj-enclave",
    title: "The Enclave Waterfront Resort",
    jobId: "JOB-3914",
    contractorName: "Crane & Stone Structural",
    contractorRep: "Engr. Folake Ade",
    repRole: "Assigned Contractor Rep",
    repAvatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=120&h=120&fit=crop&crop=face",
    currentScope: "Deep Foundation Piling Cages",
    escrowSecured: "₦82.5M",
  },
  {
    id: "proj-guzape",
    title: "Guzape Hills Residence",
    jobId: "JOB-5102",
    contractorName: "SolidGround Engineering",
    contractorRep: "Arc. Bello K.",
    repRole: "Assigned Lead Rep",
    repAvatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=120&h=120&fit=crop&crop=face",
    currentScope: "Galvanized Roof Truss Assembly",
    escrowSecured: "₦210.0M",
  },
  {
    id: "proj-eko",
    title: "Eko Atlantic Sky Tower",
    jobId: "JOB-6205",
    contractorName: "Cappa & D'Alberto",
    contractorRep: "Engr. Tunde Coker",
    repRole: "Assigned Project Lead",
    repAvatar: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=120&h=120&fit=crop&crop=face",
    currentScope: "Level 4 Core Slip-Forming",
    escrowSecured: "₦450.0M",
  },
  {
    id: "proj-banana",
    title: "Banana Island Horizon Penthouse",
    jobId: "JOB-7311",
    contractorName: "Hitech Construction",
    contractorRep: "Engr. Emeka Obi",
    repRole: "Assigned Lead Rep",
    repAvatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=120&h=120&fit=crop&crop=face",
    currentScope: "Penthouse Slab Waterproofing & Curing",
    escrowSecured: "₦310.0M",
  },
];

const INITIAL_ESCROW_MESSAGES: DeskMessage[] = [
  {
    id: "em-1",
    sender: "support",
    senderName: "Tamara Shevchenko",
    senderRole: "Senior Escrow & Mediation Officer",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&h=120&fit=crop&crop=face",
    text: "Hello James. Your escrow vault holds ₦537.5M across active milestones. All disbursements require your explicit verification of the independent engineer sign-off.",
    timestamp: "10:15 AM",
    tag: "Escrow Vault Policy",
  },
  {
    id: "em-2",
    sender: "owner",
    senderName: "James Robinson",
    senderRole: "Owner Admin",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&h=120&fit=crop&crop=faces",
    text: "Thanks Tamara. If the site engineer logs a concrete slump test failure on Lekki Villa, how fast is the milestone paused?",
    timestamp: "10:20 AM",
  },
  {
    id: "em-3",
    sender: "support",
    senderName: "Tamara Shevchenko",
    senderRole: "Senior Escrow & Mediation Officer",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&h=120&fit=crop&crop=face",
    text: "Instantaneously. The smart escrow contract locks milestone tranche release the second an inspection flag is submitted. The contractor cannot claim the funds until rectifications pass re-inspection.",
    timestamp: "10:22 AM",
    tag: "Instant Protection",
  },
];

export function OwnerFloatingDeskWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeDeskMode, setActiveDeskMode] = useState<"escrow" | "project">("escrow");
  const [selectedProjectId, setSelectedProjectId] = useState<string>("proj-lekki");
  const [inputText, setInputText] = useState("");
  const [escrowMessages, setEscrowMessages] = useState<DeskMessage[]>(INITIAL_ESCROW_MESSAGES);
  const [projectMessages, setProjectMessages] = useState<Record<string, DeskMessage[]>>({
    "proj-lekki": [
      {
        id: "pm-lekki-1",
        sender: "contractor",
        senderName: "Engr. Chidi O.",
        senderRole: "Lead Site Engineer (Julius B.)",
        avatar: "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=120&h=120&fit=crop&crop=face",
        text: "Good morning Mr. Robinson. We have rigged the concrete pump for the 1st floor suspended slab. Slump test batch specimens are ready for the Vantaged field rep.",
        timestamp: "09:40 AM",
        tag: "Stage 3 Progress",
      },
    ],
  });
  const [isTypingReply, setIsTypingReply] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const currentProject = DESK_PROJECTS.find((p) => p.id === selectedProjectId) || DESK_PROJECTS[0];

  const currentMessages = activeDeskMode === "escrow"
    ? escrowMessages
    : (projectMessages[selectedProjectId] || []);

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [isOpen, currentMessages, isTypingReply, activeDeskMode, selectedProjectId]);

  const handleSendMessage = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputText.trim()) return;

    const textToSend = inputText.trim();
    setInputText("");

    const newMsg: DeskMessage = {
      id: `usr-${Date.now()}`,
      sender: "owner",
      senderName: "James Robinson",
      senderRole: "Owner Admin",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&h=120&fit=crop&crop=faces",
      text: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    if (activeDeskMode === "escrow") {
      setEscrowMessages((prev) => [...prev, newMsg]);
      setIsTypingReply(true);

      setTimeout(() => {
        setIsTypingReply(false);
        const replyMsg: DeskMessage = {
          id: `rep-${Date.now()}`,
          sender: "support",
          senderName: "Tamara Shevchenko",
          senderRole: "Senior Escrow & Mediation Officer",
          avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&h=120&fit=crop&crop=face",
          text: `Noted, James. I've logged this directly to the Vantaged Escrow Ledger. Your funds remain 100% ring-fenced in vault custody.`,
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          tag: "Escrow Logged",
        };
        setEscrowMessages((prev) => [...prev, replyMsg]);
      }, 1200);
    } else {
      setProjectMessages((prev) => ({
        ...prev,
        [selectedProjectId]: [...(prev[selectedProjectId] || []), newMsg],
      }));
      setIsTypingReply(true);

      setTimeout(() => {
        setIsTypingReply(false);
        const replyMsg: DeskMessage = {
          id: `rep-${Date.now()}`,
          sender: "contractor",
          senderName: currentProject.contractorRep,
          senderRole: `${currentProject.repRole} (${currentProject.contractorName})`,
          avatar: currentProject.repAvatar,
          text: `Hello Mr. Robinson, received your inquiry regarding ${currentProject.title}. I am updating the site log and our field team will address this right away.`,
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          tag: "Site Logged",
        };
        setProjectMessages((prev) => ({
          ...prev,
          [selectedProjectId]: [...(prev[selectedProjectId] || []), replyMsg],
        }));
      }, 1400);
    }
  };

  const handleQuickPrompt = (prompt: string) => {
    setInputText(prompt);
  };

  return (
    <div
      style={{ fontFamily: "'Outfit', var(--vt-font-sans), sans-serif" }}
      className="fixed bottom-5 right-5 z-50 flex flex-col items-end select-none"
    >
      {/* ── EXPANDED WIDGET CARD ── */}
      {isOpen && (
        <div
          className="w-[370px] sm:w-[410px] h-[550px] max-w-[calc(100vw-32px)] max-h-[calc(100vh-100px)] mb-3 bg-white border border-[var(--vt-color-border-default,#E2E0EC)] rounded-3xl shadow-[0_20px_60px_rgba(38,26,102,0.22)] flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-200"
        >
          {/* Top Header */}
          <div className="bg-[var(--vt-color-indigo-900,#261A66)] text-white p-4 shrink-0 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-[var(--vt-color-orange-500,#EF5F18)] flex items-center justify-center text-white shadow-2xs">
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                </svg>
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-2">
                  <h3 className="font-extrabold text-sm text-white tracking-wide">
                    Escrow & Project Desk
                  </h3>
                  <span className="w-2 h-2 rounded-full bg-[var(--vt-color-green-400,#34D399)] animate-pulse" />
                </div>
                <p className="text-[11px] text-[var(--vt-color-indigo-200,#D5D2EF)] font-medium">
                  Verified platform mediation & project reps
                </p>
              </div>
            </div>

            {/* Close Button */}
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-all cursor-pointer"
              title="Close Desk"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>

          {/* Mode Switcher Tabs */}
          <div className="p-2.5 bg-[var(--vt-color-neutral-50,#F7F7FA)] border-b border-[var(--vt-color-border-default,#E2E0EC)] flex items-center gap-2">
            <button
              type="button"
              onClick={() => setActiveDeskMode("escrow")}
              className={`flex-1 py-1.5 px-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                activeDeskMode === "escrow"
                  ? "bg-white text-[var(--vt-color-orange-600,#D84C0B)] shadow-2xs border border-[var(--vt-color-orange-200,#FDCAA9)]"
                  : "text-[var(--vt-color-neutral-500,#7C7894)] hover:text-[var(--vt-color-indigo-900,#261A66)]"
              }`}
            >
              <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect width="18" height="18" x="3" y="3" rx="2" />
                <path d="M7 7h10v10H7z" />
              </svg>
              <span>Escrow Officer</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveDeskMode("project")}
              className={`flex-1 py-1.5 px-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                activeDeskMode === "project"
                  ? "bg-white text-[var(--vt-color-orange-600,#D84C0B)] shadow-2xs border border-[var(--vt-color-orange-200,#FDCAA9)]"
                  : "text-[var(--vt-color-neutral-500,#7C7894)] hover:text-[var(--vt-color-indigo-900,#261A66)]"
              }`}
            >
              <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
              </svg>
              <span>Project Contractor</span>
            </button>
          </div>

          {/* Subheader Context Banner */}
          {activeDeskMode === "escrow" ? (
            <div className="px-4 py-2 bg-[var(--vt-color-indigo-50,#F4F3FC)]/70 border-b border-[var(--vt-color-indigo-100,#EAE8F9)] flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <img
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&h=120&fit=crop&crop=face"
                  alt="Tamara S."
                  className="w-6 h-6 rounded-full object-cover ring-1 ring-white"
                />
                <div>
                  <p className="font-extrabold text-[var(--vt-color-indigo-900,#261A66)] text-[11px] leading-tight">
                    Tamara S. (Escrow Officer)
                  </p>
                  <p className="text-[10px] text-[var(--vt-color-neutral-500,#7C7894)]">
                    Fast Mediation • Average reply: 4m
                  </p>
                </div>
              </div>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-[var(--vt-color-green-50,#E9F6EC)] text-[var(--vt-color-green-700,#1F6B3E)] border border-[var(--vt-color-green-200,#A3D9B1)]">
                Vault Active
              </span>
            </div>
          ) : (
            <div className="px-3.5 py-2 bg-[var(--vt-color-neutral-50,#F7F7FA)] border-b border-[var(--vt-color-border-default,#E2E0EC)] flex items-center justify-between gap-2">
              <div className="flex items-center gap-1.5 min-w-0">
                <span className="text-[11px] font-bold text-[var(--vt-color-neutral-400,#A3A0B8)] uppercase shrink-0">
                  Project:
                </span>
                <VantagedSelect
                  value={selectedProjectId}
                  onChange={(val) => setSelectedProjectId(val)}
                  containerClassName="w-auto min-w-[170px]"
                  className="h-7.5 px-2.5 rounded-lg bg-white border border-[var(--vt-color-border-default,#E2E0EC)] text-xs font-bold text-[var(--vt-color-indigo-900,#261A66)]"
                  options={DESK_PROJECTS.map((p) => ({
                    value: p.id,
                    label: p.title,
                  }))}
                />
              </div>

              <span className="text-[10.5px] font-bold text-[var(--vt-color-orange-600,#D84C0B)] shrink-0">
                {currentProject.contractorRep}
              </span>
            </div>
          )}

          {/* Conversation Messages Feed */}
          <div className="flex-1 overflow-y-auto p-3.5 flex flex-col gap-3 bg-[var(--vt-color-neutral-50,#F7F7FA)]/50">
            {currentMessages.map((msg) => {
              const isOwner = msg.sender === "owner";
              return (
                <div
                  key={msg.id}
                  className={`flex items-start gap-2 max-w-[88%] ${
                    isOwner ? "self-end flex-row-reverse" : "self-start"
                  }`}
                >
                  <img
                    src={msg.avatar}
                    alt={msg.senderName}
                    className="w-7 h-7 rounded-full object-cover shrink-0 mt-0.5 ring-1 ring-white shadow-2xs"
                  />
                  <div className={`flex flex-col ${isOwner ? "items-end" : "items-start"}`}>
                    <span className="text-[10px] font-bold text-[var(--vt-color-neutral-400,#A3A0B8)] px-1 mb-0.5">
                      {isOwner ? "You" : msg.senderName} • {msg.timestamp}
                    </span>
                    <div
                      className={`p-3 text-xs leading-relaxed shadow-2xs ${
                        isOwner
                          ? "bg-[var(--vt-color-indigo-900,#261A66)] text-white rounded-2xl rounded-tr-xs"
                          : "bg-white text-[var(--vt-color-indigo-900,#261A66)] border border-[var(--vt-color-border-default,#E2E0EC)] rounded-2xl rounded-tl-xs"
                      }`}
                    >
                      <p>{msg.text}</p>
                      {msg.tag && (
                        <div className="mt-1.5 pt-1 border-t border-[var(--vt-color-neutral-100,#EFEEF5)]/40 flex items-center gap-1">
                          <span className="text-[9.5px] font-extrabold uppercase px-1.5 py-0.2 rounded bg-[var(--vt-color-orange-50,#FFF4EE)] text-[var(--vt-color-orange-700,#B33C08)] border border-[var(--vt-color-orange-200,#FDCAA9)]">
                            {msg.tag}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}

            {/* Simulated Typing Indicator */}
            {isTypingReply && (
              <div className="flex items-center gap-2 self-start animate-in fade-in duration-150">
                <div className="w-5 h-5 rounded-full bg-[var(--vt-color-orange-100,#FDE2D2)] text-[var(--vt-color-orange-600,#D84C0B)] flex items-center justify-center text-[10px] font-bold">
                  •••
                </div>
                <span className="text-[11px] text-[var(--vt-color-neutral-400,#A3A0B8)] italic">
                  {activeDeskMode === "escrow" ? "Tamara is replying..." : `${currentProject.contractorRep} is typing...`}
                </span>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Quick Action Chips */}
          <div className="px-3 py-2 bg-white border-t border-[var(--vt-color-neutral-100,#EFEEF5)] flex items-center gap-1.5 overflow-x-auto scrollbar-none">
            {activeDeskMode === "escrow" ? (
              <>
                <button
                  type="button"
                  onClick={() => handleQuickPrompt("When is the next milestone tranche released?")}
                  className="px-2.5 py-1 rounded-lg bg-[var(--vt-color-neutral-50,#F7F7FA)] hover:bg-[var(--vt-color-orange-50,#FFF4EE)] text-[var(--vt-color-neutral-600,#5E5A7D)] hover:text-[var(--vt-color-orange-700,#B33C08)] border border-[var(--vt-color-border-default,#E2E0EC)] text-[10.5px] font-bold whitespace-nowrap transition-colors cursor-pointer"
                >
                  ⚡ Milestone release timing?
                </button>
                <button
                  type="button"
                  onClick={() => handleQuickPrompt("I want to pause disbursement for inspection review")}
                  className="px-2.5 py-1 rounded-lg bg-[var(--vt-color-neutral-50,#F7F7FA)] hover:bg-[var(--vt-color-orange-50,#FFF4EE)] text-[var(--vt-color-neutral-600,#5E5A7D)] hover:text-[var(--vt-color-orange-700,#B33C08)] border border-[var(--vt-color-border-default,#E2E0EC)] text-[10.5px] font-bold whitespace-nowrap transition-colors cursor-pointer"
                >
                  🔒 Pause disbursement
                </button>
              </>
            ) : (
              <>
                <button
                  type="button"
                  onClick={() => handleQuickPrompt("Please send high-resolution photos of today's rebar reinforcement")}
                  className="px-2.5 py-1 rounded-lg bg-[var(--vt-color-neutral-50,#F7F7FA)] hover:bg-[var(--vt-color-orange-50,#FFF4EE)] text-[var(--vt-color-neutral-600,#5E5A7D)] hover:text-[var(--vt-color-orange-700,#B33C08)] border border-[var(--vt-color-border-default,#E2E0EC)] text-[10.5px] font-bold whitespace-nowrap transition-colors cursor-pointer"
                >
                  📸 Request site photos
                </button>
                <button
                  type="button"
                  onClick={() => handleQuickPrompt("What is the scheduled date for concrete pouring?")}
                  className="px-2.5 py-1 rounded-lg bg-[var(--vt-color-neutral-50,#F7F7FA)] hover:bg-[var(--vt-color-orange-50,#FFF4EE)] text-[var(--vt-color-neutral-600,#5E5A7D)] hover:text-[var(--vt-color-orange-700,#B33C08)] border border-[var(--vt-color-border-default,#E2E0EC)] text-[10.5px] font-bold whitespace-nowrap transition-colors cursor-pointer"
                >
                  📅 Pouring schedule?
                </button>
              </>
            )}
          </div>

          {/* Bottom Message Composer */}
          <form
            onSubmit={handleSendMessage}
            className="p-3 bg-white border-t border-[var(--vt-color-border-default,#E2E0EC)] flex items-center gap-2"
          >
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder={
                activeDeskMode === "escrow"
                  ? "Ask Escrow Officer a question..."
                  : `Message ${currentProject.contractorRep}...`
              }
              className="flex-1 h-9 px-3 rounded-xl bg-[var(--vt-color-neutral-50,#F7F7FA)] border border-[var(--vt-color-border-default,#E2E0EC)] text-xs text-[var(--vt-color-indigo-900,#261A66)] placeholder-[var(--vt-color-neutral-400,#A3A0B8)] focus:outline-none focus:border-[var(--vt-color-orange-500,#EF5F18)] transition-colors"
            />

            <button
              type="submit"
              disabled={!inputText.trim()}
              className="w-9 h-9 rounded-xl bg-[var(--vt-color-orange-500,#EF5F18)] hover:bg-[var(--vt-color-orange-600,#D84C0B)] active:bg-[var(--vt-color-orange-700,#B33C08)] disabled:opacity-40 disabled:pointer-events-none text-white flex items-center justify-center transition-all cursor-pointer shadow-xs active:scale-95 shrink-0"
              title="Send Message"
            >
              <svg className="w-4 h-4 -rotate-45 -mr-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="22" y1="2" x2="11" y2="13" />
                <polygon points="22 2 15 22 11 13 2 9 22 2" />
              </svg>
            </button>
          </form>
        </div>
      )}

      {/* ── FLOATING TRIGGER PILL / BUTTON ── */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="group relative flex items-center gap-2.5 px-4 py-3 rounded-full bg-[var(--vt-color-orange-500,#EF5F18)] hover:bg-[var(--vt-color-orange-600,#D84C0B)] active:bg-[var(--vt-color-orange-700,#B33C08)] text-white shadow-[0_8px_25px_rgba(239,95,24,0.38)] hover:shadow-[0_12px_32px_rgba(239,95,24,0.48)] transition-all cursor-pointer active:scale-95"
        title={isOpen ? "Close Desk" : "Open Escrow & Project Desk"}
      >
        {/* Pulsing Green Live Dot */}
        <span className="relative flex h-2.5 w-2.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75" />
          <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[var(--vt-color-green-400,#34D399)]" />
        </span>

        {/* Icon */}
        <svg
          className={`w-4 h-4 transition-transform duration-200 ${isOpen ? "rotate-90" : ""}`}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          {isOpen ? (
            <>
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </>
          ) : (
            <>
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
            </>
          )}
        </svg>

        {/* Label */}
        <span className="text-xs font-extrabold tracking-wide text-white">
          {isOpen ? "Close Desk" : "Escrow & Project Desk"}
        </span>
      </button>
    </div>
  );
}
