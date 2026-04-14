import { useNavigate } from "react-router-dom";

import type { MessageHubItem } from "../types/message-hub.types";

function statusClasses(status: MessageHubItem["status"]) {
  switch (status) {
    case "VALIDATED":
    case "DISPATCHED":
      return "bg-emerald-500/10 text-emerald-300 border border-emerald-500/20";
    case "MANUAL_REVIEW":
      return "bg-amber-500/10 text-amber-300 border border-amber-500/20";
    case "FAILED":
      return "bg-rose-500/10 text-rose-300 border border-rose-500/20";
    default:
      return "bg-slate-800 text-slate-300 border border-slate-700";
  }
}

interface MessageHubTableProps {
  items: MessageHubItem[];
}

export function MessageHubTable({ items }: MessageHubTableProps) {
  const navigate = useNavigate();

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/60">
      <div className="overflow-x-auto">
        <table className="min-w-full text-left text-sm">
          <thead className="bg-slate-950/80 text-slate-400">
            <tr>
              <th className="px-4 py-3 font-medium">Message ID</th>
              <th className="px-4 py-3 font-medium">File ID</th>
              <th className="px-4 py-3 font-medium">Reference</th>
              <th className="px-4 py-3 font-medium">Type</th>
              <th className="px-4 py-3 font-medium">Direction</th>
              <th className="px-4 py-3 font-medium">Bank</th>
              <th className="px-4 py-3 font-medium">Organization</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium">Created At</th>
            </tr>
          </thead>

          <tbody>
            {items.map((item) => (
              <tr
                key={item.messageId}
                className="cursor-pointer border-t border-slate-800 text-slate-200 transition hover:bg-slate-800/50"
                onClick={() => navigate(`/message-hub/${item.messageId}`)}
              >
                <td className="px-4 py-3">{item.messageId}</td>
                <td className="px-4 py-3">{item.fileId}</td>
                <td className="px-4 py-3">{item.reference}</td>
                <td className="px-4 py-3">{item.messageType}</td>
                <td className="px-4 py-3">{item.direction}</td>
                <td className="px-4 py-3">{item.bankName}</td>
                <td className="px-4 py-3">{item.organizationName}</td>
                <td className="px-4 py-3">
                  <span
                    className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ${statusClasses(item.status)}`}
                  >
                    {item.status}
                  </span>
                </td>
                <td className="px-4 py-3">
                  {new Date(item.createdAt).toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}