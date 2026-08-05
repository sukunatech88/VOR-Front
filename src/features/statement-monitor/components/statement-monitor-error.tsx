import type { ApiError } from "../../../core/http/api-error";
import { Button } from "../../../shared/components/ui/button";
import { Card } from "../../../shared/components/ui/card";

export function StatementMonitorError({ error, onRetry, retrying = false }: { error: ApiError | null; onRetry?: () => void; retrying?: boolean }) {
  const titles: Record<number, string> = { 400: "Invalid statement request", 401: "Session unavailable", 403: "Access denied", 404: "Statement not found" };
  const canRetry = error?.kind === "network" || error?.kind === "protocol" || (error?.status !== null && error?.status !== undefined && error.status >= 500);
  return <Card role="alert" aria-live="assertive">
    <h2 className="text-lg font-semibold text-white">{error?.status ? titles[error.status] || "Statement Monitor unavailable" : "Statement Monitor unavailable"}</h2>
    <p className="mt-2 text-sm text-rose-300">{error?.message || "The request could not be completed."}</p>
    {canRetry && onRetry ? <Button className="mt-4" variant="secondary" onClick={onRetry} disabled={retrying}>{retrying ? "Retrying..." : "Retry"}</Button> : null}
  </Card>;
}
