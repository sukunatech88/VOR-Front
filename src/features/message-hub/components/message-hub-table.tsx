import { Link } from "react-router-dom";

import { MessageStatusBadge } from "./message-status-badge";
import type { OperationsMessageSummaryView } from "../types/message-hub.types";

interface MessageHubTableProps {
  items: OperationsMessageSummaryView[];
}

export function MessageHubTable({ items }: MessageHubTableProps) {
  return (
    <div className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/60">
      <div className="overflow-x-auto">
        <table className="min-w-[70rem] text-left text-sm">
          <caption className="sr-only">
            Operational messages returned by the VOR backend
          </caption>
          <thead className="bg-slate-950/80 text-slate-400">
            <tr>
              <th scope="col" className="px-4 py-3 font-medium">
                Message
              </th>
              <th scope="col" className="px-4 py-3 font-medium">
                File
              </th>
              <th scope="col" className="px-4 py-3 font-medium">
                Type
              </th>
              <th scope="col" className="px-4 py-3 font-medium">
                File status
              </th>
              <th scope="col" className="px-4 py-3 font-medium">
                Connection
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
            {items.map((item) => (
              <tr
                key={item.messageId}
                className="border-t border-slate-800 text-slate-200"
              >
                <td className="px-4 py-3">
                  <Link
                    className="font-medium text-indigo-300 underline-offset-4 hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-400"
                    to={`/message-hub/${item.messageId}`}
                  >
                    {item.messageReference || item.messageId}
                  </Link>
                  {item.messageReference ? (
                    <p className="mt-1 max-w-56 truncate text-xs text-slate-500">
                      {item.messageId}
                    </p>
                  ) : null}
                </td>
                <td className="px-4 py-3">
                  <p>{item.originalFileName || "Not available"}</p>
                  <p className="mt-1 max-w-56 truncate text-xs text-slate-500">
                    {item.fileId}
                  </p>
                </td>
                <td className="px-4 py-3">{item.messageType}</td>
                <td className="px-4 py-3">
                  {item.effectiveFileStatus || item.fileStatus || "Not available"}
                </td>
                <td className="px-4 py-3">
                  <p>{item.ownership.bankConnectionDisplayName}</p>
                  <p className="mt-1 text-xs text-slate-500">
                    {item.ownership.bankName}
                  </p>
                </td>
                <td className="px-4 py-3">
                  <MessageStatusBadge status={item.messageStatus} />
                </td>
                <td className="whitespace-nowrap px-4 py-3">
                  {new Date(item.updatedAt).toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
