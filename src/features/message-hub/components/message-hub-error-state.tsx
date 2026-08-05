import { ApiError } from "../../../core/http/api-error";
import { Button } from "../../../shared/components/ui/button";
import { Card } from "../../../shared/components/ui/card";

interface MessageHubErrorStateProps {
  error: ApiError | null;
  isRetrying?: boolean;
  onRetry?: () => void;
}

export function MessageHubErrorState({
  error,
  isRetrying = false,
  onRetry,
}: MessageHubErrorStateProps) {
  const isUnauthorized = error?.status === 401;
  const isForbidden = error?.status === 403;
  const isNotFound = error?.status === 404;
  const isConflict = error?.status === 409;
  const canRetry =
    error !== null &&
    (error.kind === "network" ||
      error.kind === "protocol" ||
      (error.status !== null && error.status >= 500));
  const title = isUnauthorized
    ? "Session unavailable"
    : isForbidden
      ? "Access denied"
      : isNotFound
        ? "Message not found"
        : isConflict
          ? "Message conflict"
          : "Message Hub unavailable";
  const message = isForbidden
    ? "You do not have permission to access this operational information."
    : isNotFound
      ? "The requested message was not found."
      : isConflict
        ? "The message cannot be processed in its current state."
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
          Retry
        </Button>
      ) : null}
    </Card>
  );
}
