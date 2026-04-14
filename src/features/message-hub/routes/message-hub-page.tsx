import { useMemo, useState } from "react";

import { useMessageHub } from "../hooks/use-message-hub";
import { MessageHubTable } from "../components/message-hub-table";
import { Card } from "../../../shared/components/ui/card";
import { PageHeader } from "../../../shared/components/page-header";

export function MessageHubPage() {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("ALL");

  const filters = useMemo(
    () => ({
      search,
      status,
    }),
    [search, status],
  );

  const { data, isLoading, isError } = useMessageHub(filters);

  return (
    <div>
      <PageHeader
        title="Message Hub"
        description="Traceability module for messages extracted from inbound and outbound files across VOR Phase 1."
      />

      <Card className="mb-6">
        <div className="grid gap-4 md:grid-cols-3">
          <div className="space-y-2">
            <label className="text-sm text-slate-300">Search</label>
            <input
              className="h-11 w-full rounded-xl border border-slate-700 bg-slate-950 px-3 text-sm text-white outline-none focus:border-indigo-500"
              placeholder="Message id, file id, reference..."
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm text-slate-300">Status</label>
            <select
              className="h-11 w-full rounded-xl border border-slate-700 bg-slate-950 px-3 text-sm text-white outline-none focus:border-indigo-500"
              value={status}
              onChange={(event) => setStatus(event.target.value)}
            >
              <option value="ALL">All</option>
              <option value="RECEIVED">RECEIVED</option>
              <option value="PARSED">PARSED</option>
              <option value="NORMALIZED">NORMALIZED</option>
              <option value="VALIDATED">VALIDATED</option>
              <option value="DISPATCHED">DISPATCHED</option>
              <option value="FAILED">FAILED</option>
              <option value="MANUAL_REVIEW">MANUAL_REVIEW</option>
            </select>
          </div>

          <div className="flex items-end">
            <div className="rounded-xl border border-slate-800 bg-slate-950/60 px-4 py-3 text-sm text-slate-400">
              Source: local mock API
            </div>
          </div>
        </div>
      </Card>

      {isLoading && (
        <Card>
          <p className="text-sm text-slate-300">Loading message hub...</p>
        </Card>
      )}

      {isError && (
        <Card>
          <p className="text-sm text-rose-300">
            Failed to load message hub data.
          </p>
        </Card>
      )}

      {data && <MessageHubTable items={data} />}
    </div>
  );
}