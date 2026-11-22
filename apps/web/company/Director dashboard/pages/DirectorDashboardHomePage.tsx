"use client";

import React from "react";
import { useScrollRestoration } from "../../../client/Owner dashboard/hooks/useScrollRestoration";
import { DirectorSidebarNav } from "../components/DirectorSidebarNav";
import { DirectorHeaderBar } from "../components/DirectorHeaderBar";
import { DirectorHeroGreeting } from "../components/DirectorHeroGreeting";
import { DirectorQuickActions } from "../components/DirectorQuickActions";
import { DirectorStatsCards } from "../components/DirectorStatsCards";
import { DirectorPortfolioAndQueue } from "../components/DirectorPortfolioAndQueue";
import { DirectorBottomSummary } from "../components/DirectorBottomSummary";

export function DirectorDashboardHomePage() {
  const scrollRef = useScrollRestoration<HTMLElement>("director_home");

  return (
    <div
      style={{ fontFamily: "'Outfit', var(--vt-font-sans), sans-serif" }}
      className="h-screen w-screen max-h-screen max-w-screen overflow-hidden bg-[var(--vt-color-background-subtle,#F7F7FA)] flex flex-col md:flex-row font-sans text-[var(--vt-color-text-default,#261A66)] select-none relative"
    >
      {/* Subtle decorative background vector waves matching Owner Dashboard */}
      <div className="absolute inset-0 pointer-events-none opacity-40 z-0 overflow-hidden">
        <svg className="w-full h-full" viewBox="0 0 1440 900" fill="none" preserveAspectRatio="none">
          <path
            d="M-100 200 C 300 100, 600 450, 1500 100"
            stroke="var(--vt-color-neutral-300,#CBC8DA)"
            strokeWidth="1.2"
            fill="none"
          />
          <path
            d="M-50 750 C 400 650, 800 850, 1550 650"
            stroke="var(--vt-color-neutral-300,#CBC8DA)"
            strokeWidth="1.2"
            fill="none"
          />
          <circle cx="1380" cy="550" r="4" fill="var(--vt-color-orange-500,#EF5F18)" fillOpacity="0.6" />
          <circle cx="80" cy="650" r="4" fill="var(--vt-color-green-500,#2E9E57)" fillOpacity="0.6" />
        </svg>
      </div>

      {/* Left Sidebar Navigation Bar */}
      <DirectorSidebarNav currentActiveItem="home" />

      {/* Main Director Workspace */}
      <main
        ref={scrollRef}
        className="relative z-10 flex-1 h-full max-h-screen overflow-y-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-5 flex flex-col gap-5 sm:gap-6 pb-24 md:pb-8 scrollbar-thin"
      >
        <DirectorHeaderBar />

        {/* Hero Greeting & 4 Squircle Quick Actions */}
        <section className="grid grid-cols-1 xl:grid-cols-12 gap-5 items-center">
          <div className="xl:col-span-5 pr-0 xl:pr-4">
            <DirectorHeroGreeting />
          </div>
          <div className="xl:col-span-7">
            <DirectorQuickActions />
          </div>
        </section>

        {/* Executive KPI Summary Cards */}
        <section className="w-full">
          <DirectorStatsCards />
        </section>

        {/* Portfolio Progress + Waiting on You Action Queue */}
        <section className="w-full">
          <DirectorPortfolioAndQueue />
        </section>

        {/* Team, Rewards & Corporate Compliance */}
        <DirectorBottomSummary />
      </main>
    </div>
  );
}
