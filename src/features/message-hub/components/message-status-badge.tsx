import type { MessageStatus } from "../types/message-hub.types";

function statusClasses(status: MessageStatus) {
  switch (status) {
    case "BANK_ACCEPTED":
    case "VALIDATED":
    case "DISPATCHED":
      return "border-emerald-500/20 bg-emerald-500/10 text-emerald-300";
    case "ACK_PENDING":
    case "IDENTIFIED":
    case "PARSED":
    case "RECEIVED":
    case "NORMALIZED":
      return "border-sky-500/20 bg-sky-500/10 text-sky-300";
    case "BANK_REJECTED":
    case "REJECTED":
    case "FAILED":
      return "border-rose-500/20 bg-rose-500/10 text-rose-300";
    case "UNSUPPORTED":
      return "border-amber-500/20 bg-amber-500/10 text-amber-300";
    default:
      return "border-slate-700 bg-slate-800 text-slate-300";
  }
}

interface MessageStatusBadgeProps {
  status: MessageStatus;
}

export function MessageStatusBadge({
  status,
}: MessageStatusBadgeProps) {
  return (
    <span
      className={`inline-flex rounded-full border px-3 py-1 text-xs font-medium ${statusClasses(status)}`}
    >
      {status}
    </span>
  );
}
