import type { ReactNode } from "react";

interface PaymentDetailValueProps {
  label: string;
  children: ReactNode;
}

export function PaymentDetailValue({
  label,
  children,
}: PaymentDetailValueProps) {
  return (
    <div className="min-w-0">
      <dt className="text-xs uppercase tracking-wide text-slate-500">
        {label}
      </dt>
      <dd className="mt-1 break-words text-sm text-white">{children}</dd>
    </div>
  );
}
