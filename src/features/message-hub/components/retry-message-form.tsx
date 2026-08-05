import { useState, type FormEvent } from "react";

import type { ApiError } from "../../../core/http/api-error";
import { Button } from "../../../shared/components/ui/button";
import { useRetryMessage } from "../hooks/use-retry-message";
import type { MessageStatus, MessageType } from "../types/message-hub.types";

const retryableTypes = new Set<MessageType>([
  "PAIN_001",
  "PAIN_002",
  "CAMT_053",
]);

interface RetryMessageFormProps {
  messageId: string;
  messageStatus: MessageStatus;
  messageType: MessageType;
}

function retryErrorMessage(error: ApiError) {
  if (error.status === 401) {
    return "Session unavailable. Sign in again before retrying.";
  }

  if (error.status === 403) {
    return "Access denied.";
  }

  if (error.status === 404) {
    return "Message not found.";
  }

  if (error.status === 409) {
    return "Message cannot be retried in its current state.";
  }

  if (error.kind === "network") {
    return "The VOR service is unavailable. The retry was not repeated automatically.";
  }

  if (error.kind === "protocol") {
    return "The VOR service returned an invalid response.";
  }

  return error.message;
}

export function RetryMessageForm({
  messageId,
  messageStatus,
  messageType,
}: RetryMessageFormProps) {
  const [reason, setReason] = useState("");
  const retryMessage = useRetryMessage();
  const trimmedReason = reason.trim();
  const isAvailable =
    messageStatus === "IDENTIFIED" && retryableTypes.has(messageType);
  const isReasonValid =
    trimmedReason.length >= 10 && trimmedReason.length <= 500;

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!isAvailable || !isReasonValid || retryMessage.isPending) {
      return;
    }

    retryMessage.mutate({
      messageId,
      reason: trimmedReason,
      idempotencyKey: `retry-${crypto.randomUUID()}`,
    });
  }

  if (!isAvailable) {
    return (
      <p className="text-sm text-slate-400">
        Retry PARSE is available only for an IDENTIFIED PAIN_001, PAIN_002, or
        CAMT_053 message.
      </p>
    );
  }

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      <div>
        <label
          className="text-sm font-medium text-slate-200"
          htmlFor="retry-reason"
        >
          Reason
        </label>
        <textarea
          id="retry-reason"
          className="mt-2 min-h-28 w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-white outline-none focus-visible:border-indigo-400 focus-visible:ring-2 focus-visible:ring-indigo-400/40"
          value={reason}
          onChange={(event) => {
            setReason(event.target.value);
            retryMessage.reset();
          }}
          minLength={10}
          maxLength={500}
          required
          disabled={retryMessage.isPending}
          aria-describedby="retry-reason-help"
        />
        <div
          id="retry-reason-help"
          className="mt-2 flex justify-between gap-4 text-xs text-slate-400"
        >
          <span>10–500 characters after trimming.</span>
          <span>{trimmedReason.length}/500</span>
        </div>
      </div>
      <Button
        type="submit"
        disabled={!isReasonValid || retryMessage.isPending}
      >
        {retryMessage.isPending ? "Retrying..." : "Retry PARSE"}
      </Button>
      {retryMessage.error ? (
        <p role="alert" className="text-sm text-rose-300">
          {retryErrorMessage(retryMessage.error)}
        </p>
      ) : null}
      {retryMessage.data ? (
        <div
          role="status"
          aria-live="polite"
          className="rounded-xl border border-emerald-500/20 bg-emerald-500/10 p-3 text-sm text-emerald-200"
        >
          {retryMessage.data.idempotentReplay
            ? "The previous retry result was returned. No duplicate operation was created."
            : `Retry completed with outcome ${retryMessage.data.outcome}. Current message status: ${retryMessage.data.currentStatus}.`}
        </div>
      ) : null}
    </form>
  );
}
