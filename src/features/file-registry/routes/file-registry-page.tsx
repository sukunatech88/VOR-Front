import { useMemo, useState } from "react";

import { useFileRegistry } from "../hooks/use-file-registry";
import { FileRegistryTable } from "../components/file-registry-table";
import { Card } from "../../../shared/components/ui/card";
import { PageHeader } from "../../../shared/components/page-header";

export function FileRegistryPage() {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("ALL");

  const filters = useMemo(
    () => ({
      search,
      status,
    }),
    [search, status],
  );

  const { data, isLoading, isError } = useFileRegistry(filters);

  return (
    <div>
      <PageHeader
        title="File Registry"
        description="Registro operativo de archivos para VOR Phase 1. Aquí centralizamos visibilidad inicial sobre archivos recibidos, identificados y procesados."
      />

      <Card className="mb-6">
        <div className="grid gap-4 md:grid-cols-3">
          <div className="space-y-2">
            <label className="text-sm text-slate-300">Search</label>
            <input
              className="h-11 w-full rounded-xl border border-slate-700 bg-slate-950 px-3 text-sm text-white outline-none focus:border-indigo-500"
              placeholder="File name, file id, bank..."
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
              <option value="DETECTED">DETECTED</option>
              <option value="RECEIVED">RECEIVED</option>
              <option value="STORED">STORED</option>
              <option value="IDENTIFIED">IDENTIFIED</option>
              <option value="PARSED">PARSED</option>
              <option value="FAILED">FAILED</option>
              <option value="UNSUPPORTED">UNSUPPORTED</option>
            </select>
          </div>

          <div className="flex items-end">
            <div className="rounded-xl border border-slate-800 bg-slate-950/60 px-4 py-3 text-sm text-slate-400">
              Fuente actual: mock API local
            </div>
          </div>
        </div>
      </Card>

      {isLoading && (
        <Card>
          <p className="text-sm text-slate-300">Loading file registry...</p>
        </Card>
      )}

      {isError && (
        <Card>
          <p className="text-sm text-rose-300">
            Failed to load file registry data.
          </p>
        </Card>
      )}

      {data && <FileRegistryTable items={data} />}
    </div>
  );
}