"use client";

import React, { useState, useRef, useEffect } from "react";
import { defaultNavLinks } from "../data/navigation";
import { LanguageDropdown } from "../components/LanguageDropdown";
import type { NavItem } from "../types";

export interface NavbarProps {
  navLinks?: NavItem[];
  activeLinkId?: string;
}

export function Navbar({
  navLinks = defaultNavLinks,
  activeLinkId = "nav-home",
}: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [openDropdownId, setOpenDropdownId] = useState<string | null>(null);
  const [signupDropdownOpen, setSignupDropdownOpen] = useState(false);
  const navContainerRef = useRef<HTMLElement>(null);
  const signupContainerRef = useRef<HTMLDivElement>(null);

  // Close dropdowns when clicking outside or pressing Escape
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (navContainerRef.current && !navContainerRef.current.contains(event.target as Node)) {
        setOpenDropdownId(null);
      }
      if (signupContainerRef.current && !signupContainerRef.current.contains(event.target as Node)) {
        setSignupDropdownOpen(false);
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setOpenDropdownId(null);
        setSignupDropdownOpen(false);
      }
    }

    if (openDropdownId || signupDropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("keydown", handleKeyDown);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [openDropdownId, signupDropdownOpen]);

  return (
    <header className="relative z-30 w-full max-w-6xl mx-auto shrink-0">
      <div className="flex items-center justify-between w-full py-2">
        {/* ── Brand Logo (10% Indigo anchor + 30% Orange dot) ── */}
        <a
          id="nav-brand-logo"
          href="/"
          className="group flex items-baseline font-bold text-xl sm:text-2xl tracking-tight text-[var(--vt-color-indigo-900,#261A66)] transition-opacity hover:opacity-90"
          aria-label="Vantaged Homepage"
        >
          <span>vantaged</span>
          <span className="text-[var(--vt-color-orange-500,#EF5F18)] text-xl sm:text-2xl font-black transition-transform duration-300 group-hover:scale-125">
            .
          </span>
          <span className="text-[9px] font-normal align-top ml-0.5 text-[var(--vt-color-text-muted,#7C7894)]">
            ®
          </span>
        </a>

        {/* ── Center Navigation Links (Plain on the page, with dropdown support) ── */}
        <nav
          ref={navContainerRef}
          id="desktop-navigation"
          aria-label="Main Navigation"
          className="hidden md:flex items-center gap-5 lg:gap-7"
        >
          {navLinks.map((item) => {
            const isActive = item.id === activeLinkId;
            const hasChildren = item.children && item.children.length > 0;
            const isDropdownOpen = openDropdownId === item.id;

            if (hasChildren) {
              return (
                <div key={item.id} className="relative">
                  <button
                    id={item.id}
                    type="button"
                    onClick={() => setOpenDropdownId(isDropdownOpen ? null : item.id)}
                    aria-expanded={isDropdownOpen}
                    aria-haspopup="menu"
                    className={`flex items-center gap-1.5 text-sm tracking-tight transition-colors duration-150 cursor-pointer ${
                      isActive || isDropdownOpen
                        ? "text-[var(--vt-color-indigo-900,#261A66)] font-semibold"
                        : "text-[var(--vt-color-neutral-600,#5E5A7D)] hover:text-[var(--vt-color-indigo-900,#261A66)] font-medium"
                    }`}
                  >
                    <span>{item.label}</span>
                    <svg
                      className={`h-3.5 w-3.5 transition-transform duration-200 ${
                        isDropdownOpen
                          ? "rotate-180 text-[var(--vt-color-orange-500,#EF5F18)]"
                          : "text-[var(--vt-color-neutral-400,#A3A0B8)]"
                      }`}
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      aria-hidden="true"
                    >
                      <polyline points="6 9 12 15 18 9" />
                    </svg>
                  </button>

                  {/* Dropdown Menu (Square with slight border radius, compliant with tokens) */}
                  {isDropdownOpen && (
                    <div
                      id={`${item.id}-dropdown`}
                      role="menu"
                      className="absolute top-full left-1/2 -translate-x-1/2 mt-3 w-72 sm:w-80 bg-white border border-[var(--vt-color-neutral-200,#E2E0EC)] rounded-md shadow-[0_16px_36px_-6px_rgba(38,26,102,0.16)] p-1.5 z-40 animate-in fade-in slide-in-from-top-2 duration-150"
                    >
                      <div className="flex flex-col gap-0.5">
                        {item.children?.map((sub) => (
                          <a
                            key={sub.id}
                            id={sub.id}
                            href={sub.href}
                            onClick={() => setOpenDropdownId(null)}
                            className="group px-3 py-2 rounded-md hover:bg-[var(--vt-color-neutral-50,#F7F7FA)] transition-colors flex flex-col text-left"
                          >
                            <span className="text-xs sm:text-sm font-semibold text-[var(--vt-color-indigo-900,#261A66)] group-hover:text-[var(--vt-color-orange-600,#D84C0B)] transition-colors">
                              {sub.label}
                            </span>
                            {sub.description && (
                              <span className="text-[11px] text-[var(--vt-color-neutral-500,#7C7894)] leading-snug mt-0.5">
                                {sub.description}
                              </span>
                            )}
                          </a>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            }

            return (
              <a
                key={item.id}
                id={item.id}
                href={item.href}
                className={`text-sm tracking-tight transition-colors duration-150 ${
                  isActive
                    ? "text-[var(--vt-color-indigo-900,#261A66)] font-semibold"
                    : "text-[var(--vt-color-neutral-600,#5E5A7D)] hover:text-[var(--vt-color-indigo-900,#261A66)] font-medium"
                }`}
              >
                {item.label}
              </a>
            );
          })}
        </nav>

        {/* ── Extreme Right Actions: Global Dropdown + Login + Sign Up (Square with slight radius) ── */}
        <div className="flex items-center gap-2.5 sm:gap-3">
          {/* Global / Region Language Dropdown */}
          <LanguageDropdown />

          {/* Login Button (Square with slight border radius) */}
          <a
            id="nav-login-btn"
            href="/login"
            className="hidden sm:inline-flex items-center justify-center text-xs lg:text-sm font-semibold text-[var(--vt-color-indigo-900,#261A66)] hover:text-[var(--vt-color-orange-500,#EF5F18)] hover:bg-[var(--vt-color-neutral-100,#EFEEF5)] px-3.5 py-1.5 rounded-md transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--vt-color-orange-500,#EF5F18)]"
          >
            Log In
          </a>

          {/* Sign Up Button with Role Selection Dropdown (Contractor / Owner) */}
          <div className="relative inline-block" ref={signupContainerRef}>
            <button
              id="nav-signup-btn"
              type="button"
              onClick={() => setSignupDropdownOpen(!signupDropdownOpen)}
              aria-expanded={signupDropdownOpen}
              aria-haspopup="menu"
              className="inline-flex items-center justify-center text-xs lg:text-sm font-semibold bg-[var(--vt-color-orange-500,#EF5F18)] hover:bg-[var(--vt-color-orange-600,#D84C0B)] active:bg-[var(--vt-color-orange-700,#B33C08)] text-white px-3.5 sm:px-4 py-1.5 rounded-md shadow-[0_2px_8px_rgba(239,95,24,0.24)] hover:shadow-[0_4px_14px_rgba(239,95,24,0.34)] active:scale-95 transition-all duration-150 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--vt-color-orange-500,#EF5F18)]"
            >
              Sign Up
            </button>

            {/* Signup Role Selection Dropdown Menu */}
            {signupDropdownOpen && (
              <div
                id="signup-role-dropdown"
                role="menu"
                className="absolute right-0 top-full mt-2 w-72 sm:w-80 bg-white border border-[var(--vt-color-neutral-200,#E2E0EC)] rounded-md shadow-[0_16px_36px_-6px_rgba(38,26,102,0.16)] p-1.5 z-50 animate-in fade-in slide-in-from-top-2 duration-150"
              >
                <div className="flex flex-col gap-0.5">
                  {/* Contractor Option */}
                  <a
                    id="signup-role-contractor"
                    href="/signup?role=contractor"
                    onClick={() => setSignupDropdownOpen(false)}
                    className="group px-3 py-2 rounded-md hover:bg-[var(--vt-color-neutral-50,#F7F7FA)] transition-colors flex flex-col text-left"
                  >
                    <span className="text-xs sm:text-sm font-semibold text-[var(--vt-color-indigo-900,#261A66)] group-hover:text-[var(--vt-color-orange-600,#D84C0B)] transition-colors">
                      Contractor
                    </span>
                    <span className="text-[11px] text-[var(--vt-color-neutral-500,#7C7894)] leading-snug mt-0.5">
                      Submit milestone proof, request site verification & receive automated stage payouts
                    </span>
                  </a>

                  {/* Owner Option */}
                  <a
                    id="signup-role-owner"
                    href="/signup/owner"
                    onClick={() => setSignupDropdownOpen(false)}
                    className="group px-3 py-2 rounded-md hover:bg-[var(--vt-color-neutral-50,#F7F7FA)] transition-colors flex flex-col text-left"
                  >
                    <span className="text-xs sm:text-sm font-semibold text-[var(--vt-color-indigo-900,#261A66)] group-hover:text-[var(--vt-color-orange-600,#D84C0B)] transition-colors">
                      Owner
                    </span>
                    <span className="text-[11px] text-[var(--vt-color-neutral-500,#7C7894)] leading-snug mt-0.5">
                      Monitor build telemetry, verify milestones & approve tamper-proof escrow releases
                    </span>
                  </a>
                </div>
              </div>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <button
            id="nav-mobile-toggle"
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden h-8 w-8 rounded-md flex items-center justify-center text-[var(--vt-color-indigo-900,#261A66)] hover:bg-[var(--vt-color-neutral-100,#EFEEF5)] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--vt-color-orange-500,#EF5F18)]"
            aria-expanded={mobileMenuOpen}
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? (
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* ── Mobile Navigation Dropdown Menu ── */}
      {mobileMenuOpen && (
        <div
          id="mobile-navigation-dropdown"
          className="md:hidden absolute top-full left-0 right-0 mt-2 p-4 bg-white/95 backdrop-blur-xl border border-[var(--vt-color-neutral-200,#E2E0EC)] rounded-md shadow-xl z-50 flex flex-col gap-2 transition-all duration-150"
        >
          {navLinks.map((item) => (
            <div key={item.id} className="flex flex-col">
              <a
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className="px-3 py-2 text-sm font-medium text-[var(--vt-color-neutral-700,#46425F)] hover:text-[var(--vt-color-indigo-900,#261A66)] hover:bg-[var(--vt-color-neutral-100,#EFEEF5)] rounded-md transition-colors flex items-center justify-between"
              >
                <span>{item.label}</span>
              </a>

              {/* Sub-items for mobile */}
              {item.children && (
                <div className="pl-3 pr-1 py-1 flex flex-col gap-1 border-l-2 border-[var(--vt-color-neutral-200,#E2E0EC)] ml-3 my-1">
                  {item.children.map((sub) => (
                    <a
                      key={sub.id}
                      href={sub.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className="px-2.5 py-1.5 text-xs text-[var(--vt-color-neutral-600,#5E5A7D)] hover:text-[var(--vt-color-indigo-900,#261A66)] hover:bg-[var(--vt-color-neutral-100,#EFEEF5)] rounded transition-colors flex items-center justify-between"
                    >
                      <span className="font-medium">{sub.label}</span>
                    </a>
                  ))}
                </div>
              )}
            </div>
          ))}

          <div className="pt-3 mt-2 border-t border-[var(--vt-color-neutral-200,#E2E0EC)] flex flex-col gap-2">
            <a
              href="/login"
              onClick={() => setMobileMenuOpen(false)}
              className="text-center py-2 text-sm font-semibold text-[var(--vt-color-indigo-900,#261A66)] hover:bg-[var(--vt-color-neutral-100,#EFEEF5)] rounded-md transition-colors"
            >
              Log In
            </a>
            <div className="flex flex-col gap-1.5 pt-1 border-t border-[var(--vt-color-neutral-100,#EFEEF5)]">
              <span className="text-[10px] font-sans text-[var(--vt-color-neutral-400,#A3A0B8)] uppercase tracking-wider px-1">
                Sign Up As
              </span>
              <div className="flex gap-2">
                <a
                  href="/signup?role=contractor"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex-1 text-center py-2 text-xs font-semibold bg-[var(--vt-color-neutral-100,#EFEEF5)] text-[var(--vt-color-indigo-900,#261A66)] hover:bg-[var(--vt-color-neutral-200,#E2E0EC)] rounded-md transition-colors"
                >
                  Contractor
                </a>
                <a
                  href="/signup/owner"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex-1 text-center py-2 text-xs font-semibold bg-[var(--vt-color-orange-500,#EF5F18)] hover:bg-[var(--vt-color-orange-600,#D84C0B)] text-white rounded-md shadow-sm transition-colors"
                >
                  Owner
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
