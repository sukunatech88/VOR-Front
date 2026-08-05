import { PaymentStatusBadge } from "./payment-status-badge";
import type { OperationsPaymentMonitorTransactionView } from "../types/payment-monitor.types";
import {
  displayText,
  formatDateTime,
  formatDecimal,
} from "../utils/payment-monitor-formatters";

interface PaymentTransactionsTableProps {
  transactions: OperationsPaymentMonitorTransactionView[];
}

export function PaymentTransactionsTable({
  transactions,
}: PaymentTransactionsTableProps) {
  if (!transactions.length) {
    return (
      <p className="mt-3 text-sm text-slate-400">
        No persisted transactions are available.
      </p>
    );
  }

  return (
    <div className="mt-5 overflow-x-auto rounded-xl border border-slate-800">
      <table className="min-w-[980px] text-left text-sm">
        <caption className="sr-only">
          Transactions in this payment instruction
        </caption>
        <thead className="bg-slate-950/80 text-slate-400">
          <tr>
            <th scope="col" className="px-4 py-3 font-medium">
              Instruction ID
            </th>
            <th scope="col" className="px-4 py-3 font-medium">
              End-to-end ID
            </th>
            <th scope="col" className="px-4 py-3 font-medium">
              Creditor
            </th>
            <th scope="col" className="px-4 py-3 font-medium">
              Masked account
            </th>
            <th scope="col" className="px-4 py-3 font-medium">
              Amount
            </th>
            <th scope="col" className="px-4 py-3 font-medium">
              Status
            </th>
            <th scope="col" className="px-4 py-3 font-medium">
              Updated
            </th>
          </tr>
        </thead>
        <tbody>
          {transactions.map((transaction) => (
            <tr
              key={transaction.paymentTransactionId}
              className="border-t border-slate-800 align-top text-slate-200"
            >
              <td className="max-w-52 break-words px-4 py-3">
                {displayText(transaction.instructionId)}
              </td>
              <td className="max-w-52 break-words px-4 py-3">
                {displayText(transaction.endToEndId)}
              </td>
              <td className="max-w-48 break-words px-4 py-3">
                {displayText(transaction.creditorName)}
              </td>
              <td className="whitespace-nowrap px-4 py-3 font-mono text-xs">
                {displayText(transaction.creditorAccountMasked)}
              </td>
              <td className="whitespace-nowrap px-4 py-3">
                {formatDecimal(transaction.amount)}
                {transaction.currency ? ` ${transaction.currency}` : ""}
              </td>
              <td className="px-4 py-3">
                <PaymentStatusBadge status={transaction.status} />
              </td>
              <td className="whitespace-nowrap px-4 py-3">
                <time dateTime={transaction.updatedAt}>
                  {formatDateTime(transaction.updatedAt)}
                </time>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
