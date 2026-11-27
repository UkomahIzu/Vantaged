"use client";

import React, { useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { DirectorSidebarNav } from "../components/DirectorSidebarNav";
import { DirectorHeaderBar } from "../components/DirectorHeaderBar";
import { useScrollRestoration } from "../../../client/Owner dashboard/hooks/useScrollRestoration";
import { VantagedSelect } from "../../../client/Owner dashboard/components/VantagedSelect";
import { useDirectorDemoMode } from "../hooks/useDirectorDemoMode";
import { readLocalData, writeLocalData } from "../utils/localPersistence";
import { TEAM_ROSTER_UPDATE_EVENT } from "../components/AddTeamMemberModal";

interface StaffRewardMember {
  id: string;
  name: string;
  role: string;
  site: string;
  points: number;
  streakDays: number;
  isLiveTeam?: boolean;
}

interface RewardActivityItem {
  id: string;
  memberName: string;
  points: number;
  reason: string;
  date: string;
}

const INITIAL_STAFF_LEADERBOARD: StaffRewardMember[] = [
  {
    id: "rw-1",
    name: "Engr. Tunde Bakare",
    role: "Site Manager",
    site: "Lekki Phase 1 Villa",
    points: 420,
    streakDays: 18,
  },
  {
    id: "rw-2",
    name: "Engr. Chidinma Okafor",
    role: "MEP Lead",
    site: "Maitama Commercial Annex",
    points: 360,
    streakDays: 14,
  },
  {
    id: "rw-3",
    name: "Amaka Nwosu",
    role: "Office Coordinator",
    site: "Victoria Island HQ",
    points: 315,
    streakDays: 21,
  },
  {
    id: "rw-4",
    name: "Suleiman Ibrahim",
    role: "Lead Foreman",
    site: "Banana Island Terrace",
    points: 280,
    streakDays: 11,
  },
  {
    id: "rw-5",
    name: "Kazeem Adeyemi",
    role: "Finishing Lead",
    site: "Lekki Phase 1 Villa",
    points: 245,
    streakDays: 9,
  },
];

const INITIAL_REWARD_ACTIVITY: RewardActivityItem[] = [
  {
    id: "ra-1",
    memberName: "Engr. Tunde Bakare",
    points: 75,
    reason: "Stage 3 passed inspection with zero snags",
    date: "Today, 11:20 AM",
  },
  {
    id: "ra-2",
    memberName: "Amaka Nwosu",
    points: 50,
    reason: "Confirmed client bank receipt within 6 hours",
    date: "Yesterday",
  },
  {
    id: "ra-3",
    memberName: "Suleiman Ibrahim",
    points: 25,
    reason: "7-day streak of on-time morning site photos",
    date: "2 days ago",
  },
  {
    id: "ra-4",
    memberName: "Engr. Chidinma Okafor",
    points: 50,
    reason: "Uploaded pressure test report ahead of schedule",
    date: "Oct 14, 2026",
  },
];

interface RewardRuleItem {
  id: string;
  title: string;
  points: number;
  desc: string;
  isCustom?: boolean;
}

const INITIAL_REWARD_RULES: RewardRuleItem[] = [
  {
    id: "rule-receipt",
    title: "Fast Receipt Confirmation",
    points: 50,
    desc: "Confirm client bank transfers within 24 hours.",
  },
  {
    id: "rule-inspection",
    title: "Clean Stage Inspection",
    points: 75,
    desc: "Pass an independent site check with zero fixes needed.",
  },
  {
    id: "rule-photos",
    title: "Daily Site Photo Streak",
    points: 25,
    desc: "Upload clear progress photos every workday for 7 days.",
  },
  {
    id: "rule-handover",
    title: "On-Time Handover Bonus",
    points: 150,
    desc: "Finish a building on schedule with full client sign-off.",
  },
];

export function DirectorRewardsPage() {
  const scrollRef = useScrollRestoration<HTMLElement>("director_rewards");
  const { isDemoMode } = useDirectorDemoMode();
  const [mounted, setMounted] = useState(false);

  const [demoStaff, setDemoStaff] = useState<StaffRewardMember[]>(() =>
    readLocalData("vantaged_director_rewards_staff", INITIAL_STAFF_LEADERBOARD)
  );
  const [liveTeamStaff, setLiveTeamStaff] = useState<StaffRewardMember[]>([]);
  const [demoActivity, setDemoActivity] = useState<RewardActivityItem[]>(() =>
    readLocalData("vantaged_director_rewards_activity", INITIAL_REWARD_ACTIVITY)
  );
  const [liveActivity, setLiveActivity] = useState<RewardActivityItem[]>(() =>
    readLocalData("vantaged_director_rewards_live_activity", [])
  );
  const [rules, setRules] = useState<RewardRuleItem[]>(() =>
    readLocalData("vantaged_director_reward_rules", INITIAL_REWARD_RULES)
  );
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Add / Edit Rule Modal
  const [isRuleModalOpen, setIsRuleModalOpen] = useState(false);
  const [editingRuleId, setEditingRuleId] = useState<string | null>(null);
  const [ruleForm, setRuleForm] = useState({
    title: "",
    points: "50",
    desc: "",
  });

  // Award Bonus Modal
  const [isAwardOpen, setIsAwardOpen] = useState(false);
  const [awardMemberId, setAwardMemberId] = useState("");
  const [selectedRuleId, setSelectedRuleId] = useState<string>("custom");
  const [awardPoints, setAwardPoints] = useState("50");
  const [awardReason, setAwardReason] = useState("");

  useEffect(() => {
    setMounted(true);
    const syncLiveTeam = () => {
      const customRoster = readLocalData<any[]>("vantaged_director_team_custom_roster", []);
      setLiveTeamStaff(
        Array.isArray(customRoster)
          ? customRoster.map((m) => ({
              id: m.id,
              name: m.name,
              role: m.role || "Site Staff",
              site: m.assignedProjectName || "Active Company Site",
              points: Number(m.points) || 0,
              streakDays: m.streakDays ?? 1,
              isLiveTeam: true,
            }))
          : []
      );
      setLiveActivity(readLocalData("vantaged_director_rewards_live_activity", []));
    };
    syncLiveTeam();
    window.addEventListener(TEAM_ROSTER_UPDATE_EVENT, syncLiveTeam);
    window.addEventListener("storage", syncLiveTeam);
    return () => {
      window.removeEventListener(TEAM_ROSTER_UPDATE_EVENT, syncLiveTeam);
      window.removeEventListener("storage", syncLiveTeam);
    };
  }, []);

  const visibleStaff = useMemo(() => {
    const combined = isDemoMode ? [...liveTeamStaff, ...demoStaff] : liveTeamStaff;
    return [...combined].sort((a, b) => b.points - a.points);
  }, [isDemoMode, liveTeamStaff, demoStaff]);

  const visibleActivity = useMemo(
    () => (isDemoMode ? [...liveActivity, ...demoActivity] : liveActivity),
    [isDemoMode, liveActivity, demoActivity]
  );

  const totalTeamPoints = useMemo(
    () => visibleStaff.reduce((sum, m) => sum + m.points, 0),
    [visibleStaff]
  );

  const topPerformer = visibleStaff[0] ?? null;

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3200);
  };

  const persistRules = (next: RewardRuleItem[]) => {
    setRules(next);
    writeLocalData("vantaged_director_reward_rules", next);
  };

  const openAddRuleModal = () => {
    setEditingRuleId(null);
    setRuleForm({ title: "", points: "50", desc: "" });
    setIsRuleModalOpen(true);
  };

  const openEditRuleModal = (rule: RewardRuleItem) => {
    setEditingRuleId(rule.id);
    setRuleForm({
      title: rule.title,
      points: String(rule.points),
      desc: rule.desc,
    });
    setIsRuleModalOpen(true);
  };

  const handleSaveRule = (e: React.FormEvent) => {
    e.preventDefault();
    const pts = Math.max(5, parseInt(ruleForm.points, 10) || 25);
    if (!ruleForm.title.trim()) return;

    if (editingRuleId) {
      const next = rules.map((r) =>
        r.id === editingRuleId
          ? {
              ...r,
              title: ruleForm.title.trim(),
              points: pts,
              desc: ruleForm.desc.trim() || r.desc,
            }
          : r
      );
      persistRules(next);
      setIsRuleModalOpen(false);
      showToast(`Updated "${ruleForm.title.trim()}" to +${pts} pts!`);
      return;
    }

    const newRule: RewardRuleItem = {
      id: `rule-custom-${Date.now()}`,
      title: ruleForm.title.trim(),
      points: pts,
      desc:
        ruleForm.desc.trim() ||
        "Custom company rule created for site and office staff.",
      isCustom: true,
    };
    persistRules([newRule, ...rules]);
    setIsRuleModalOpen(false);
    showToast(`Added reward rule "${newRule.title}" (+${pts} pts)!`);
  };

  const handleDeleteRule = (id: string, title: string) => {
    persistRules(rules.filter((r) => r.id !== id));
    showToast(`Removed rule "${title}".`);
  };

  const openAwardModal = (memberId?: string) => {
    const defaultMember = memberId || visibleStaff[0]?.id || "";
    setAwardMemberId(defaultMember);
    const firstRule = rules[0];
    if (firstRule) {
      setSelectedRuleId(firstRule.id);
      setAwardPoints(String(firstRule.points));
      setAwardReason(firstRule.title);
    } else {
      setSelectedRuleId("custom");
      setAwardPoints("50");
      setAwardReason("");
    }
    setIsAwardOpen(true);
  };

  const handleSelectRewardRule = (ruleId: string) => {
    setSelectedRuleId(ruleId);
    const matched = rules.find((r) => r.id === ruleId);
    if (matched) {
      setAwardPoints(String(matched.points));
      setAwardReason(matched.title);
    }
  };

  const handleAwardSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const pts = Math.max(5, parseInt(awardPoints, 10) || 25);
    const target = visibleStaff.find((m) => m.id === awardMemberId);
    if (!target) return;

    const newAct: RewardActivityItem = {
      id: `ra-${Date.now()}`,
      memberName: target.name,
      points: pts,
      reason: awardReason.trim() || "Director bonus for great site work",
      date: "Just now",
    };

    if (target.isLiveTeam) {
      const nextLiveStaff = liveTeamStaff.map((m) =>
        m.id === target.id ? { ...m, points: m.points + pts } : m
      );
      setLiveTeamStaff(nextLiveStaff);

      // Sync awarded points directly back to Team & Crew custom roster!
      const rawCustom = readLocalData<any[]>("vantaged_director_team_custom_roster", []);
      const updatedCustom = rawCustom.map((m) =>
        m.id === target.id ? { ...m, points: (Number(m.points) || 0) + pts } : m
      );
      writeLocalData("vantaged_director_team_custom_roster", updatedCustom);
      window.dispatchEvent(new Event(TEAM_ROSTER_UPDATE_EVENT));

      const nextLiveAct = [newAct, ...liveActivity];
      setLiveActivity(nextLiveAct);
      writeLocalData("vantaged_director_rewards_live_activity", nextLiveAct);
    } else {
      const nextDemoStaff = demoStaff.map((m) =>
        m.id === target.id ? { ...m, points: m.points + pts } : m
      );
      const nextDemoAct = [newAct, ...demoActivity];
      setDemoStaff(nextDemoStaff);
      setDemoActivity(nextDemoAct);
      writeLocalData("vantaged_director_rewards_staff", nextDemoStaff);
      writeLocalData("vantaged_director_rewards_activity", nextDemoAct);
    }

    setIsAwardOpen(false);
    setAwardReason("");
    showToast(`Awarded +${pts} pts to ${target.name}!`);
  };

  return (
    <div
      style={{ fontFamily: "'Outfit', var(--vt-font-sans), sans-serif" }}
      className="h-screen w-screen max-w-screen max-h-screen overflow-hidden bg-[var(--vt-color-background-subtle,#F7F7FA)] flex flex-col md:flex-row font-sans text-[var(--vt-color-text-default,#261A66)] select-none relative"
    >
      <DirectorSidebarNav currentActiveItem="rewards" />

      <main
        ref={scrollRef}
        className="relative z-10 flex-1 h-full max-h-screen overflow-y-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-5 flex flex-col gap-5 pb-24 md:pb-10"
      >
        <DirectorHeaderBar
          leftSlot={
            <Link
              href="/contractor/dashboard"
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

        {/* Header */}
        <section className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pt-1">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[var(--vt-color-indigo-900,#261A66)] tracking-tight">
              Team Rewards &amp; Points
            </h1>
            <p className="text-xs sm:text-sm text-[var(--vt-color-neutral-500,#7C7894)] mt-0.5">
              Reward site managers, office staff, and crew for fast receipts, clean inspections, and daily site photos.
            </p>
          </div>

          <button
            type="button"
            disabled={visibleStaff.length === 0}
            onClick={() => openAwardModal()}
            className="h-9 px-4 rounded-lg bg-[var(--vt-color-orange-500,#EF5F18)] hover:bg-[var(--vt-color-orange-600,#D84C0B)] text-white text-xs font-bold shadow-2xs cursor-pointer disabled:opacity-45 shrink-0"
          >
            + Award Bonus Points
          </button>
        </section>

        {/* 3 Summary Cards */}
        <section className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-[var(--vt-color-orange-50,#FFF4EE)] rounded-2xl border border-[var(--vt-color-orange-200,#FDCAA9)] p-4 shadow-2xs">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[var(--vt-color-orange-700,#B33C08)]">
              Total Team Points
            </span>
            <p className="text-2xl font-extrabold text-[var(--vt-color-orange-700,#B33C08)] font-mono mt-1">
              {totalTeamPoints.toLocaleString()} pts
            </p>
            <p className="text-[11px] text-[var(--vt-color-orange-800,#8F320D)] mt-1">
              Earned by {visibleStaff.length} staff member{visibleStaff.length === 1 ? "" : "s"}
            </p>
          </div>

          <div className="bg-white rounded-2xl border border-[var(--vt-color-border-default,#E2E0EC)] p-4 shadow-2xs">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[var(--vt-color-neutral-400,#A3A0B8)]">
              Top Performer
            </span>
            <p className="text-lg font-extrabold text-[var(--vt-color-indigo-900,#261A66)] truncate mt-1">
              {topPerformer ? topPerformer.name : "None yet"}
            </p>
            <p className="text-[11px] text-[var(--vt-color-green-700,#1F6B3E)] font-semibold mt-1">
              {topPerformer
                ? `${topPerformer.points} pts · ${topPerformer.role}`
                : "Add staff in Team & Crew to track points"}
            </p>
          </div>

          <div className="bg-white rounded-2xl border border-[var(--vt-color-border-default,#E2E0EC)] p-4 shadow-2xs">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[var(--vt-color-neutral-400,#A3A0B8)]">
              Reward Rules
            </span>
            <p className="text-2xl font-extrabold text-[var(--vt-color-indigo-900,#261A66)] font-mono mt-1">
              {rules.length}
            </p>
            <p className="text-[11px] text-[var(--vt-color-neutral-500,#7C7894)] mt-1">
              Selectable presets for awarding points
            </p>
          </div>
        </section>

        {/* Main 2-Column Layout */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
          {/* Left: Staff Leaderboard & Activity */}
          <div className="lg:col-span-7 flex flex-col gap-5">
            <div className="bg-white rounded-2xl border border-[var(--vt-color-border-default,#E2E0EC)] p-5 shadow-2xs">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-base font-extrabold text-[var(--vt-color-indigo-900,#261A66)]">
                    Staff Points Leaderboard
                  </h2>
                  <p className="text-xs text-[var(--vt-color-neutral-500,#7C7894)]">
                    Ranked by points earned on active sites
                  </p>
                </div>
              </div>

              {visibleStaff.length === 0 ? (
                <div className="py-10 px-4 text-center rounded-xl bg-[var(--vt-color-neutral-50,#F7F7FA)] border border-dashed border-[var(--vt-color-border-default,#E2E0EC)] text-xs text-[var(--vt-color-neutral-500,#7C7894)] flex flex-col items-center gap-3">
                  <p className="max-w-sm">
                    No staff members added yet. Add Site Managers, Office Coordinators, or Crew in Team &amp; Crew to start awarding points.
                  </p>
                  <Link
                    href="/contractor/team"
                    className="h-8 px-4 rounded-lg bg-[var(--vt-color-orange-500,#EF5F18)] hover:bg-[var(--vt-color-orange-600,#D84C0B)] text-white text-xs font-bold inline-flex items-center"
                  >
                    Go to Team &amp; Crew →
                  </Link>
                </div>
              ) : (
                <div className="space-y-3 max-h-[380px] overflow-y-auto pr-1 scrollbar-thin">
                  {visibleStaff.map((member, index) => {
                    const maxPts = Math.max(1, visibleStaff[0]?.points ?? 1);
                    const pct = Math.round((member.points / maxPts) * 100);
                    return (
                      <div
                        key={member.id}
                        className="p-3.5 rounded-xl bg-[var(--vt-color-neutral-50,#F7F7FA)] border border-[var(--vt-color-border-default,#E2E0EC)] flex flex-col gap-2"
                      >
                        <div className="flex items-center justify-between gap-3">
                          <div className="flex items-center gap-3 min-w-0">
                            <span
                              className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-extrabold shrink-0 ${
                                index === 0
                                  ? "bg-[var(--vt-color-orange-500,#EF5F18)] text-white"
                                  : "bg-white border border-[var(--vt-color-border-default,#E2E0EC)] text-[var(--vt-color-indigo-900,#261A66)]"
                              }`}
                            >
                              #{index + 1}
                            </span>
                            <div className="min-w-0">
                              <p className="text-xs sm:text-sm font-extrabold text-[var(--vt-color-indigo-900,#261A66)] truncate">
                                {member.name}
                              </p>
                              <p className="text-[11px] text-[var(--vt-color-neutral-500,#7C7894)] truncate">
                                {member.role} · {member.site} · {member.streakDays}d streak
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center gap-2.5 shrink-0">
                            <span className="font-mono text-sm font-extrabold text-[var(--vt-color-orange-600,#D84C0B)]">
                              {member.points} pts
                            </span>
                            <button
                              type="button"
                              onClick={() => openAwardModal(member.id)}
                              className="h-7 px-2.5 rounded-md bg-white hover:bg-[var(--vt-color-orange-50,#FFF4EE)] border border-[var(--vt-color-border-default,#E2E0EC)] text-[11px] font-bold text-[var(--vt-color-indigo-900,#261A66)] cursor-pointer"
                            >
                              + Award
                            </button>
                          </div>
                        </div>

                        <div className="w-full h-1.5 rounded-full bg-white overflow-hidden">
                          <div
                            className="h-full rounded-full bg-[var(--vt-color-orange-500,#EF5F18)] transition-all duration-300"
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Recent Point Activity */}
            <div className="bg-white rounded-2xl border border-[var(--vt-color-border-default,#E2E0EC)] p-5 shadow-2xs">
              <h2 className="text-base font-extrabold text-[var(--vt-color-indigo-900,#261A66)] mb-3">
                Recent Point History
              </h2>

              {visibleActivity.length === 0 ? (
                <p className="text-xs text-[var(--vt-color-neutral-500,#7C7894)] py-6 text-center">
                  No point activity recorded yet.
                </p>
              ) : (
                <div className="divide-y divide-[var(--vt-color-neutral-100,#EFEEF5)] max-h-[260px] overflow-y-auto pr-1 scrollbar-thin">
                  {visibleActivity.map((act) => (
                    <div
                      key={act.id}
                      className="py-3 flex items-center justify-between gap-3 text-xs"
                    >
                      <div className="min-w-0">
                        <p className="font-bold text-[var(--vt-color-indigo-900,#261A66)]">
                          {act.memberName}
                        </p>
                        <p className="text-[11px] text-[var(--vt-color-neutral-500,#7C7894)]">
                          {act.reason}
                        </p>
                      </div>
                      <div className="text-right shrink-0">
                        <span
                          className={`font-mono font-extrabold ${
                            act.points >= 0
                              ? "text-[var(--vt-color-green-700,#1F6B3E)]"
                              : "text-[var(--vt-color-orange-600,#D84C0B)]"
                          }`}
                        >
                          {act.points >= 0 ? `+${act.points}` : act.points} pts
                        </span>
                        <p className="text-[10px] text-[var(--vt-color-neutral-400,#A3A0B8)]">
                          {act.date}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Right: Ways to Earn (Editable & Custom Rules) */}
          <div className="lg:col-span-5 flex flex-col gap-5">
            <div className="bg-white rounded-2xl border border-[var(--vt-color-border-default,#E2E0EC)] p-5 shadow-2xs">
              <div className="flex items-start justify-between gap-2 mb-3.5">
                <div>
                  <h2 className="text-base font-extrabold text-[var(--vt-color-indigo-900,#261A66)]">
                    How Team Members Earn Points
                  </h2>
                  <p className="text-xs text-[var(--vt-color-neutral-500,#7C7894)] mt-0.5">
                    Edit point values or add custom rules usable when awarding bonuses
                  </p>
                </div>
                <button
                  type="button"
                  onClick={openAddRuleModal}
                  className="h-8 px-3 rounded-lg bg-[var(--vt-color-orange-50,#FFF4EE)] hover:bg-[var(--vt-color-orange-500,#EF5F18)] text-[var(--vt-color-orange-700,#B33C08)] hover:text-white border border-[var(--vt-color-orange-200,#FDCAA9)] text-xs font-bold transition-colors cursor-pointer shrink-0"
                >
                  + Add Rule
                </button>
              </div>

              <div className="space-y-2.5 max-h-[460px] overflow-y-auto pr-1 scrollbar-thin">
                {rules.map((rule) => (
                  <div
                    key={rule.id}
                    className="p-3 rounded-xl bg-[var(--vt-color-neutral-50,#F7F7FA)] border border-[var(--vt-color-border-default,#E2E0EC)] flex items-start justify-between gap-3"
                  >
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <p className="text-xs font-bold text-[var(--vt-color-indigo-900,#261A66)]">
                          {rule.title}
                        </p>
                        {rule.isCustom && (
                          <span className="px-1.5 py-0.2 rounded text-[9px] font-mono font-bold bg-[var(--vt-color-orange-100,#FFE6D5)] text-[var(--vt-color-orange-800,#8F320D)]">
                            Custom
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-[var(--vt-color-neutral-500,#7C7894)] mt-0.5">
                        {rule.desc}
                      </p>
                    </div>

                    <div className="flex flex-col items-end gap-1.5 shrink-0">
                      <span className="px-2 py-0.5 rounded-md bg-[var(--vt-color-green-50,#E9F6EC)] border border-[var(--vt-color-green-200,#A3D9B1)] text-[var(--vt-color-green-700,#1F6B3E)] font-mono font-extrabold text-[11px]">
                        +{rule.points} pts
                      </span>
                      <div className="flex items-center gap-2 text-[10.5px] font-bold">
                        <button
                          type="button"
                          onClick={() => openEditRuleModal(rule)}
                          className="text-[var(--vt-color-orange-600,#D84C0B)] hover:underline cursor-pointer"
                        >
                          Edit
                        </button>
                        {rule.isCustom && (
                          <button
                            type="button"
                            onClick={() => handleDeleteRule(rule.id, rule.title)}
                            className="text-rose-600 hover:underline cursor-pointer"
                          >
                            Delete
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Award Bonus Points Modal (Portaled above navbar, uses live staff + custom rules) */}
      {mounted &&
        isAwardOpen &&
        createPortal(
          <div
            style={{ fontFamily: "'Outfit', var(--vt-font-sans), sans-serif" }}
            className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-[var(--vt-color-indigo-950,#140B3B)]/55 backdrop-blur-xs select-none font-sans"
            onClick={() => setIsAwardOpen(false)}
          >
            <div
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-md bg-white border border-[var(--vt-color-border-default,#E2E0EC)] rounded-2xl shadow-2xl overflow-hidden text-[var(--vt-color-text-default,#261A66)]"
            >
              <div className="px-5 py-4 border-b border-[var(--vt-color-border-default,#E2E0EC)] bg-[var(--vt-color-neutral-50,#F7F7FA)] flex items-center justify-between">
                <h3 className="text-base font-extrabold text-[var(--vt-color-indigo-900,#261A66)]">
                  Award Bonus Points
                </h3>
                <button
                  type="button"
                  onClick={() => setIsAwardOpen(false)}
                  className="w-7 h-7 rounded-lg hover:bg-[var(--vt-color-neutral-200,#E2E0EC)] text-[var(--vt-color-neutral-500,#7C7894)] flex items-center justify-center cursor-pointer"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleAwardSubmit} className="p-5 space-y-3.5 text-xs">
                <div>
                  <label className="block font-bold text-[var(--vt-color-indigo-900,#261A66)] mb-1">
                    Team Member
                  </label>
                  <VantagedSelect
                    value={awardMemberId}
                    onChange={(val) => setAwardMemberId(val)}
                    options={visibleStaff.map((m) => ({
                      value: m.id,
                      label: `${m.name} (${m.points} pts)`,
                    }))}
                  />
                </div>

                <div>
                  <label className="block font-bold text-[var(--vt-color-indigo-900,#261A66)] mb-1">
                    Reward Rule Preset
                  </label>
                  <VantagedSelect
                    value={selectedRuleId}
                    onChange={(val) => handleSelectRewardRule(val)}
                    options={[
                      ...rules.map((r) => ({
                        value: r.id,
                        label: `+${r.points} pts · ${r.title}`,
                      })),
                      { value: "custom", label: "Custom Bonus Amount" },
                    ]}
                  />
                </div>

                <div>
                  <label className="block font-bold text-[var(--vt-color-indigo-900,#261A66)] mb-1">
                    Points to Give
                  </label>
                  <input
                    type="number"
                    min={5}
                    step={5}
                    required
                    value={awardPoints}
                    onChange={(e) => {
                      setAwardPoints(e.target.value);
                      setSelectedRuleId("custom");
                    }}
                    className="w-full h-9 px-3 rounded-lg border border-[var(--vt-color-border-default,#E2E0EC)] bg-white font-mono font-bold outline-none focus:border-[var(--vt-color-orange-500,#EF5F18)]"
                  />
                </div>

                <div>
                  <label className="block font-bold text-[var(--vt-color-indigo-900,#261A66)] mb-1">
                    Reason
                  </label>
                  <input
                    type="text"
                    value={awardReason}
                    onChange={(e) => setAwardReason(e.target.value)}
                    placeholder="e.g. Completed slab pour ahead of schedule"
                    className="w-full h-9 px-3 rounded-lg border border-[var(--vt-color-border-default,#E2E0EC)] bg-white outline-none focus:border-[var(--vt-color-orange-500,#EF5F18)]"
                  />
                </div>

                <div className="pt-2 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setIsAwardOpen(false)}
                    className="h-9 px-4 rounded-lg border border-[var(--vt-color-border-default,#E2E0EC)] font-bold text-[var(--vt-color-neutral-600,#5E5A7D)] cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="h-9 px-4 rounded-lg bg-[var(--vt-color-orange-500,#EF5F18)] hover:bg-[var(--vt-color-orange-600,#D84C0B)] text-white font-bold cursor-pointer"
                  >
                    Give Points
                  </button>
                </div>
              </form>
            </div>
          </div>,
          document.body
        )}

      {/* Add / Edit Reward Rule Modal (Portaled above navbar) */}
      {mounted &&
        isRuleModalOpen &&
        createPortal(
          <div
            style={{ fontFamily: "'Outfit', var(--vt-font-sans), sans-serif" }}
            className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-[var(--vt-color-indigo-950,#140B3B)]/55 backdrop-blur-xs select-none font-sans"
            onClick={() => setIsRuleModalOpen(false)}
          >
            <div
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-md bg-white border border-[var(--vt-color-border-default,#E2E0EC)] rounded-2xl shadow-2xl overflow-hidden text-[var(--vt-color-text-default,#261A66)]"
            >
              <div className="px-5 py-4 border-b border-[var(--vt-color-border-default,#E2E0EC)] bg-[var(--vt-color-neutral-50,#F7F7FA)] flex items-center justify-between">
                <h3 className="text-base font-extrabold text-[var(--vt-color-indigo-900,#261A66)]">
                  {editingRuleId ? "Edit Reward Rule" : "Add New Reward Rule"}
                </h3>
                <button
                  type="button"
                  onClick={() => setIsRuleModalOpen(false)}
                  className="w-7 h-7 rounded-lg hover:bg-[var(--vt-color-neutral-200,#E2E0EC)] text-[var(--vt-color-neutral-500,#7C7894)] flex items-center justify-center cursor-pointer"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleSaveRule} className="p-5 space-y-3.5 text-xs">
                <div>
                  <label className="block font-bold text-[var(--vt-color-indigo-900,#261A66)] mb-1">
                    Rule Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={ruleForm.title}
                    onChange={(e) => setRuleForm({ ...ruleForm, title: e.target.value })}
                    placeholder="e.g. Zero Safety Incidents This Month"
                    className="w-full h-9 px-3 rounded-lg border border-[var(--vt-color-border-default,#E2E0EC)] bg-white font-semibold outline-none focus:border-[var(--vt-color-orange-500,#EF5F18)]"
                  />
                </div>

                <div>
                  <label className="block font-bold text-[var(--vt-color-indigo-900,#261A66)] mb-1">
                    Points Awarded *
                  </label>
                  <input
                    type="number"
                    min={5}
                    step={5}
                    required
                    value={ruleForm.points}
                    onChange={(e) => setRuleForm({ ...ruleForm, points: e.target.value })}
                    className="w-full h-9 px-3 rounded-lg border border-[var(--vt-color-border-default,#E2E0EC)] bg-white font-mono font-bold outline-none focus:border-[var(--vt-color-orange-500,#EF5F18)]"
                  />
                </div>

                <div>
                  <label className="block font-bold text-[var(--vt-color-indigo-900,#261A66)] mb-1">
                    How Staff Earn It
                  </label>
                  <textarea
                    rows={2}
                    value={ruleForm.desc}
                    onChange={(e) => setRuleForm({ ...ruleForm, desc: e.target.value })}
                    placeholder="Describe what the team member needs to do..."
                    className="w-full p-2.5 rounded-lg border border-[var(--vt-color-border-default,#E2E0EC)] bg-white outline-none focus:border-[var(--vt-color-orange-500,#EF5F18)] resize-none"
                  />
                </div>

                <div className="pt-2 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setIsRuleModalOpen(false)}
                    className="h-9 px-4 rounded-lg border border-[var(--vt-color-border-default,#E2E0EC)] font-bold text-[var(--vt-color-neutral-600,#5E5A7D)] cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="h-9 px-4 rounded-lg bg-[var(--vt-color-orange-500,#EF5F18)] hover:bg-[var(--vt-color-orange-600,#D84C0B)] text-white font-bold cursor-pointer"
                  >
                    {editingRuleId ? "Save Changes" : "Add Rule"}
                  </button>
                </div>
              </form>
            </div>
          </div>,
          document.body
        )}

      {/* Toast */}
      {mounted &&
        toastMessage &&
        createPortal(
          <div
            style={{ fontFamily: "'Outfit', var(--vt-font-sans), sans-serif" }}
            className="fixed bottom-6 right-6 z-[130] px-4 py-2.5 rounded-xl bg-[var(--vt-color-indigo-900,#261A66)] text-white text-xs font-bold shadow-xl select-none font-sans"
          >
            ✓ {toastMessage}
          </div>,
          document.body
        )}
    </div>
  );
}
