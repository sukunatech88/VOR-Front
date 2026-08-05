import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

import { Card } from "../../../shared/components/ui/card";

const quickLinks = [
  {
    label: "Open File Registry",
    description: "Inspect received files, statuses and custody metadata.",
    to: "/file-registry",
  },
  {
    label: "Go to Message Hub",
    description: "Continue with traceability and message lifecycle monitoring.",
    to: "/message-hub",
  },
  {
    label: "Manage Bank Connections",
    description: "Review SFTP configuration, health and lifecycle status.",
    to: "/bank-connections",
  },
] as const;

export function DashboardQuickLinks() {
  return (
    <Card>
      <div className="mb-5">
        <h2 className="text-lg font-semibold text-white">Quick actions</h2>
        <p className="mt-1 text-sm text-slate-400">
          Fast access to the most relevant operational modules.
        </p>
      </div>

      <ul className="space-y-3">
        {quickLinks.map((item) => (
          <li key={item.to}>
            <Link
              to={item.to}
              className="block rounded-2xl border border-slate-800 bg-slate-950/50 p-4 transition hover:bg-slate-900"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-sm font-medium text-white">{item.label}</p>
                  <p className="mt-1 text-sm text-slate-400">
                    {item.description}
                  </p>
                </div>

                <ArrowRight
                  aria-hidden="true"
                  className="mt-1 h-4 w-4 text-slate-500"
                />
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </Card>
  );
}
