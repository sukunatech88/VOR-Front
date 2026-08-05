interface ResultEntry {
  label: string;
  value: string | number | boolean;
}

interface ProcessingActionResultProps {
  entries: ResultEntry[];
  message?: string;
}

export function ProcessingActionResult({
  entries,
  message,
}: ProcessingActionResultProps) {
  return (
    <div
      className="mt-4 rounded-xl border border-emerald-500/20 bg-emerald-500/10 p-4"
      role="status"
      aria-live="polite"
    >
      {message ? (
        <p className="text-sm text-emerald-200">{message}</p>
      ) : null}
      <dl className="mt-3 grid gap-3 sm:grid-cols-2">
        {entries.map((entry) => (
          <div key={entry.label}>
            <dt className="text-xs text-emerald-300/70">{entry.label}</dt>
            <dd className="mt-1 break-words text-sm text-emerald-100">
              {String(entry.value)}
            </dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
