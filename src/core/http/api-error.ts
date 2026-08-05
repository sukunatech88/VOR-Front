export type ApiErrorKind = "http" | "network" | "protocol";

interface ApiErrorOptions {
  kind: ApiErrorKind;
  message: string;
  status: number | null;
  statusText: string | null;
  method: string;
  path: string;
  error: string | null;
  timestamp: string | null;
  responsePath: string | null;
  retryable: boolean;
}

interface HttpApiErrorOptions {
  status: number;
  statusText: string;
  method: string;
  path: string;
  error?: string | null;
  message?: string | null;
  timestamp?: string | null;
  responsePath?: string | null;
}

const unsafeMessagePattern =
  /\b(?:trace|exception|stack(?:\s*trace)?|authorization|bearer|access[_ -]?token|refresh[_ -]?token)\b/i;

function safeText(value: string | null | undefined, maxLength = 500) {
  if (typeof value !== "string") {
    return null;
  }

  const normalized = value.replace(/\s+/g, " ").trim();

  if (
    normalized.length === 0 ||
    normalized.length > maxLength ||
    unsafeMessagePattern.test(normalized)
  ) {
    return null;
  }

  return normalized;
}

function safeResponsePath(value: string | null | undefined) {
  const normalized = safeText(value, 500);

  if (!normalized || !normalized.startsWith("/")) {
    return null;
  }

  return normalized.split(/[?#]/, 1)[0] || null;
}

function httpFallback(status: number) {
  switch (status) {
    case 400:
      return "La solicitud no es válida.";
    case 401:
      return "La sesión no es válida o expiró.";
    case 403:
      return "No tienes permisos para realizar esta operación.";
    case 404:
      return "El recurso solicitado no fue encontrado.";
    case 409:
      return "La operación no puede completarse por un conflicto de estado.";
    default:
      return status >= 500
        ? "Ocurrió un error interno. Intenta nuevamente más tarde."
        : "La solicitud no pudo completarse.";
  }
}

export class ApiError extends Error {
  readonly kind: ApiErrorKind;
  readonly status: number | null;
  readonly statusText: string | null;
  readonly method: string;
  readonly path: string;
  readonly error: string | null;
  readonly timestamp: string | null;
  readonly responsePath: string | null;
  readonly retryable: boolean;

  constructor(options: ApiErrorOptions) {
    super(options.message);
    this.name = "ApiError";
    this.kind = options.kind;
    this.status = options.status;
    this.statusText = options.statusText;
    this.method = options.method;
    this.path = options.path;
    this.error = options.error;
    this.timestamp = options.timestamp;
    this.responsePath = options.responsePath;
    this.retryable = options.retryable;
  }

  static fromHttp(options: HttpApiErrorOptions) {
    const safeError = safeText(options.error);
    const safeMessage = safeText(options.message);
    const canUseBackendMessage = [400, 401, 403, 404, 409].includes(
      options.status,
    );
    const message = canUseBackendMessage
      ? safeMessage || safeError || httpFallback(options.status)
      : httpFallback(options.status);

    return new ApiError({
      kind: "http",
      message,
      status: options.status,
      statusText: safeText(options.statusText, 200),
      method: options.method,
      path: options.path,
      error: safeError,
      timestamp: safeText(options.timestamp, 200),
      responsePath: safeResponsePath(options.responsePath),
      retryable: options.status >= 500,
    });
  }

  static network(method: string, path: string) {
    return new ApiError({
      kind: "network",
      message: "No fue posible conectar con el servicio VOR.",
      status: null,
      statusText: null,
      method,
      path,
      error: null,
      timestamp: null,
      responsePath: null,
      retryable: true,
    });
  }

  static protocol(
    method: string,
    path: string,
    status: number | null = null,
    statusText: string | null = null,
  ) {
    return new ApiError({
      kind: "protocol",
      message: "El servicio VOR devolvió una respuesta no válida.",
      status,
      statusText: safeText(statusText, 200),
      method,
      path,
      error: null,
      timestamp: null,
      responsePath: null,
      retryable: false,
    });
  }
}
