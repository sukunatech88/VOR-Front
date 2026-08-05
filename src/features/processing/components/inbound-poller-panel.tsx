import { useState } from "react";

import { Card } from "../../../shared/components/ui/card";
import { useRunInboundPoller } from "../hooks/use-run-inbound-poller";
import { ProcessingAction } from "./processing-action";
import { ProcessingActionResult } from "./processing-action-result";

export function InboundPollerPanel() {
  const [isConfirming, setIsConfirming] = useState(false);
  const poller = useRunInboundPoller();

  return (
    <Card>
      <h2 className="text-lg font-semibold text-white">Inbound poller</h2>
      <p className="mt-2 text-sm text-slate-400">
        Explicitly inspect configured inbound connections and process discovered
        files. Use only with local test infrastructure.
      </p>
      <div className="mt-5">
        <ProcessingAction
          title="Run inbound poller"
          description="This operation may connect to SFTP and register new files."
          buttonLabel="Run inbound poller"
          pendingLabel="Running inbound poller..."
          confirmation="Run the inbound poller now? Confirm that active connections point only to test infrastructure."
          allowed
          isConfirming={isConfirming}
          isPending={poller.isPending}
          error={poller.error}
          onRequestConfirmation={() => {
            poller.reset();
            setIsConfirming(true);
          }}
          onCancel={() => setIsConfirming(false)}
          onConfirm={() => {
            setIsConfirming(false);
            poller.mutate();
          }}
          result={
            poller.data ? (
              <ProcessingActionResult
                message="Inbound poller execution completed."
                entries={[
                  { label: "Source", value: poller.data.sourceName },
                  { label: "Discovered", value: poller.data.discoveredCount },
                  { label: "Processed", value: poller.data.processedCount },
                  { label: "Skipped", value: poller.data.skippedCount },
                  { label: "Failed", value: poller.data.failedCount },
                  { label: "Archived", value: poller.data.archivedCount },
                  {
                    label: "Archive failures",
                    value: poller.data.archiveFailedCount,
                  },
                ]}
              />
            ) : undefined
          }
        />
      </div>
    </Card>
  );
}
