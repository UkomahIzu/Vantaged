import React from "react";

export function FooterSection() {
  return (
    <footer id="support" className="relative bg-[var(--vt-color-neutral-950,#12101F)] text-white pt-20 pb-12 px-6 sm:px-10 lg:px-14 border-t border-[var(--vt-color-neutral-800,#2F2C45)]">
      <div className="max-w-6xl mx-auto flex flex-col gap-16">
        {/* Top Row: Brand & Mission */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 items-start">
          <div className="md:col-span-4 flex flex-col gap-4">
            <a href="/" className="inline-block">
              <img
                src="/brand/vantaged-measurement-logo.svg"
                alt="Vantaged"
                className="h-8 w-auto max-w-[190px] object-contain brightness-0 invert"
              />
            </a>
            <p className="text-xs text-[var(--vt-color-neutral-400,#A3A0B8)] leading-relaxed max-w-sm">
              The trust-first construction tracking platform. Monitor every milestone, verify proof with cryptographic telemetry, and release funds with confidence.
            </p>
            <div className="pt-2">
              <span className="text-[11px] font-mono font-medium text-[var(--vt-color-orange-400,#F6803F)] block">
                BUILT FOR GLOBAL REAL ESTATE &amp; INFRASTRUCTURE
              </span>
            </div>
          </div>

          <div className="md:col-span-8 grid grid-cols-2 sm:grid-cols-3 gap-8">
            {/* Column 1: Platform */}
            <div>
              <span className="text-xs font-bold font-mono tracking-wider uppercase text-[var(--vt-color-neutral-300,#CBC8DA)] block mb-4">
                Platform
              </span>
              <ul className="space-y-2.5 text-xs text-[var(--vt-color-neutral-400,#A3A0B8)]">
                <li>
                  <a href="/stakeholders" className="hover:text-white transition-colors">
                    Stakeholders Overview
                  </a>
                </li>
                <li>
                  <a href="/the-advantage" className="hover:text-white transition-colors">
                    The Vantaged Advantage
                  </a>
                </li>
                <li>
                  <a href="/pricing" className="hover:text-white transition-colors">
                    Pricing &amp; Terms
                  </a>
                </li>
                <li>
                  <a href="/support" className="hover:text-white transition-colors">
                    Support &amp; Consultation
                  </a>
                </li>
                <li>
                  <a href="/owner/find-companies" className="hover:text-white transition-colors">
                    Verified Company Directory
                  </a>
                </li>
              </ul>
            </div>

            {/* Column 2: Stakeholders */}
            <div>
              <span className="text-xs font-bold font-mono tracking-wider uppercase text-[var(--vt-color-neutral-300,#CBC8DA)] block mb-4">
                Stakeholders
              </span>
              <ul className="space-y-2.5 text-xs text-[var(--vt-color-neutral-400,#A3A0B8)]">
                <li>
                  <a href="/stakeholders/owners" className="hover:text-white transition-colors">
                    Property Owners &amp; Diaspora
                  </a>
                </li>
                <li>
                  <a href="/stakeholders/contractors" className="hover:text-white transition-colors">
                    General Contractors &amp; Builders
                  </a>
                </li>
                <li>
                  <a href="/stakeholders/specialists" className="hover:text-white transition-colors">
                    Engineers &amp; Site Inspectors
                  </a>
                </li>
                <li>
                  <a href="/stakeholders" className="hover:text-white transition-colors">
                    Stakeholders Gateway
                  </a>
                </li>
                <li>
                  <a href="/signup/owner" className="hover:text-white transition-colors">
                    Create Free Owner Account
                  </a>
                </li>
              </ul>
            </div>

            {/* Column 3: Trust & Compliance */}
            <div>
              <span className="text-xs font-bold font-mono tracking-wider uppercase text-[var(--vt-color-neutral-300,#CBC8DA)] block mb-4">
                Trust &amp; Security
              </span>
              <ul className="space-y-2.5 text-xs text-[var(--vt-color-neutral-400,#A3A0B8)]">
                <li>
                  <span className="text-[var(--vt-color-neutral-300,#CBC8DA)]">Registered Entity Verification</span>
                </li>
                <li>
                  <span className="text-[var(--vt-color-neutral-300,#CBC8DA)]">Corporate Tax &amp; ID Validation</span>
                </li>
                <li>
                  <span className="text-[var(--vt-color-neutral-300,#CBC8DA)]">Director Identity Authentication</span>
                </li>
                <li>
                  <span className="text-[var(--vt-color-neutral-300,#CBC8DA)]">Segregated Bank Escrow Guard</span>
                </li>
                <li>
                  <span className="text-[var(--vt-color-neutral-300,#CBC8DA)]">Enterprise Data Privacy (GDPR &amp; ISO)</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom Bar: Copyright & Compliance */}
        <div className="border-t border-[var(--vt-color-neutral-800,#2F2C45)] pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[var(--vt-color-neutral-500,#7C7894)]">
          <p>
            &copy; {new Date().getFullYear()} Vantaged Technologies Limited. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <a href="#terms" className="hover:text-white transition-colors">
              Terms of Service
            </a>
            <a href="#privacy" className="hover:text-white transition-colors">
              Privacy Policy
            </a>
            <a href="#ndpa" className="hover:text-white transition-colors">
              NDPA Compliance
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

