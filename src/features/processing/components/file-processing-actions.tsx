import { useState } from "react";
import { Link } from "react-router-dom";

import {
  useDispatchOutboundFile,
  useIdentifyMessage,
} from "../hooks/use-file-processing-actions";
import {
  getDispatchEligibility,
  getIdentifyEligibility,
} from "../lib/processing-eligibility";
import type {
  ProcessingMessageStatus,
  ProcessingMessageType,
} from "../types/processing.types";
import { ProcessingAction } from "./processing-action";
import { ProcessingActionResult } from "./processing-action-result";

interface FileProcessingActionsProps {
  file: {
    id: string;
    originalFileName: string;
    direction: "INBOUND" | "OUTBOUND";
    bankConnectionDisplayName: string;
  };
  message?: {
    id: string;
    status: ProcessingMessageStatus;
    type: ProcessingMessageType;
  };
}

export function FileProcessingActions({
  file,
  message,
}: FileProcessingActionsProps) {
  const [confirming, setConfirming] = useState<
    "identify" | "dispatch" | null
  >(null);
  const identify = useIdentifyMessage(file.id);
  const dispatch = useDispatchOutboundFile(file.id, message?.id);
  const identifyEligibility = getIdentifyEligibility(Boolean(message));
  const dispatchEligibility = getDispatchEligibility({
    direction: file.direction,
    messageStatus: message?.status,
    messageType: message?.type,
  });

  return (
    <div className="space-y-4">
      <ProcessingAction
        title="Identify message"
        description="Detect the ISO 20022 message and associate it with this file."
        buttonLabel="Identify message"
        pendingLabel="Identifying..."
        confirmation={`Identify the message contained in ${file.originalFileName}? Parsing will not run automatically.`}
        allowed={identifyEligibility.allowed}
        disabledReason={identifyEligibility.reason}
        isConfirming={confirming === "identify"}
        isPending={identify.isPending}
        error={identify.error}
        onRequestConfirmation={() => {
          identify.reset();
          setConfirming("identify");
        }}
        onCancel={() => setConfirming(null)}
        onConfirm={() => {
          setConfirming(null);
          identify.mutate();
        }}
        result={
          identify.data ? (
            <>
              <ProcessingActionResult
                message="Message identification completed."
                entries={[
                  { label: "File ID", value: identify.data.fileId },
                  { label: "Message ID", value: identify.data.messageId },
                  { label: "Message type", value: identify.data.messageType },
                  { label: "Message status", value: identify.data.messageStatus },
                  { label: "File status", value: identify.data.fileStatus },
                ]}
              />
              <Link
                className="mt-3 inline-flex text-sm text-indigo-300 underline-offset-4 hover:underline"
                to={`/message-hub/${identify.data.messageId}`}
              >
                Open identified message
              </Link>
            </>
          ) : undefined
        }
      />
      <ProcessingAction
        title="Dispatch outbound file"
        description={`Transfer this file through ${file.bankConnectionDisplayName}.`}
        buttonLabel="Dispatch outbound file"
        pendingLabel="Dispatching..."
        confirmation={`Dispatch ${file.originalFileName} to ${file.bankConnectionDisplayName}? This performs a real transport operation.`}
        allowed={dispatchEligibility.allowed}
        disabledReason={dispatchEligibility.reason}
        isConfirming={confirming === "dispatch"}
        isPending={dispatch.isPending}
        error={dispatch.error}
        onRequestConfirmation={() => {
          dispatch.reset();
          setConfirming("dispatch");
        }}
        onCancel={() => setConfirming(null)}
        onConfirm={() => {
          setConfirming(null);
          dispatch.mutate();
        }}
        result={
          dispatch.data ? (
            <ProcessingActionResult
              message="Dispatch operation completed."
              entries={[
                { label: "File ID", value: dispatch.data.fileId },
                { label: "Message ID", value: dispatch.data.messageId },
                { label: "File status", value: dispatch.data.fileStatus },
                { label: "Message status", value: dispatch.data.messageStatus },
                { label: "Outcome", value: dispatch.data.outcome },
                { label: "Attempt", value: dispatch.data.attemptNumber },
              ]}
            />
          ) : undefined
        }
      />
    </div>
  );
}
