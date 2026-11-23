"use client";

import React from "react";

export interface VantagedCheckboxProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: React.ReactNode;
  description?: string;
  disabled?: boolean;
  className?: string;
  id?: string;
}

export function VantagedCheckbox({
  checked,
  onChange,
  label,
  description,
  disabled = false,
  className = "",
  id,
}: VantagedCheckboxProps) {
  const handleToggle = () => {
    if (disabled) return;
    onChange(!checked);
  };

  return (
    <label
      htmlFor={id}
      style={{ fontFamily: "'Outfit', var(--vt-font-sans), sans-serif" }}
      className={`inline-flex items-start gap-2.5 select-none ${
        disabled ? "opacity-55 cursor-not-allowed" : "cursor-pointer"
      } ${className}`}
    >
      <button
        id={id}
        type="button"
        role="checkbox"
        aria-checked={checked}
        disabled={disabled}
        onClick={handleToggle}
        className={`mt-0.5 w-4.5 h-4.5 rounded-md border flex items-center justify-center shrink-0 transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-[var(--vt-color-orange-500,#EF5F18)]/25 ${
          checked
            ? "bg-[var(--vt-color-orange-500,#EF5F18)] border-[var(--vt-color-orange-500,#EF5F18)] text-white shadow-[0_1px_4px_rgba(239,95,24,0.3)]"
            : "bg-white border-[var(--vt-color-border-default,#D4D1E3)] hover:border-[var(--vt-color-orange-400,#F78241)]"
        }`}
      >
        {checked && (
          <svg
            className="w-3 h-3"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="3.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="20 6 9 17 4 12" />
          </svg>
        )}
      </button>
      {(label || description) && (
        <span className="flex flex-col min-w-0">
          {label && (
            <span className="text-xs font-semibold text-[var(--vt-color-indigo-900,#261A66)] leading-snug">
              {label}
            </span>
          )}
          {description && (
            <span className="text-[11px] text-[var(--vt-color-neutral-500,#7C7894)] leading-snug mt-0.5">
              {description}
            </span>
          )}
        </span>
      )}
    </label>
  );
}
