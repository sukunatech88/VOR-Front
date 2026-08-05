import { Link } from "react-router-dom";

import { FileStatusBadge } from "./file-status-badge";
import type { OperationsFileSummaryView } from "../types/file-registry.types";

const dateFormatter = new Intl.DateTimeFormat(undefined, {
  dateStyle: "medium",
  timeStyle: "short",
});

function formatDate(value: string) {
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? "Date unavailable"
    : dateFormatter.format(date);
}

interface FileRegistryTableProps {
  items: OperationsFileSummaryView[];
}

export function FileRegistryTable({ items }: FileRegistryTableProps) {
  return (
    <div className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/60">
      <div className="overflow-x-auto">
        <table className="min-w-full text-left text-sm">
          <caption className="sr-only">
            Files registered in the VOR operational repository
          </caption>
          <thead className="bg-slate-950/80 text-slate-400">
            <tr>
              <th scope="col" className="px-4 py-3 font-medium">
                File name
              </th>
              <th scope="col" className="px-4 py-3 font-medium">
                Direction
              </th>
              <th scope="col" className="px-4 py-3 font-medium">
                Bank connection
              </th>
              <th scope="col" className="px-4 py-3 font-medium">
                Message type
              </th>
              <th scope="col" className="px-4 py-3 font-medium">
                Effective status
              </th>
              <th scope="col" className="px-4 py-3 font-medium">
                Updated
              </th>
            </tr>
          </thead>

          <tbody>
            {items.map((item) => (
              <tr
                key={item.fileId}
                className="border-t border-slate-800 text-slate-200"
              >
                <td className="px-4 py-3">
                  <Link
                    className="font-medium text-indigo-300 underline-offset-4 hover:text-indigo-200 hover:underline"
                    to={`/file-registry/${item.fileId}`}
                  >
                    {item.originalFileName}
                  </Link>
                  <span className="mt-1 block text-xs text-slate-500">
                    {item.fileId}
                  </span>
                </td>
                <td className="px-4 py-3">{item.direction}</td>
                <td className="px-4 py-3">
                  <span className="block">
                    {item.ownership.bankConnectionDisplayName}
                  </span>
                  <span className="mt-1 block text-xs text-slate-500">
                    {item.ownership.bankName} ·{" "}
                    {item.ownership.organizationName}
                  </span>
                </td>
                <td className="px-4 py-3">
                  {item.messageType ?? item.classifiedMessageType ?? "Not classified"}
                </td>
                <td className="px-4 py-3">
                  <FileStatusBadge status={item.effectiveFileStatus} />
                </td>
                <td className="px-4 py-3">
                  <time dateTime={item.updatedAt}>
                    {formatDate(item.updatedAt)}
                  </time>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
