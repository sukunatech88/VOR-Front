import { ArrowLeft } from "lucide-react";
import { Link, useParams } from "react-router-dom";

import { useFileRegistryDetail } from "../hooks/use-file-registry-detail";
import { FileRegistryTimeline } from "../components/file-registry-timeline";
import { Card } from "../../../shared/components/ui/card";
import { Button } from "../../../shared/components/ui/button";
import { PageHeader } from "../../../shared/components/page-header";

function statusClasses(status: string) {
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

export function FileRegistryDetailPage() {
  const { fileId = "" } = useParams();
  const { data, isLoading, isError } = useFileRegistryDetail(fileId);

  if (isLoading) {
    return (
      <Card>
        <p className="text-sm text-slate-300">Loading file detail...</p>
      </Card>
    );
  }

  if (isError || !data) {
    return (
      <Card>
        <p className="text-sm text-rose-300">Failed to load file detail.</p>
        <div className="mt-4">
          <Link to="/file-registry">
            <Button variant="ghost">Back to file registry</Button>
          </Link>
        </div>
      </Card>
    );
  }

  return (
    <div>
      <div className="mb-4">
        <Link to="/file-registry">
          <Button variant="ghost">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to file registry
          </Button>
        </Link>
      </div>

      <PageHeader
        title={`File Detail · ${data.fileId}`}
        description="Operational detail view for file custody, identification and processing timeline."
      />

      <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <div className="space-y-6">
          <Card>
            <h2 className="text-lg font-semibold text-white">Metadata</h2>

            <div className="mt-5 grid gap-4 md:grid-cols-2">
              <div>
                <p className="text-xs uppercase tracking-wide text-slate-500">
                  File name
                </p>
                <p className="mt-1 text-sm text-white">{data.fileName}</p>
              </div>

              <div>
                <p className="text-xs uppercase tracking-wide text-slate-500">
                  Checksum
                </p>
                <p className="mt-1 text-sm text-white">{data.checksum}</p>
              </div>

              <div>
                <p className="text-xs uppercase tracking-wide text-slate-500">
                  Direction
                </p>
                <p className="mt-1 text-sm text-white">{data.direction}</p>
              </div>

              <div>
                <p className="text-xs uppercase tracking-wide text-slate-500">
                  Bank
                </p>
                <p className="mt-1 text-sm text-white">{data.bankName}</p>
              </div>

              <div>
                <p className="text-xs uppercase tracking-wide text-slate-500">
                  Organization
                </p>
                <p className="mt-1 text-sm text-white">{data.organizationName}</p>
              </div>

              <div>
                <p className="text-xs uppercase tracking-wide text-slate-500">
                  Message type
                </p>
                <p className="mt-1 text-sm text-white">{data.messageType}</p>
              </div>

              <div>
                <p className="text-xs uppercase tracking-wide text-slate-500">
                  Received at
                </p>
                <p className="mt-1 text-sm text-white">
                  {new Date(data.receivedAt).toLocaleString()}
                </p>
              </div>

              <div>
                <p className="text-xs uppercase tracking-wide text-slate-500">
                  Size
                </p>
                <p className="mt-1 text-sm text-white">{data.sizeKb} KB</p>
              </div>

              <div>
                <p className="text-xs uppercase tracking-wide text-slate-500">
                  Source system
                </p>
                <p className="mt-1 text-sm text-white">{data.sourceSystem}</p>
              </div>

              <div>
                <p className="text-xs uppercase tracking-wide text-slate-500">
                  Storage path
                </p>
                <p className="mt-1 break-all text-sm text-white">
                  {data.storagePath}
                </p>
              </div>
            </div>

            <div className="mt-5">
              <p className="text-xs uppercase tracking-wide text-slate-500">
                Current status
              </p>
              <span
                className={`mt-2 inline-flex rounded-full px-3 py-1 text-xs font-medium ${statusClasses(data.status)}`}
              >
                {data.status}
              </span>
            </div>

            {data.notes ? (
              <div className="mt-5">
                <p className="text-xs uppercase tracking-wide text-slate-500">
                  Notes
                </p>
                <p className="mt-2 text-sm text-slate-300">{data.notes}</p>
              </div>
            ) : null}
          </Card>
        </div>

        <div>
          <Card>
            <h2 className="text-lg font-semibold text-white">Timeline</h2>
            <p className="mt-2 text-sm text-slate-400">
              Custody and processing milestones for this file.
            </p>

            <div className="mt-5">
              <FileRegistryTimeline events={data.timeline} />
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}