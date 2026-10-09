import React from "react";

export interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

export function GlassCard({
  children,
  className = "",
  onClick,
}: GlassCardProps) {
  return (
    <div
      onClick={onClick}
      className={`relative overflow-hidden rounded-2xl bg-white/75 backdrop-blur-xl border border-white/90 shadow-[0_16px_36px_-6px_rgba(38,26,102,0.1),0_4px_12px_-2px_rgba(38,26,102,0.05)] transition-all duration-300 hover:shadow-[0_20px_42px_-6px_rgba(38,26,102,0.16)] hover:bg-white/85 ${className}`}
    >
      {/* Specular subtle top highlight */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white to-transparent opacity-80" />
      {children}
    </div>
  );
}
