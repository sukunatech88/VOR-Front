import { PaymentStatusBadge } from "./payment-status-badge";
import type { OperationsPaymentTransferTraceView } from "../types/payment-monitor.types";
import {
  displayText,
  formatDateTime,
} from "../utils/payment-monitor-formatters";

interface PaymentTransferTracesProps {
  traces: OperationsPaymentTransferTraceView[];
}

export function PaymentTransferTraces({ traces }: PaymentTransferTracesProps) {
  if (!traces.length) {
    return (
      <p className="mt-3 text-sm text-slate-400">
        No outbound transfer traces are available.
      </p>
    );
  }

  return (
    <div className="mt-5 overflow-x-auto rounded-xl border border-slate-800">
      <table className="min-w-[900px] text-left text-sm">
        <caption className="sr-only">
          Outbound transfer attempts for this payment instruction
        </caption>
        <thead className="bg-slate-950/80 text-slate-400">
          <tr>
            <th scope="col" className="px-4 py-3 font-medium">
              Action
            </th>
            <th scope="col" className="px-4 py-3 font-medium">
              Attempt
            </th>
            <th scope="col" className="px-4 py-3 font-medium">
              Outcome
            </th>
            <th scope="col" className="px-4 py-3 font-medium">
              Started / completed
            </th>
            <th scope="col" className="px-4 py-3 font-medium">
              Endpoint
            </th>
            <th scope="col" className="px-4 py-3 font-medium">
              Remote path
            </th>
            <th scope="col" className="px-4 py-3 font-medium">
              Failure reason
            </th>
          </tr>
        </thead>
        <tbody>
          {traces.map((trace) => (
            <tr
              key={trace.id}
              className="border-t border-slate-800 align-top text-slate-200"
            >
              <td className="px-4 py-3">{trace.action}</td>
              <td className="px-4 py-3">{trace.attemptNumber}</td>
              <td className="px-4 py-3">
                <PaymentStatusBadge status={trace.outcome} />
              </td>
              <td className="whitespace-nowrap px-4 py-3 text-xs">
                <time className="block" dateTime={trace.startedAt}>
                  {formatDateTime(trace.startedAt)}
                </time>
                <span className="mt-1 block text-slate-500">
                  {trace.completedAt
                    ? formatDateTime(trace.completedAt)
                    : "In progress"}
                </span>
              </td>
              <td className="max-w-56 break-words px-4 py-3">
                {trace.endpoint}
              </td>
              <td className="max-w-56 break-all px-4 py-3 text-xs">
                {displayText(trace.remotePath)}
              </td>
              <td className="max-w-56 break-words px-4 py-3 text-slate-300">
                {displayText(trace.failureReason)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
