import { cn } from "../../../core/utils/cn";

function statusClasses(status: string) {
  switch (status) {
    case "ACCEPTED":
    case "APPLIED":
    case "BANK_ACCEPTED":
    case "DISPATCHED":
    case "MATCHED":
    case "PASSED":
      return "border-emerald-500/20 bg-emerald-500/10 text-emerald-300";
    case "BANK_REJECTED":
    case "FAILED":
    case "NO_MATCH":
    case "REJECTED":
    case "UNMATCHED":
      return "border-rose-500/20 bg-rose-500/10 text-rose-300";
    case "ACK_PENDING":
    case "AMBIGUOUS":
    case "MANUAL_REVIEW":
    case "PARTIALLY_ACCEPTED":
    case "PARTIALLY_APPLIED":
    case "PENDING":
    case "WARNING":
      return "border-amber-500/20 bg-amber-500/10 text-amber-300";
    default:
      return "border-slate-700 bg-slate-800 text-slate-300";
  }
}

interface PaymentStatusBadgeProps {
  status: string;
  className?: string;
}

export function PaymentStatusBadge({
  status,
  className,
}: PaymentStatusBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex rounded-full border px-3 py-1 text-xs font-medium",
        statusClasses(status),
        className,
      )}
    >
      {status}
    </span>
  );
}
