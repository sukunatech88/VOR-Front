import type { ButtonHTMLAttributes, PropsWithChildren } from "react";

import { cn } from "../../../core/utils/cn";

type ButtonVariant = "primary" | "secondary" | "ghost";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  fullWidth?: boolean;
}

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    "bg-indigo-600 text-white hover:bg-indigo-500 border border-indigo-500",
  secondary:
    "bg-slate-900 text-slate-100 hover:bg-slate-800 border border-slate-700",
  ghost:
    "bg-transparent text-slate-300 hover:bg-slate-800/70 border border-slate-700",
};

export function Button({
  children,
  className,
  variant = "primary",
  fullWidth,
  ...props
}: PropsWithChildren<ButtonProps>) {
  return (
    <button
      className={cn(
        "inline-flex h-11 items-center justify-center rounded-xl px-4 text-sm font-medium transition-colors",
        variantClasses[variant],
        fullWidth && "w-full",
        className,
      )}
      {...props}
    >
      {children}
    </button>
  );
}