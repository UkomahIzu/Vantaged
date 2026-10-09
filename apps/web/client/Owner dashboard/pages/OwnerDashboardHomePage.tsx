"use client";

import React from "react";
import { SidebarNav } from "../components/SidebarNav";
import { HeaderBar } from "../components/HeaderBar";
import { HeroGreeting } from "../components/HeroGreeting";
import { QuickActionCards } from "../components/QuickActionCards";
import { ActiveProjectProgressCard } from "../components/ActiveProjectProgressCard";
import { ContractHistoryCard } from "../components/ContractHistoryCard";
import { NotificationsCard } from "../components/NotificationsCard";

export function OwnerDashboardHomePage() {
  return (
    <div
      style={{ fontFamily: "var(--vt-font-sans), var(--font-sans), sans-serif" }}
      className="h-screen w-screen max-h-screen max-w-screen overflow-hidden bg-[var(--vt-color-background-subtle,#F7F7FA)] flex flex-col md:flex-row font-sans text-[var(--vt-color-text-default,#261A66)] select-none relative"
    >
      {/* Subtle decorative background vector waves matching the reference */}
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

      {/* ── Left Sidebar Navigation Bar (Drive Storage reference style) ── */}
      <SidebarNav />

      {/* ── Main Dashboard Workspace (Takes remaining 100% width and height, internal scroll safe) ── */}
      <main className="relative z-10 flex-1 h-full max-h-screen overflow-y-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-5 flex flex-col gap-5 sm:gap-6">
        {/* Top Header Navigation Bar */}
        <HeaderBar />

        {/* Top Section: Hero Greeting & 4 Squircle Action Cards */}
        <section className="grid grid-cols-1 xl:grid-cols-12 gap-5 items-center">
          {/* Left Hero Greeting (Columns 1-5 on xl) */}
          <div className="xl:col-span-5 pr-0 xl:pr-4">
            <HeroGreeting />
          </div>

          {/* Right 4 Quick Action Cards (Columns 6-12 on xl) */}
          <div className="xl:col-span-7">
            <QuickActionCards />
          </div>
        </section>

        {/* Middle Section: Live Construction Milestone Progress Card */}
        <section className="w-full">
          <ActiveProjectProgressCard />
        </section>

        {/* Bottom Section: Contract History (Left) and Notifications (Right) */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-6 w-full pb-8">
          <div className="lg:col-span-7 xl:col-span-8">
            <ContractHistoryCard />
          </div>
          <div className="lg:col-span-5 xl:col-span-4">
            <NotificationsCard />
          </div>
        </section>
      </main>
    </div>
  );
}
