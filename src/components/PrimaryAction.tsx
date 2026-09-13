"use client";

import { type ButtonHTMLAttributes, type ReactNode } from "react";
import { cn } from "@/lib/utils";

interface PrimaryActionProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  icon?: ReactNode;
  variant?: "primary" | "secondary" | "ghost" | "danger";
  size?: "lg" | "md";
  fullWidth?: boolean;
}

export function PrimaryAction({
  icon,
  children,
  variant = "primary",
  size = "lg",
  fullWidth = true,
  className,
  ...props
}: PrimaryActionProps) {
  const base =
    "inline-flex items-center justify-center gap-2.5 rounded-2xl font-semibold transition-all duration-150 active:scale-[0.97] disabled:opacity-50 disabled:active:scale-100 select-none";

  const sizes = {
    lg: "min-h-[56px] px-7 text-lg",
    md: "min-h-[48px] px-5 text-base",
  };

  const variants = {
    primary: "bg-teal text-warm-white shadow-[0_8px_20px_-6px_rgba(23,107,99,0.5)] hover:bg-teal-dark",
    secondary: "bg-sage text-teal-dark hover:bg-sage-dark",
    ghost: "bg-transparent text-ink border-2 border-ink/10 hover:bg-ink/5",
    danger: "bg-danger-bg text-danger hover:bg-danger/15",
  };

  return (
    <button
      className={cn(base, sizes[size], variants[variant], fullWidth && "w-full", className)}
      {...props}
    >
      {icon}
      {children}
    </button>
  );
}
