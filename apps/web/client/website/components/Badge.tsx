import React from "react";

export interface BadgeProps {
  children: React.ReactNode;
  variant?: "brand" | "neutral" | "success" | "outline";
  size?: "sm" | "md";
  className?: string;
}

export function Badge({
  children,
  variant = "brand",
  size = "sm",
  className = "",
}: BadgeProps) {
  const variantStyles = {
    brand:
      "bg-[var(--vt-color-background-brand-subtle,#FFF4EE)] text-[var(--vt-color-primary-default,#B33C08)] border border-[var(--vt-color-primary-border,#FDCAA9)]",
    neutral:
      "bg-[var(--vt-color-background-subtle,#F7F7FA)] text-[var(--vt-color-text-default,#261A66)] border border-[var(--vt-color-border-default,#E2E0EC)]",
    success:
      "bg-[var(--vt-color-success-subtle,#E9F6EC)] text-[var(--vt-color-success-default,#1F6B3E)] border border-[var(--vt-color-success-border,#A3D9B1)]",
    outline:
      "bg-transparent text-[var(--vt-color-text-muted,#5E5A7D)] border border-[var(--vt-color-border-default,#E2E0EC)]",
  };

  const sizeStyles = {
    sm: "px-2.5 py-0.5 text-[11px] font-semibold tracking-wider uppercase",
    md: "px-3 py-1 text-xs font-semibold tracking-wider uppercase",
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full font-sans transition-colors ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
    >
      {children}
    </span>
  );
}
