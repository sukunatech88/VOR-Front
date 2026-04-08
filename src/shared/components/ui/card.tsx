import type { HTMLAttributes, PropsWithChildren } from "react";

import { cn } from "../../../core/utils/cn";

export function Card({
  children,
  className,
  ...props
}: PropsWithChildren<HTMLAttributes<HTMLDivElement>>) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-slate-800 bg-slate-900/70 p-5 shadow-xl shadow-black/20",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}