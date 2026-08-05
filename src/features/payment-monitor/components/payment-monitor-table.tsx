import { ExternalLink } from "lucide-react";
import { Link } from "react-router-dom";

import { PaymentStatusBadge } from "./payment-status-badge";
import type { OperationsPaymentInstructionListItem } from "../types/payment-monitor.types";
import {
  displayText,
  formatDate,
  formatDateTime,
  formatDecimal,
  truncateId,
} from "../utils/payment-monitor-formatters";

interface PaymentMonitorTableProps {
  items: OperationsPaymentInstructionListItem[];
}

export function PaymentMonitorTable({ items }: PaymentMonitorTableProps) {
  return (
    <div className="w-0 min-w-full max-w-full overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/60">
      <div className="overflow-x-auto">
        <table className="min-w-[1180px] text-left text-sm">
          <caption className="sr-only">
            Payment instructions visible to the current organization
          </caption>
          <thead className="bg-slate-950/80 text-slate-400">
            <tr>
              <th scope="col" className="px-4 py-3 font-medium">
                Payment instruction
              </th>
              <th scope="col" className="px-4 py-3 font-medium">
                Source file
              </th>
              <th scope="col" className="px-4 py-3 font-medium">
                Bank connection
              </th>
              <th scope="col" className="px-4 py-3 font-medium">
                Requested execution
              </th>
              <th scope="col" className="px-4 py-3 font-medium">
                Transactions
              </th>
              <th scope="col" className="px-4 py-3 font-medium">
                Amount
              </th>
              <th scope="col" className="px-4 py-3 font-medium">
                Status
              </th>
              <th scope="col" className="px-4 py-3 font-medium">
                Latest bank response
              </th>
              <th scope="col" className="px-4 py-3 font-medium">
                Updated
              </th>
              <th scope="col" className="px-4 py-3 font-medium">
                <span className="sr-only">Actions</span>
              </th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => {
              const countsDiffer =
                item.declaredTransactionCount !== null &&
                item.declaredTransactionCount !==
                  item.persistedTransactionCount;

              return (
                <tr
                  key={item.paymentInstructionId}
                  className="border-t border-slate-800 align-top text-slate-200"
                >
                  <td className="max-w-64 px-4 py-4">
                    <Link
                      className="break-words font-medium text-indigo-300 underline-offset-4 hover:text-indigo-200 hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-400"
                      title={item.paymentInstructionId}
                      to={`/payment-monitor/${item.paymentInstructionId}`}
                    >
                      {item.paymentInstructionReference ||
                        truncateId(item.paymentInstructionId)}
                    </Link>
                    {item.messageReference ? (
                      <span className="mt-1 block break-words text-xs text-slate-500">
                        {item.messageReference}
                      </span>
                    ) : null}
                  </td>
                  <td className="max-w-56 px-4 py-4">
                    <Link
                      className="break-words text-indigo-300 underline-offset-4 hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-400"
                      to={`/file-registry/${item.fileId}`}
                    >
                      {item.originalFileName}
                    </Link>
                  </td>
                  <td className="px-4 py-4">
                    <span className="block">
                      {item.bankConnection.displayName}
                    </span>
                    <span className="mt-1 block text-xs text-slate-500">
                      {item.bankConnection.code} ·{" "}
                      {item.bankConnection.bankName}
                    </span>
                  </td>
                  <td className="whitespace-nowrap px-4 py-4">
                    {formatDate(item.requestedExecutionDate)}
                  </td>
                  <td className="px-4 py-4">
                    <span className="font-medium text-white">
                      {item.persistedTransactionCount}
                    </span>
                    <span className="mt-1 block text-xs text-slate-500">
                      Declared: {item.declaredTransactionCount ?? "—"}
                    </span>
                    {countsDiffer ? (
                      <span className="mt-2 inline-flex rounded-full border border-amber-500/20 bg-amber-500/10 px-2 py-1 text-xs text-amber-300">
                        Count differs
                      </span>
                    ) : null}
                  </td>
                  <td className="whitespace-nowrap px-4 py-4">
                    {formatDecimal(item.controlSum)}
                    {item.currency ? ` ${item.currency}` : ""}
                  </td>
                  <td className="px-4 py-4">
                    <PaymentStatusBadge status={item.status} />
                  </td>
                  <td className="max-w-64 px-4 py-4">
                    {item.latestStatusReport ? (
                      <div className="space-y-1">
                        <p className="font-medium text-white">
                          {displayText(item.latestStatusReport.groupStatus)}
                        </p>
                        {item.latestStatusReport.reasonCode ||
                        item.latestStatusReport.reasonText ? (
                          <p className="break-words text-xs text-slate-400">
                            {[
                              item.latestStatusReport.reasonCode,
                              item.latestStatusReport.reasonText,
                            ]
                              .filter(Boolean)
                              .join(" · ")}
                          </p>
                        ) : null}
                        {item.latestStatusReport.applicationStatus ? (
                          <PaymentStatusBadge
                            className="mt-1"
                            status={item.latestStatusReport.applicationStatus}
                          />
                        ) : null}
                      </div>
                    ) : (
                      <span className="text-slate-500">
                        No bank response received
                      </span>
                    )}
                  </td>
                  <td className="whitespace-nowrap px-4 py-4">
                    <time dateTime={item.updatedAt}>
                      {formatDateTime(item.updatedAt)}
                    </time>
                  </td>
                  <td className="px-4 py-4">
                    <Link
                      aria-label={`View payment instruction ${item.paymentInstructionReference || item.paymentInstructionId}`}
                      className="inline-flex items-center gap-2 whitespace-nowrap text-indigo-300 underline-offset-4 hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-400"
                      to={`/payment-monitor/${item.paymentInstructionId}`}
                    >
                      View details
                      <ExternalLink
                        className="h-3.5 w-3.5"
                        aria-hidden="true"
                      />
                    </Link>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
