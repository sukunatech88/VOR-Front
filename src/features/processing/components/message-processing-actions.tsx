import { useState } from "react";

import {
  useApplyStatusReport,
  useNormalizeMessage,
  useParseMessage,
  useValidateMessage,
} from "../hooks/use-message-processing-actions";
import {
  getApplyStatusReportEligibility,
  getNormalizeEligibility,
  getParseEligibility,
  getValidateEligibility,
} from "../lib/processing-eligibility";
import type {
  ProcessingMessageStatus,
  ProcessingMessageType,
} from "../types/processing.types";
import { ProcessingAction } from "./processing-action";
import { ProcessingActionResult } from "./processing-action-result";

type ActionKey = "parse" | "normalize" | "validate" | "apply";

interface MessageProcessingActionsProps {
  messageId: string;
  fileId?: string;
  status: ProcessingMessageStatus;
  type: ProcessingMessageType;
}

export function MessageProcessingActions({
  messageId,
  fileId,
  status,
  type,
}: MessageProcessingActionsProps) {
  const [confirming, setConfirming] = useState<ActionKey | null>(null);
  const parse = useParseMessage(messageId, fileId);
  const normalize = useNormalizeMessage(messageId, fileId);
  const validate = useValidateMessage(messageId, fileId);
  const apply = useApplyStatusReport(messageId, fileId);
  const parseEligibility = getParseEligibility(status, type);
  const normalizeEligibility = getNormalizeEligibility(status, type);
  const validateEligibility = getValidateEligibility(status, type);
  const applyEligibility = getApplyStatusReportEligibility(status, type);

  return (
    <div className="space-y-4">
      <ProcessingAction
        title="Parse message"
        description="Parse the stored ISO 20022 payload and persist a snapshot."
        buttonLabel="Parse message"
        pendingLabel="Parsing..."
        confirmation="Parse this message now? Normalize will not run automatically."
        allowed={parseEligibility.allowed}
        disabledReason={parseEligibility.reason}
        isConfirming={confirming === "parse"}
        isPending={parse.isPending}
        error={parse.error}
        onRequestConfirmation={() => {
          parse.reset();
          setConfirming("parse");
        }}
        onCancel={() => setConfirming(null)}
        onConfirm={() => {
          setConfirming(null);
          parse.mutate();
        }}
        result={
          parse.data ? (
            <ProcessingActionResult
              message="Parse operation completed."
              entries={[
                { label: "Message ID", value: parse.data.messageId },
                { label: "Message type", value: parse.data.messageType },
                { label: "Message status", value: parse.data.messageStatus },
                {
                  label: "Parsed snapshot ID",
                  value: parse.data.parsedSnapshotId,
                },
                {
                  label: "Parsed transactions",
                  value: parse.data.transactions.length,
                },
                {
                  label: "Account statements",
                  value: parse.data.accountStatements.length,
                },
              ]}
            />
          ) : undefined
        }
      />
      <ProcessingAction
        title="Normalize message"
        description="Create canonical business objects from the parsed snapshot."
        buttonLabel="Normalize message"
        pendingLabel="Normalizing..."
        confirmation="Normalize this message now? Validation will not run automatically."
        allowed={normalizeEligibility.allowed}
        disabledReason={normalizeEligibility.reason}
        isConfirming={confirming === "normalize"}
        isPending={normalize.isPending}
        error={normalize.error}
        onRequestConfirmation={() => {
          normalize.reset();
          setConfirming("normalize");
        }}
        onCancel={() => setConfirming(null)}
        onConfirm={() => {
          setConfirming(null);
          normalize.mutate();
        }}
        result={
          normalize.data ? (
            <ProcessingActionResult
              message="Normalization operation completed."
              entries={[
                { label: "Message ID", value: normalize.data.messageId },
                { label: "Message status", value: normalize.data.messageStatus },
                {
                  label: "Transactions created",
                  value: normalize.data.transactionCount,
                },
                {
                  label: "Status transactions created",
                  value: normalize.data.statusTransactionCount,
                },
                {
                  label: "Statements created",
                  value: normalize.data.statementCount,
                },
                {
                  label: "Statement entries created",
                  value: normalize.data.statementEntryCount,
                },
              ]}
            />
          ) : undefined
        }
      />
      <ProcessingAction
        title="Validate message"
        description="Run business validation and persist its findings."
        buttonLabel="Validate message"
        pendingLabel="Validating..."
        confirmation="Validate this message now? A successful request may still return a FAILED validation result."
        allowed={validateEligibility.allowed}
        disabledReason={validateEligibility.reason}
        isConfirming={confirming === "validate"}
        isPending={validate.isPending}
        error={validate.error}
        onRequestConfirmation={() => {
          validate.reset();
          setConfirming("validate");
        }}
        onCancel={() => setConfirming(null)}
        onConfirm={() => {
          setConfirming(null);
          validate.mutate();
        }}
        result={
          validate.data ? (
            <>
              <ProcessingActionResult
                message="Validation execution completed."
                entries={[
                  { label: "Message ID", value: validate.data.messageId },
                  {
                    label: "Validation status",
                    value: validate.data.validationStatus,
                  },
                  {
                    label: "Message status",
                    value: validate.data.messageStatus,
                  },
                  { label: "Findings", value: validate.data.findingCount },
                ]}
              />
              {validate.data.findings.length ? (
                <ul className="mt-3 space-y-2">
                  {validate.data.findings.map((finding) => (
                    <li
                      key={`${finding.code}-${finding.targetType}-${finding.field ?? ""}`}
                      className="rounded-xl border border-slate-800 p-3 text-sm"
                    >
                      <p className="font-medium text-slate-200">
                        {finding.severity} · {finding.code}
                      </p>
                      <p className="mt-1 text-slate-400">
                        {finding.description}
                      </p>
                    </li>
                  ))}
                </ul>
              ) : null}
            </>
          ) : undefined
        }
      />
      <ProcessingAction
        title="Apply status report"
        description="Match this PAIN_002 report and update related payment objects."
        buttonLabel="Apply status report"
        pendingLabel="Applying status report..."
        confirmation="Apply this status report? It may update related payment, message and file states."
        allowed={applyEligibility.allowed}
        disabledReason={applyEligibility.reason}
        isConfirming={confirming === "apply"}
        isPending={apply.isPending}
        error={apply.error}
        onRequestConfirmation={() => {
          apply.reset();
          setConfirming("apply");
        }}
        onCancel={() => setConfirming(null)}
        onConfirm={() => {
          setConfirming(null);
          apply.mutate();
        }}
        result={
          apply.data ? (
            <ProcessingActionResult
              message={
                apply.data.alreadyApplied
                  ? "The existing status report application was returned."
                  : "Status report application completed."
              }
              entries={[
                { label: "Message ID", value: apply.data.messageId },
                { label: "Application status", value: apply.data.status },
                {
                  label: "Matched transactions",
                  value: apply.data.matchedTransactionCount,
                },
                {
                  label: "Unmatched transactions",
                  value: apply.data.unmatchedTransactionCount,
                },
                {
                  label: "Manual review",
                  value: apply.data.manualReviewCount,
                },
                { label: "Already applied", value: apply.data.alreadyApplied },
              ]}
            />
          ) : undefined
        }
      />
    </div>
  );
}
