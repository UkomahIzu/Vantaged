"use client";

import React, { useState } from "react";

export interface PropertySite {
  id: string;
  name: string;
  location: string;
  temp: number;
  condition: string;
  high: number;
  low: number;
  humidity: number;
  windSpeed: string;
  rainChance: number;
  weatherStatus: string;
  isDelay: boolean;
  forecast: { time: string; temp: number; icon: string }[];
}

export const OWNER_SITES: PropertySite[] = [
  {
    id: "site-lekki",
    name: "Villa Victoria",
    location: "Lekki Phase 1, Lagos",
    temp: 31,
    condition: "Partly Cloudy",
    high: 33,
    low: 26,
    humidity: 74,
    windSpeed: "14 km/h",
    rainChance: 12,
    weatherStatus: "Work is ongoing · No rain delays recorded",
    isDelay: false,
    forecast: [
      { time: "12 PM", temp: 31, icon: "partly-cloudy" },
      { time: "02 PM", temp: 32, icon: "sunny" },
      { time: "04 PM", temp: 30, icon: "partly-cloudy" },
      { time: "06 PM", temp: 28, icon: "cloudy" },
    ],
  },
  {
    id: "site-epe",
    name: "The Enclave Resort",
    location: "Epe, Lagos",
    temp: 28,
    condition: "Light Rain",
    high: 29,
    low: 24,
    humidity: 88,
    windSpeed: "18 km/h",
    rainChance: 70,
    weatherStatus: "Rain delay logged · Outdoor work paused",
    isDelay: true,
    forecast: [
      { time: "12 PM", temp: 28, icon: "rain" },
      { time: "02 PM", temp: 27, icon: "rain" },
      { time: "04 PM", temp: 28, icon: "cloudy" },
      { time: "06 PM", temp: 26, icon: "cloudy" },
    ],
  },
  {
    id: "site-guzape",
    name: "Guzape Hills Residence",
    location: "Guzape, Abuja",
    temp: 34,
    condition: "Sunny & Dry",
    high: 36,
    low: 22,
    humidity: 38,
    windSpeed: "11 km/h",
    rainChance: 0,
    weatherStatus: "Optimal dry weather · Work on schedule",
    isDelay: false,
    forecast: [
      { time: "12 PM", temp: 34, icon: "sunny" },
      { time: "02 PM", temp: 36, icon: "sunny" },
      { time: "04 PM", temp: 33, icon: "sunny" },
      { time: "06 PM", temp: 29, icon: "sunny" },
    ],
  },
  {
    id: "site-banana",
    name: "Ocean View Terrace",
    location: "Banana Island, Lagos",
    temp: 30,
    condition: "Breezy & Clear",
    high: 32,
    low: 25,
    humidity: 71,
    windSpeed: "16 km/h",
    rainChance: 8,
    weatherStatus: "Safe weather conditions",
    isDelay: false,
    forecast: [
      { time: "12 PM", temp: 30, icon: "sunny" },
      { time: "02 PM", temp: 31, icon: "partly-cloudy" },
      { time: "04 PM", temp: 30, icon: "sunny" },
      { time: "06 PM", temp: 27, icon: "breezy" },
    ],
  },
];

interface SiteWeatherModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SiteWeatherModal({ isOpen, onClose }: SiteWeatherModalProps) {
  const [selectedSiteId, setSelectedSiteId] = useState<string>("site-lekki");
  const [isSiteDropdownOpen, setIsSiteDropdownOpen] = useState<boolean>(false);

  if (!isOpen) return null;

  const activeSite = OWNER_SITES.find((s) => s.id === selectedSiteId) || OWNER_SITES[0];

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs select-none font-sans"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-[460px] bg-white border border-[var(--vt-color-border-default,#E2E0EC)] rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200"
      >
        {/* Modal Header */}
        <div className="p-4 sm:p-5 border-b border-[var(--vt-color-neutral-100,#EFEEF5)] flex items-center justify-between shrink-0 bg-white">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-md bg-[var(--vt-color-orange-50,#FFF4EE)] text-[var(--vt-color-orange-600,#D84C0B)] border border-[var(--vt-color-orange-200,#FDCAA9)] flex items-center justify-center shrink-0">
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="4" />
                <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" />
              </svg>
            </div>
            <div>
              <h2 className="text-base font-extrabold text-[var(--vt-color-indigo-900,#261A66)] tracking-tight">
                Site Weather & Radar
              </h2>
              <p className="text-xs text-[var(--vt-color-neutral-500,#7C7894)] mt-0.5">
                Live conditions at your project sites
              </p>
            </div>
          </div>

          {/* Close Button */}
          <button
            type="button"
            onClick={onClose}
            title="Close"
            className="w-8 h-8 rounded-md bg-[var(--vt-color-neutral-100,#EFEEF5)] hover:bg-[var(--vt-color-neutral-200,#E2E0EC)] text-[var(--vt-color-neutral-600,#5E5A7D)] flex items-center justify-center transition-colors cursor-pointer"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-4 sm:p-5 flex flex-col gap-4 overflow-y-auto">
          {/* Site Selector Dropdown Button (Strictly Restricted to Owner's Sites) */}
          <div className="relative">
            <label className="text-[11px] font-bold text-[var(--vt-color-neutral-500,#7C7894)] uppercase tracking-wider block mb-1.5">
              Select Property Location
            </label>
            <button
              type="button"
              onClick={() => setIsSiteDropdownOpen(!isSiteDropdownOpen)}
              className="w-full h-10 px-3 rounded-lg bg-[var(--vt-color-neutral-50,#F7F7FA)] hover:bg-[var(--vt-color-orange-50,#FFF4EE)] hover:border-[var(--vt-color-orange-300,#FBA674)] border border-[var(--vt-color-border-default,#E2E0EC)] text-xs font-bold text-[var(--vt-color-indigo-900,#261A66)] flex items-center justify-between transition-all cursor-pointer shadow-2xs font-sans"
            >
              <div className="flex items-center gap-2 min-w-0">
                <svg className="w-4 h-4 text-[var(--vt-color-orange-500,#EF5F18)] shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                  <circle cx="12" cy="10" r="3" />
                </svg>
                <div className="text-left truncate">
                  <span className="font-extrabold text-[var(--vt-color-indigo-900,#261A66)] block truncate leading-tight">
                    {activeSite.name}
                  </span>
                  <span className="text-[10px] text-[var(--vt-color-neutral-500,#7C7894)] block truncate font-normal">
                    {activeSite.location}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <span className="text-xs font-bold text-[var(--vt-color-neutral-600,#5E5A7D)] font-mono">
                  {activeSite.temp}°C
                </span>
                <svg className="w-3.5 h-3.5 text-[var(--vt-color-neutral-400,#A3A0B8)]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <polyline points="6 9 12 15 18 9" />
                </svg>
              </div>
            </button>

            {/* Dropdown Menu */}
            {isSiteDropdownOpen && (
              <>
                <div
                  className="fixed inset-0 z-20"
                  onClick={() => setIsSiteDropdownOpen(false)}
                />
                <div className="absolute left-0 right-0 top-17 bg-white border border-[var(--vt-color-border-default,#E2E0EC)] rounded-xl shadow-xl py-1.5 z-30 animate-in fade-in zoom-in-95 duration-150">
                  <div className="px-3 py-1.5 border-b border-[var(--vt-color-neutral-100,#EFEEF5)]">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--vt-color-neutral-400,#A3A0B8)]">
                      Your Registered Sites ({OWNER_SITES.length})
                    </span>
                  </div>
                  {OWNER_SITES.map((site) => (
                    <button
                      key={site.id}
                      type="button"
                      onClick={() => {
                        setSelectedSiteId(site.id);
                        setIsSiteDropdownOpen(false);
                      }}
                      className={`w-full text-left px-3 py-2 flex items-center justify-between hover:bg-[var(--vt-color-orange-50,#FFF4EE)] transition-colors cursor-pointer ${
                        selectedSiteId === site.id ? "bg-[var(--vt-color-orange-50,#FFF4EE)]/80" : ""
                      }`}
                    >
                      <div className="min-w-0 pr-2">
                        <span className="text-xs font-bold text-[var(--vt-color-indigo-900,#261A66)] block truncate">
                          {site.name}
                        </span>
                        <span className="text-[10px] text-[var(--vt-color-neutral-500,#7C7894)] block truncate">
                          {site.location}
                        </span>
                      </div>
                      <span className="text-xs font-bold text-[var(--vt-color-neutral-600,#5E5A7D)] font-mono">
                        {site.temp}°C
                      </span>
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>

          {/* Real Weather Atmosphere Display */}
          <div className="p-4 rounded-xl bg-gradient-to-br from-[var(--vt-color-indigo-900,#261A66)] to-[var(--vt-color-indigo-800,#342982)] text-white shadow-sm relative overflow-hidden">
            <div className="absolute -right-4 -bottom-4 w-28 h-28 bg-[var(--vt-color-orange-500,#EF5F18)]/25 rounded-full blur-xl pointer-events-none" />

            <div className="flex items-center justify-between relative z-10">
              <div>
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl sm:text-5xl font-extrabold tracking-tight">
                    {activeSite.temp}°
                  </span>
                  <span className="text-base font-medium text-white/80">C</span>
                </div>
                <span className="text-sm font-semibold text-white/95 block mt-0.5">
                  {activeSite.condition}
                </span>
                <span className="text-xs text-white/60 block mt-0.5 font-medium">
                  High: {activeSite.high}° · Low: {activeSite.low}°
                </span>
              </div>

              {/* Vector Graphic Weather Illustration */}
              <div className="w-18 h-18 flex items-center justify-center shrink-0">
                {activeSite.isDelay ? (
                  <svg className="w-16 h-16 drop-shadow-md" viewBox="0 0 64 64" fill="none">
                    <path
                      d="M20 38C15.58 38 12 34.42 12 30C12 25.82 15.18 22.38 19.26 22.04C20.66 16.27 25.83 12 32 12C39.18 12 45.1 17.41 45.92 24.41C49.38 25.26 52 28.38 52 32C52 36.42 48.42 40 44 40H20"
                      fill="#818CF8"
                      fillOpacity="0.4"
                      stroke="#C7D2FE"
                      strokeWidth="2.5"
                      strokeLinejoin="round"
                    />
                    <line x1="22" y1="46" x2="18" y2="54" stroke="#60A5FA" strokeWidth="2.5" strokeLinecap="round" />
                    <line x1="32" y1="46" x2="28" y2="54" stroke="#60A5FA" strokeWidth="2.5" strokeLinecap="round" />
                    <line x1="42" y1="46" x2="38" y2="54" stroke="#60A5FA" strokeWidth="2.5" strokeLinecap="round" />
                  </svg>
                ) : (
                  <svg className="w-16 h-16 drop-shadow-md" viewBox="0 0 64 64" fill="none">
                    <circle cx="32" cy="32" r="13" fill="#FBA674" stroke="#EF5F18" strokeWidth="2.5" />
                    <path d="M32 8V13M32 51V56M8 32H13M51 32H56M15 15L18.5 18.5M45.5 45.5L49 49M15 49L18.5 45.5M45.5 18.5L49 15" stroke="#FBA674" strokeWidth="3" strokeLinecap="round" />
                  </svg>
                )}
              </div>
            </div>
          </div>

          {/* Radar Work Delay Status */}
          <div
            className={`p-2.5 rounded-lg border flex items-center gap-2.5 ${
              activeSite.isDelay
                ? "bg-[var(--vt-color-orange-50,#FFF4EE)] border-[var(--vt-color-orange-200,#FDCAA9)]"
                : "bg-[var(--vt-color-green-50,#E9F6EC)] border-[var(--vt-color-green-200,#A3D9B1)]"
            }`}
          >
            <div
              className={`w-2 h-2 rounded-full shrink-0 ${
                activeSite.isDelay
                  ? "bg-[var(--vt-color-orange-500,#EF5F18)] animate-pulse"
                  : "bg-[var(--vt-color-green-500,#2E9E57)]"
              }`}
            />
            <span
              className={`text-xs font-bold leading-tight ${
                activeSite.isDelay
                  ? "text-[var(--vt-color-orange-800,#8F320D)]"
                  : "text-[var(--vt-color-green-800,#144D2A)]"
              }`}
            >
              {activeSite.weatherStatus}
            </span>
          </div>

          {/* Key Atmospheric Telemetry (3-Column Strip) */}
          <div className="grid grid-cols-3 gap-2">
            <div className="p-2.5 rounded-lg bg-[var(--vt-color-neutral-50,#F7F7FA)] border border-[var(--vt-color-border-default,#E2E0EC)] text-center">
              <span className="text-[10px] text-[var(--vt-color-neutral-500,#7C7894)] font-semibold block uppercase">
                Rain Chance
              </span>
              <span className="text-sm font-extrabold text-[var(--vt-color-indigo-900,#261A66)] mt-0.5 block font-mono">
                {activeSite.rainChance}%
              </span>
            </div>
            <div className="p-2.5 rounded-lg bg-[var(--vt-color-neutral-50,#F7F7FA)] border border-[var(--vt-color-border-default,#E2E0EC)] text-center">
              <span className="text-[10px] text-[var(--vt-color-neutral-500,#7C7894)] font-semibold block uppercase">
                Wind Speed
              </span>
              <span className="text-sm font-extrabold text-[var(--vt-color-indigo-900,#261A66)] mt-0.5 block font-mono">
                {activeSite.windSpeed}
              </span>
            </div>
            <div className="p-2.5 rounded-lg bg-[var(--vt-color-neutral-50,#F7F7FA)] border border-[var(--vt-color-border-default,#E2E0EC)] text-center">
              <span className="text-[10px] text-[var(--vt-color-neutral-500,#7C7894)] font-semibold block uppercase">
                Humidity
              </span>
              <span className="text-sm font-extrabold text-[var(--vt-color-indigo-900,#261A66)] mt-0.5 block font-mono">
                {activeSite.humidity}%
              </span>
            </div>
          </div>

          {/* 4-Hour Mini Timeline Forecast */}
          <div>
            <span className="text-[11px] font-bold text-[var(--vt-color-neutral-500,#7C7894)] uppercase tracking-wider block mb-1.5">
              4-Hour Timeline
            </span>
            <div className="grid grid-cols-4 gap-2">
              {activeSite.forecast.map((f, i) => (
                <div
                  key={i}
                  className="p-2 rounded-lg bg-[var(--vt-color-neutral-50,#F7F7FA)] border border-[var(--vt-color-border-default,#E2E0EC)] text-center flex flex-col items-center justify-center"
                >
                  <span className="text-[10px] text-[var(--vt-color-neutral-500,#7C7894)] font-medium">
                    {f.time}
                  </span>
                  <div className="my-1 text-xs">
                    {f.icon === "rain" ? "🌧️" : f.icon === "sunny" ? "☀️" : "⛅"}
                  </div>
                  <span className="text-xs font-bold text-[var(--vt-color-indigo-900,#261A66)] font-mono">
                    {f.temp}°
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-3 sm:p-4 border-t border-[var(--vt-color-neutral-100,#EFEEF5)] flex items-center justify-between text-xs text-[var(--vt-color-neutral-500,#7C7894)] bg-[var(--vt-color-neutral-50,#F7F7FA)]">
          <span>Live site radar feed</span>
          <button
            type="button"
            onClick={onClose}
            className="h-8 px-4 rounded-md bg-[var(--vt-color-orange-500,#EF5F18)] hover:bg-[var(--vt-color-orange-600,#D84C0B)] text-white text-xs font-bold transition-all cursor-pointer shadow-2xs font-sans"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
