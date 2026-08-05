import type { ReactNode } from "react";

import type { ApiError } from "../../../core/http/api-error";
import { Button } from "../../../shared/components/ui/button";

function processingErrorMessage(error: ApiError) {
  if (error.status === 401) return "Session unavailable.";
  if (error.status === 403) return "Access denied.";
  if (error.status === 404) return "File or message not found.";
  if (error.status === 409) {
    return "Operation cannot be executed in the current state.";
  }
  if (error.status === 400) {
    return error.message || "Invalid operation request.";
  }
  if (error.kind === "network") return "VOR backend is unavailable.";
  if (error.kind === "protocol") {
    return "VOR returned an invalid response.";
  }
  return "VOR could not complete the operation.";
}

interface ProcessingActionProps {
  title: string;
  description: string;
  buttonLabel: string;
  pendingLabel: string;
  confirmation: string;
  allowed: boolean;
  disabledReason?: string;
  isConfirming: boolean;
  isPending: boolean;
  error: ApiError | null;
  result?: ReactNode;
  onRequestConfirmation: () => void;
  onCancel: () => void;
  onConfirm: () => void;
}

export function ProcessingAction({
  title,
  description,
  buttonLabel,
  pendingLabel,
  confirmation,
  allowed,
  disabledReason,
  isConfirming,
  isPending,
  error,
  result,
  onRequestConfirmation,
  onCancel,
  onConfirm,
}: ProcessingActionProps) {
  return (
    <section className="rounded-xl border border-slate-800 bg-slate-950/40 p-4">
      <h3 className="font-medium text-white">{title}</h3>
      <p className="mt-1 text-sm text-slate-400">{description}</p>
      {!allowed && disabledReason ? (
        <p className="mt-3 text-xs text-amber-300">{disabledReason}</p>
      ) : null}
      <Button
        className="mt-4"
        type="button"
        variant="secondary"
        disabled={!allowed || isPending}
        onClick={onRequestConfirmation}
      >
        {isPending ? pendingLabel : buttonLabel}
      </Button>
      {isConfirming ? (
        <div
          className="mt-4 rounded-xl border border-amber-500/20 bg-amber-500/10 p-4"
          role="dialog"
          aria-label={`Confirm ${title}`}
        >
          <p className="text-sm text-amber-100">{confirmation}</p>
          <div className="mt-4 flex flex-wrap gap-3">
            <Button type="button" onClick={onConfirm} disabled={isPending}>
              Confirm
            </Button>
            <Button
              type="button"
              variant="ghost"
              onClick={onCancel}
              disabled={isPending}
            >
              Cancel
            </Button>
          </div>
        </div>
      ) : null}
      {error ? (
        <p className="mt-4 text-sm text-rose-300" role="alert">
          {processingErrorMessage(error)}
        </p>
      ) : null}
      {result}
    </section>
  );
}
