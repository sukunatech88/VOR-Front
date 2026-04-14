import { ArrowLeft } from "lucide-react";
import { Link, useParams } from "react-router-dom";

import { useMessageHubDetail } from "../hooks/use-message-hub-detail";
import { MessageHubTimeline } from "../components/message-hub-timeline";
import { Card } from "../../../shared/components/ui/card";
import { Button } from "../../../shared/components/ui/button";
import { PageHeader } from "../../../shared/components/page-header";

function statusClasses(status: string) {
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

export function MessageHubDetailPage() {
  const { messageId = "" } = useParams();
  const { data, isLoading, isError } = useMessageHubDetail(messageId);

  if (isLoading) {
    return (
      <Card>
        <p className="text-sm text-slate-300">Loading message detail...</p>
      </Card>
    );
  }

  if (isError || !data) {
    return (
      <Card>
        <p className="text-sm text-rose-300">Failed to load message detail.</p>
        <div className="mt-4">
          <Link to="/message-hub">
            <Button variant="ghost">Back to message hub</Button>
          </Link>
        </div>
      </Card>
    );
  }

  return (
    <div>
      <div className="mb-4">
        <Link to="/message-hub">
          <Button variant="ghost">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to message hub
          </Button>
        </Link>
      </div>

      <PageHeader
        title={`Message Detail · ${data.messageId}`}
        description="Message traceability view for processing lifecycle and canonical state."
      />

      <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <div className="space-y-6">
          <Card>
            <h2 className="text-lg font-semibold text-white">Metadata</h2>

            <div className="mt-5 grid gap-4 md:grid-cols-2">
              <div>
                <p className="text-xs uppercase tracking-wide text-slate-500">
                  Message ID
                </p>
                <p className="mt-1 text-sm text-white">{data.messageId}</p>
              </div>

              <div>
                <p className="text-xs uppercase tracking-wide text-slate-500">
                  File ID
                </p>
                <p className="mt-1 text-sm text-white">{data.fileId}</p>
              </div>

              <div>
                <p className="text-xs uppercase tracking-wide text-slate-500">
                  Reference
                </p>
                <p className="mt-1 text-sm text-white">{data.reference}</p>
              </div>

              <div>
                <p className="text-xs uppercase tracking-wide text-slate-500">
                  Message type
                </p>
                <p className="mt-1 text-sm text-white">{data.messageType}</p>
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
                  Source system
                </p>
                <p className="mt-1 text-sm text-white">{data.sourceSystem}</p>
              </div>

              <div>
                <p className="text-xs uppercase tracking-wide text-slate-500">
                  Created at
                </p>
                <p className="mt-1 text-sm text-white">
                  {new Date(data.createdAt).toLocaleString()}
                </p>
              </div>

              <div>
                <p className="text-xs uppercase tracking-wide text-slate-500">
                  Canonical status
                </p>
                <p className="mt-1 text-sm text-white">{data.canonicalStatus}</p>
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

          <Card>
            <h2 className="text-lg font-semibold text-white">Payload preview</h2>
            <p className="mt-2 text-sm text-slate-400">
              Initial preview of the canonical or parsed message payload.
            </p>

            <pre className="mt-5 overflow-x-auto rounded-2xl border border-slate-800 bg-slate-950/60 p-4 text-xs text-slate-300">
              {data.payloadPreview}
            </pre>
          </Card>
        </div>

        <div>
          <Card>
            <h2 className="text-lg font-semibold text-white">Timeline</h2>
            <p className="mt-2 text-sm text-slate-400">
              Processing milestones for this message.
            </p>

            <div className="mt-5">
              <MessageHubTimeline events={data.timeline} />
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}