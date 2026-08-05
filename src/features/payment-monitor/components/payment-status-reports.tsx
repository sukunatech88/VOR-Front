import { Link } from "react-router-dom";

import { PaymentStatusBadge } from "./payment-status-badge";
import type {
  OperationsPaymentInstructionStatusReportView,
  OperationsPaymentStatusReportApplicationItemView,
} from "../types/payment-monitor.types";
import {
  displayText,
  formatDateTime,
} from "../utils/payment-monitor-formatters";

function transition(item: OperationsPaymentStatusReportApplicationItemView) {
  if (item.previousTransactionStatus || item.newTransactionStatus) {
    return `${item.previousTransactionStatus || "—"} → ${item.newTransactionStatus || "—"}`;
  }

  if (item.previousInstructionStatus || item.newInstructionStatus) {
    return `${item.previousInstructionStatus || "—"} → ${item.newInstructionStatus || "—"}`;
  }

  return "—";
}

interface PaymentStatusReportsProps {
  reports: OperationsPaymentInstructionStatusReportView[];
}

export function PaymentStatusReports({ reports }: PaymentStatusReportsProps) {
  if (!reports.length) {
    return (
      <p className="mt-3 text-sm text-slate-400">
        No PAIN.002 status reports are related to this payment instruction.
      </p>
    );
  }

  return (
    <div className="mt-5 space-y-4">
      {reports.map((report) => (
        <article
          key={report.paymentStatusReportId}
          className="rounded-2xl border border-slate-800 bg-slate-950/40 p-4"
        >
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <p className="font-medium text-white">
                {report.pain002MessageReference || report.paymentStatusReportId}
              </p>
              <p className="mt-1 text-xs text-slate-500">
                Report ID: {report.paymentStatusReportId}
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <PaymentStatusBadge status={report.reportStatus} />
              {report.groupStatus ? (
                <PaymentStatusBadge status={report.groupStatus} />
              ) : null}
            </div>
          </div>

          <dl className="mt-4 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <div>
              <dt className="text-xs uppercase tracking-wide text-slate-500">
                Original message ID
              </dt>
              <dd className="mt-1 break-words text-sm text-white">
                {displayText(report.originalMessageId)}
              </dd>
            </div>
            <div>
              <dt className="text-xs uppercase tracking-wide text-slate-500">
                Original message name ID
              </dt>
              <dd className="mt-1 break-words text-sm text-white">
                {displayText(report.originalMessageNameId)}
              </dd>
            </div>
            <div>
              <dt className="text-xs uppercase tracking-wide text-slate-500">
                Bank reason
              </dt>
              <dd className="mt-1 break-words text-sm text-white">
                {[report.reasonCode, report.reasonText]
                  .filter(Boolean)
                  .join(" · ") || "—"}
              </dd>
            </div>
            <div>
              <dt className="text-xs uppercase tracking-wide text-slate-500">
                Received
              </dt>
              <dd className="mt-1 text-sm text-white">
                <time dateTime={report.createdAt}>
                  {formatDateTime(report.createdAt)}
                </time>
              </dd>
            </div>
          </dl>

          <Link
            className="mt-4 inline-flex text-sm font-medium text-indigo-300 underline-offset-4 hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-400"
            to={`/message-hub/${report.pain002MessageId}`}
          >
            Open PAIN.002 message
          </Link>

          {report.application ? (
            <div className="mt-5 border-t border-slate-800 pt-5">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h3 className="font-medium text-white">
                    Application and matching
                  </h3>
                  <p className="mt-1 break-all text-xs text-slate-500">
                    Application ID: {report.application.applicationId}
                  </p>
                </div>
                <PaymentStatusBadge
                  status={report.application.applicationStatus}
                />
              </div>

              <dl className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-4">
                <div>
                  <dt className="text-xs text-slate-500">Matched</dt>
                  <dd className="mt-1 text-sm font-medium text-white">
                    {report.application.matchedCount}
                  </dd>
                </div>
                <div>
                  <dt className="text-xs text-slate-500">Unmatched</dt>
                  <dd className="mt-1 text-sm font-medium text-white">
                    {report.application.unmatchedCount}
                  </dd>
                </div>
                <div>
                  <dt className="text-xs text-slate-500">Manual review</dt>
                  <dd className="mt-1 text-sm font-medium text-white">
                    {report.application.manualReviewCount}
                  </dd>
                </div>
                <div>
                  <dt className="text-xs text-slate-500">Applied</dt>
                  <dd className="mt-1 text-sm text-white">
                    <time dateTime={report.application.appliedAt}>
                      {formatDateTime(report.application.appliedAt)}
                    </time>
                  </dd>
                </div>
              </dl>

              {report.application.items.length ? (
                <div className="mt-4 overflow-x-auto rounded-xl border border-slate-800">
                  <table className="min-w-[1100px] text-left text-sm">
                    <caption className="sr-only">
                      Matching items for status report application
                    </caption>
                    <thead className="bg-slate-900/80 text-slate-400">
                      <tr>
                        <th scope="col" className="px-3 py-3 font-medium">
                          Match
                        </th>
                        <th scope="col" className="px-3 py-3 font-medium">
                          Strategy
                        </th>
                        <th scope="col" className="px-3 py-3 font-medium">
                          Original IDs
                        </th>
                        <th scope="col" className="px-3 py-3 font-medium">
                          Matched IDs
                        </th>
                        <th scope="col" className="px-3 py-3 font-medium">
                          Transition
                        </th>
                        <th scope="col" className="px-3 py-3 font-medium">
                          Reason
                        </th>
                        <th scope="col" className="px-3 py-3 font-medium">
                          Created
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {report.application.items.map((item) => (
                        <tr
                          key={item.applicationItemId}
                          className="border-t border-slate-800 align-top"
                        >
                          <td className="px-3 py-3">
                            <PaymentStatusBadge status={item.matchResult} />
                          </td>
                          <td className="px-3 py-3 text-slate-300">
                            {displayText(item.matchingStrategy)}
                          </td>
                          <td className="max-w-52 break-words px-3 py-3 text-xs text-slate-300">
                            <span className="block">
                              Instruction:{" "}
                              {displayText(item.originalInstructionId)}
                            </span>
                            <span className="mt-1 block">
                              End-to-end: {displayText(item.originalEndToEndId)}
                            </span>
                          </td>
                          <td className="max-w-64 break-all px-3 py-3 text-xs text-slate-300">
                            <span className="block">
                              Payment: {displayText(item.paymentInstructionId)}
                            </span>
                            <span className="mt-1 block">
                              Transaction:{" "}
                              {displayText(item.paymentTransactionId)}
                            </span>
                          </td>
                          <td className="whitespace-nowrap px-3 py-3 text-slate-200">
                            {transition(item)}
                          </td>
                          <td className="max-w-56 break-words px-3 py-3 text-slate-300">
                            {[item.reasonCode, item.reasonText]
                              .filter(Boolean)
                              .join(" · ") || "—"}
                          </td>
                          <td className="whitespace-nowrap px-3 py-3 text-slate-300">
                            <time dateTime={item.createdAt}>
                              {formatDateTime(item.createdAt)}
                            </time>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="mt-4 text-sm text-slate-400">
                  No application items are available.
                </p>
              )}
            </div>
          ) : (
            <p className="mt-5 border-t border-slate-800 pt-4 text-sm text-slate-400">
              This report has not produced an application result.
            </p>
          )}
        </article>
      ))}
    </div>
  );
}
