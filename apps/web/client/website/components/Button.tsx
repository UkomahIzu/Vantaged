import React from "react";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost" | "glass";
  size?: "sm" | "md" | "lg";
  children: React.ReactNode;
  icon?: React.ReactNode;
}

export function Button({
  variant = "primary",
  size = "md",
  children,
  icon,
  className = "",
  ...props
}: ButtonProps) {
  const baseStyles =
    "inline-flex items-center justify-center font-medium tracking-tight transition-all duration-200 cursor-pointer select-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--vt-color-border-focus,#EF5F18)] focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none";

  const variantStyles = {
    primary:
      "bg-[var(--vt-color-primary-default,#B33C08)] hover:bg-[var(--vt-color-primary-hover,#8F320D)] active:bg-[var(--vt-color-primary-active,#742B0F)] text-white shadow-[0_2px_8px_rgba(179,60,8,0.25)] hover:shadow-[0_4px_12px_rgba(179,60,8,0.35)]",
    secondary:
      "bg-[var(--vt-color-secondary-default,#261A66)] hover:bg-[var(--vt-color-secondary-hover,#342982)] active:bg-[var(--vt-color-secondary-active,#170F42)] text-white shadow-sm",
    ghost:
      "bg-transparent hover:bg-[var(--vt-color-background-subtle,#F7F7FA)] text-[var(--vt-color-text-default,#261A66)] border border-transparent hover:border-[var(--vt-color-border-default,#E2E0EC)]",
    glass:
      "bg-white/70 hover:bg-white/90 text-[var(--vt-color-text-default,#261A66)] border border-white/80 backdrop-blur-md shadow-[0_4px_16px_rgba(38,26,102,0.08)]",
  };

  const sizeStyles = {
    sm: "h-9 px-3.5 text-xs rounded-md gap-1.5",
    md: "h-11 px-5 text-sm rounded-md gap-2",
    lg: "h-12 px-7 text-base rounded-md gap-2.5",
  };

  return (
    <button
      className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
      {...props}
    >
      {icon && <span className="inline-flex shrink-0">{icon}</span>}
      <span>{children}</span>
    </button>
  );
}
