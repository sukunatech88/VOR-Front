const dateTimeFormatter = new Intl.DateTimeFormat(undefined, {
  dateStyle: "medium",
  timeStyle: "short",
});

const dateFormatter = new Intl.DateTimeFormat(undefined, {
  dateStyle: "medium",
});

export function formatDateTime(value: string) {
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? "Date unavailable"
    : dateTimeFormatter.format(date);
}

export function formatDate(value: string | null) {
  if (!value) {
    return "—";
  }

  const date = new Date(`${value}T00:00:00`);
  return Number.isNaN(date.getTime())
    ? "Date unavailable"
    : dateFormatter.format(date);
}

export function formatDecimal(value: number | null) {
  if (value === null) {
    return "—";
  }

  const raw = String(value);

  if (/[eE]/.test(raw)) {
    return raw;
  }

  const [integer, fraction] = raw.split(".");
  const groupedInteger = integer.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  return fraction === undefined
    ? groupedInteger
    : `${groupedInteger}.${fraction}`;
}

export function truncateId(value: string) {
  return `${value.slice(0, 8)}…${value.slice(-4)}`;
}

export function displayText(value: string | null) {
  return value?.trim() || "—";
}
