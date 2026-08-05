import { ApiError } from "../../../core/http/api-error";
import { Button } from "../../../shared/components/ui/button";
import { Card } from "../../../shared/components/ui/card";

interface FileRegistryErrorStateProps {
  error: ApiError | null;
  isRetrying?: boolean;
  notFoundMessage?: string;
  onRetry?: () => void;
}

export function FileRegistryErrorState({
  error,
  isRetrying = false,
  notFoundMessage = "The requested file was not found.",
  onRetry,
}: FileRegistryErrorStateProps) {
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
        ? "File not found"
        : isConflict
          ? "Operation conflict"
          : "File Registry unavailable";
  const message = isForbidden
    ? "You do not have permission to access this operational information."
    : isNotFound
      ? notFoundMessage
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
