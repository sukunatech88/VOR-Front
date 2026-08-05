import { ApiError } from "../../../core/http/api-error";
import { Button } from "../../../shared/components/ui/button";
import { Card } from "../../../shared/components/ui/card";

interface PaymentMonitorErrorStateProps {
  error: ApiError | null;
  isRetrying?: boolean;
  onRetry?: () => void;
}

export function PaymentMonitorErrorState({
  error,
  isRetrying = false,
  onRetry,
}: PaymentMonitorErrorStateProps) {
  const status = error?.status;
  const isBadRequest = status === 400;
  const isUnauthorized = status === 401;
  const isForbidden = status === 403;
  const isNotFound = status === 404;
  const canRetry =
    error !== null &&
    (error.kind === "network" ||
      error.kind === "protocol" ||
      (status !== null && status !== undefined && status >= 500));
  const title = isBadRequest
    ? "Invalid payment monitor request"
    : isUnauthorized
      ? "Session unavailable"
      : isForbidden
        ? "Access denied"
        : isNotFound
          ? "Payment instruction not found"
          : "Payment Monitor unavailable";
  const message = isBadRequest
    ? "Review the filters and try again."
    : isForbidden
      ? "You do not have permission to access this treasury information."
      : isNotFound
        ? "The requested payment instruction was not found."
        : error?.message || "The request could not be completed.";

  return (
    <Card role="alert" aria-live="assertive">
      <h2 className="text-lg font-semibold text-white">{title}</h2>
      <p className="mt-2 text-sm text-rose-300">{message}</p>
      {isUnauthorized ? (
        <p className="mt-2 text-sm text-slate-400">
          Sign out and sign in again to restore your session.
        </p>
      ) : null}
      {canRetry && onRetry ? (
        <Button
          className="mt-4"
          type="button"
          variant="secondary"
          onClick={onRetry}
          disabled={isRetrying}
        >
          {isRetrying ? "Retrying..." : "Retry"}
        </Button>
      ) : null}
    </Card>
  );
}
