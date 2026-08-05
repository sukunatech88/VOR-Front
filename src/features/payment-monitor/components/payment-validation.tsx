import { PaymentStatusBadge } from "./payment-status-badge";
import type { OperationsPaymentValidationResultView } from "../types/payment-monitor.types";
import { formatDateTime } from "../utils/payment-monitor-formatters";

interface PaymentValidationProps {
  validationResults: OperationsPaymentValidationResultView[];
}

export function PaymentValidation({
  validationResults,
}: PaymentValidationProps) {
  const latest = validationResults[0];

  if (!latest) {
    return (
      <p className="mt-3 text-sm text-slate-400">
        No validation result is available.
      </p>
    );
  }

  return (
    <div className="mt-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-sm text-slate-300">
            Latest result · {latest.messageType}
          </p>
          <time
            className="mt-1 block text-xs text-slate-500"
            dateTime={latest.checkedAt}
          >
            {formatDateTime(latest.checkedAt)}
          </time>
        </div>
        <PaymentStatusBadge status={latest.status} />
      </div>

      {latest.findings.length ? (
        <ul className="mt-4 space-y-2">
          {latest.findings.map((finding) => (
            <li
              key={finding.id}
              className="rounded-xl border border-slate-800 bg-slate-950/50 p-3"
            >
              <div className="flex flex-wrap items-center gap-2">
                <PaymentStatusBadge status={finding.severity} />
                <p className="text-sm font-medium text-slate-200">
                  {finding.code}
                </p>
              </div>
              <p className="mt-2 text-sm text-slate-400">
                {finding.description}
              </p>
              <p className="mt-2 text-xs text-slate-500">
                {finding.targetType}
                {finding.field ? ` · ${finding.field}` : ""}
              </p>
            </li>
          ))}
        </ul>
      ) : (
        <p className="mt-3 text-sm text-slate-400">No validation findings.</p>
      )}
    </div>
  );
}
