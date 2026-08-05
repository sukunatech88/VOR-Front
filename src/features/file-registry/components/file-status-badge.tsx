import type { FileStatus } from "../types/file-registry.types";

function statusClasses(status: FileStatus) {
  switch (status) {
    case "PROCESSED":
    case "IDENTIFIED":
    case "BANK_ACCEPTED":
      return "border-emerald-500/20 bg-emerald-500/10 text-emerald-300";
    case "FAILED":
    case "REJECTED":
    case "BANK_REJECTED":
    case "UNSUPPORTED":
      return "border-rose-500/20 bg-rose-500/10 text-rose-300";
    case "PROCESSING":
    case "MANUAL_REVIEW":
    case "ACK_PENDING":
      return "border-amber-500/20 bg-amber-500/10 text-amber-300";
    default:
      return "border-slate-700 bg-slate-800 text-slate-300";
  }
}

interface FileStatusBadgeProps {
  status: FileStatus;
}

export function FileStatusBadge({ status }: FileStatusBadgeProps) {
  return (
    <span
      className={`inline-flex rounded-full border px-3 py-1 text-xs font-medium ${statusClasses(status)}`}
    >
      {status}
    </span>
  );
}
