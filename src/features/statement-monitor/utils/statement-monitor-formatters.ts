export function text(value: string | null | undefined) { return value?.trim() || "—"; }
export function dateTime(value: string | null | undefined) {
  if (!value) return "—";
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? value : new Intl.DateTimeFormat(undefined, { dateStyle: "medium", timeStyle: "short" }).format(date);
}
export function amount(value: number | null | undefined, currency?: string | null) {
  if (value === null || value === undefined) return "—";
  return `${new Intl.NumberFormat(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(value)}${currency ? ` ${currency}` : ""}`;
}
export function shortId(value: string) { return `${value.slice(0, 8)}…${value.slice(-4)}`; }
