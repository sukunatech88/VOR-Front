import { useNavigate } from "react-router-dom";

import type { FileRegistryItem } from "../types/file-registry.types";

function statusClasses(status: FileRegistryItem["status"]) {
  switch (status) {
    case "IDENTIFIED":
    case "PARSED":
      return "bg-emerald-500/10 text-emerald-300 border border-emerald-500/20";
    case "FAILED":
    case "UNSUPPORTED":
      return "bg-rose-500/10 text-rose-300 border border-rose-500/20";
    default:
      return "bg-slate-800 text-slate-300 border border-slate-700";
  }
}

interface FileRegistryTableProps {
  items: FileRegistryItem[];
}

export function FileRegistryTable({ items }: FileRegistryTableProps) {
  const navigate = useNavigate();

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/60">
      <div className="overflow-x-auto">
        <table className="min-w-full text-left text-sm">
          <thead className="bg-slate-950/80 text-slate-400">
            <tr>
              <th className="px-4 py-3 font-medium">File ID</th>
              <th className="px-4 py-3 font-medium">File Name</th>
              <th className="px-4 py-3 font-medium">Direction</th>
              <th className="px-4 py-3 font-medium">Bank</th>
              <th className="px-4 py-3 font-medium">Organization</th>
              <th className="px-4 py-3 font-medium">Message Type</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium">Received At</th>
              <th className="px-4 py-3 font-medium">Size</th>
            </tr>
          </thead>

          <tbody>
            {items.map((item) => (
              <tr
                key={item.fileId}
                className="cursor-pointer border-t border-slate-800 text-slate-200 transition hover:bg-slate-800/50"
                onClick={() => navigate(`/file-registry/${item.fileId}`)}
              >
                <td className="px-4 py-3">{item.fileId}</td>
                <td className="px-4 py-3">{item.fileName}</td>
                <td className="px-4 py-3">{item.direction}</td>
                <td className="px-4 py-3">{item.bankName}</td>
                <td className="px-4 py-3">{item.organizationName}</td>
                <td className="px-4 py-3">{item.messageType}</td>
                <td className="px-4 py-3">
                  <span
                    className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ${statusClasses(item.status)}`}
                  >
                    {item.status}
                  </span>
                </td>
                <td className="px-4 py-3">
                  {new Date(item.receivedAt).toLocaleString()}
                </td>
                <td className="px-4 py-3">{item.sizeKb} KB</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}