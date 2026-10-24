"use client";

import React, { useState, useRef, useEffect } from "react";

export interface VantagedSelectOption {
  value: string;
  label: string;
  sublabel?: string;
  badge?: string;
  icon?: React.ReactNode;
}

export interface VantagedSelectProps {
  value: string;
  onChange: (value: string) => void;
  options: (string | VantagedSelectOption)[];
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  containerClassName?: string;
  menuClassName?: string;
  id?: string;
  name?: string;
}

export function VantagedSelect({
  value,
  onChange,
  options,
  placeholder = "Select...",
  disabled = false,
  className = "",
  containerClassName = "",
  menuClassName = "",
  id,
}: VantagedSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const normalizedOptions: VantagedSelectOption[] = options.map((opt) =>
    typeof opt === "string" ? { value: opt, label: opt } : opt
  );

  const selectedOption = normalizedOptions.find((opt) => opt.value === value);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  const handleSelect = (val: string) => {
    onChange(val);
    setIsOpen(false);
  };

  return (
    <div
      ref={containerRef}
      style={{ fontFamily: "'Outfit', var(--vt-font-sans), sans-serif" }}
      className={`relative inline-block ${containerClassName || "w-full"} ${disabled ? "opacity-60 pointer-events-none" : ""}`}
    >
      {/* Trigger Button */}
      <button
        id={id}
        type="button"
        disabled={disabled}
        onClick={() => setIsOpen((prev) => !prev)}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        style={{ fontFamily: "'Outfit', var(--vt-font-sans), sans-serif" }}
        className={`w-full flex items-center justify-between text-left transition-all cursor-pointer ${
          className ||
          "h-9 px-3 rounded-lg bg-[var(--vt-color-neutral-50,#F7F7FA)] border border-[var(--vt-color-border-default,#E2E0EC)] text-xs font-semibold text-[var(--vt-color-indigo-900,#261A66)] hover:border-[var(--vt-color-neutral-300,#CBC8DA)]"
        } ${
          isOpen
            ? "border-[var(--vt-color-orange-500,#EF5F18)] ring-2 ring-[var(--vt-color-orange-500,#EF5F18)]/15 bg-white"
            : ""
        }`}
      >
        <span className="truncate pr-2">
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <svg
          className={`w-3.5 h-3.5 shrink-0 text-[var(--vt-color-neutral-400,#A3A0B8)] transition-transform duration-200 ${
            isOpen ? "rotate-180 text-[var(--vt-color-orange-600,#EF5F18)]" : ""
          }`}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>

      {/* Dropdown Menu Panel */}
      {isOpen && (
        <div
          role="listbox"
          style={{ fontFamily: "'Outfit', var(--vt-font-sans), sans-serif" }}
          className={`absolute left-0 right-0 top-full mt-1.5 z-50 bg-white rounded-xl border border-[var(--vt-color-border-default,#E2E0EC)] shadow-[0_12px_28px_rgba(38,26,102,0.12)] p-1.5 max-h-60 overflow-y-auto animate-in fade-in zoom-in-95 duration-150 ${menuClassName}`}
        >
          {normalizedOptions.length === 0 ? (
            <div className="px-3 py-2 text-xs text-[var(--vt-color-neutral-400,#A3A0B8)]">
              No options available
            </div>
          ) : (
            normalizedOptions.map((opt) => {
              const isSelected = opt.value === value;
              return (
                <button
                  key={opt.value}
                  type="button"
                  role="option"
                  aria-selected={isSelected}
                  onClick={() => handleSelect(opt.value)}
                  style={{ fontFamily: "'Outfit', var(--vt-font-sans), sans-serif" }}
                  className={`w-full px-3 py-2 rounded-lg text-xs font-semibold text-left transition-colors flex items-center justify-between cursor-pointer ${
                    isSelected
                      ? "bg-[var(--vt-color-orange-50,#FFF4EE)] text-[var(--vt-color-orange-700,#B33C08)] font-bold"
                      : "text-[var(--vt-color-indigo-900,#261A66)] hover:bg-[var(--vt-color-neutral-50,#F7F7FA)] hover:text-[var(--vt-color-orange-600,#EF5F18)]"
                  }`}
                >
                  <div className="flex flex-col truncate pr-2">
                    <span className="truncate">{opt.label}</span>
                    {opt.sublabel && (
                      <span className="text-[10.5px] font-normal text-[var(--vt-color-neutral-400,#A3A0B8)] truncate">
                        {opt.sublabel}
                      </span>
                    )}
                  </div>
                  {isSelected && (
                    <svg
                      className="w-3.5 h-3.5 shrink-0 text-[var(--vt-color-orange-600,#EF5F18)] stroke-[2.5]"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  )}
                </button>
              );
            })
          )}
        </div>
      )}
    </div>
  );
}
