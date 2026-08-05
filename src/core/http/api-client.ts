import { ApiError } from "./api-error";

type ApiMethod = "GET" | "POST" | "PUT";
type ApiQueryPrimitive = string | number | boolean | null | undefined;

export type ApiQueryValue =
  | ApiQueryPrimitive
  | readonly ApiQueryPrimitive[];

export type AccessTokenProvider = (options?: {
  forceRefresh?: boolean;
}) => Promise<string>;

export interface ApiBinaryResponse {
  blob: Blob;
  contentType: string | null;
  contentDisposition: string | null;
}

interface ApiRequestBaseOptions {
  query?: Readonly<Record<string, ApiQueryValue>>;
  headers?: HeadersInit;
  signal?: AbortSignal;
  retryOnUnauthorized?: boolean;
}

type ApiRequestContent =
  | {
      json: unknown;
      body?: never;
    }
  | {
      json?: never;
      body: BodyInit | null;
    }
  | {
      json?: never;
      body?: never;
    };

export type ApiRequestOptions = ApiRequestBaseOptions & ApiRequestContent;

type ApiGetOptions = ApiRequestBaseOptions & {
  json?: never;
  body?: never;
};

type ApiRequestMethodOptions = ApiRequestOptions & {
  method?: ApiMethod;
};

export interface ApiClient {
  request<T>(path: string, options?: ApiRequestMethodOptions): Promise<T>;
  get<T>(path: string, options?: ApiGetOptions): Promise<T>;
  getBinary(
    path: string,
    options?: ApiGetOptions,
  ): Promise<ApiBinaryResponse>;
  post<T>(path: string, options?: ApiRequestOptions): Promise<T>;
  put<T>(path: string, options?: ApiRequestOptions): Promise<T>;
}

interface CreateApiClientOptions {
  baseUrl: string;
  getAccessToken: AccessTokenProvider;
  fetch?: typeof globalThis.fetch;
}

interface SafeErrorBody {
  status?: number;
  error?: string;
  message?: string;
  timestamp?: string;
  path?: string;
}

function normalizeBaseUrl(baseUrl: string) {
  const normalized = baseUrl.replace(/\/+$/, "");

  try {
    const url = new URL(normalized);

    if (
      (url.protocol !== "http:" && url.protocol !== "https:") ||
      url.username ||
      url.password
    ) {
      throw ApiError.protocol("CONFIG", "/");
    }

    return url;
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }

    throw ApiError.protocol("CONFIG", "/");
  }
}

function hasControlCharacters(value: string) {
  return Array.from(value).some((character) => {
    const code = character.charCodeAt(0);
    return code <= 31 || code === 127;
  });
}

function safeResponseHeader(value: string | null, maxLength: number) {
  if (
    !value ||
    value.length > maxLength ||
    hasControlCharacters(value)
  ) {
    return null;
  }

  return value;
}

function sanitizeDownloadFileName(value: string) {
  const normalized = value.normalize("NFKC").trim();

  if (
    !normalized ||
    normalized === "." ||
    normalized === ".." ||
    normalized.includes("/") ||
    normalized.includes("\\") ||
    hasControlCharacters(normalized)
  ) {
    return null;
  }

  const sanitized = normalized
    .replace(/[<>:"|?*]/g, "_")
    .replace(/\s+/g, " ")
    .slice(0, 255)
    .replace(/[. ]+$/, "");

  return sanitized && sanitized !== "." && sanitized !== ".."
    ? sanitized
    : null;
}

function contentDispositionFileName(contentDisposition: string | null) {
  if (!contentDisposition) {
    return null;
  }

  const extendedMatch =
    /(?:^|;)\s*filename\*\s*=\s*(?:UTF-8'')?([^;]+)/i.exec(
      contentDisposition,
    );

  if (extendedMatch?.[1]) {
    const encoded = extendedMatch[1].trim().replace(/^"|"$/g, "");

    try {
      return decodeURIComponent(encoded);
    } catch {
      return null;
    }
  }

  const filenameMatch =
    /(?:^|;)\s*filename\s*=\s*(?:"([^"]*)"|([^;]*))/i.exec(
      contentDisposition,
    );

  return filenameMatch?.[1]?.trim() || filenameMatch?.[2]?.trim() || null;
}

export function getSafeDownloadFileName(
  contentDisposition: string | null,
  fallbackFileName: string,
) {
  const dispositionFileName = contentDispositionFileName(contentDisposition);

  return (
    (dispositionFileName
      ? sanitizeDownloadFileName(dispositionFileName)
      : null) ||
    sanitizeDownloadFileName(fallbackFileName) ||
    "download.bin"
  );
}

function validateInternalPath(path: string) {
  if (
    !path.startsWith("/") ||
    path.startsWith("//") ||
    path.includes("\\") ||
    path.includes("?") ||
    path.includes("#") ||
    hasControlCharacters(path)
  ) {
    throw ApiError.protocol("REQUEST", "/");
  }
}

function appendQuery(url: URL, query?: Readonly<Record<string, ApiQueryValue>>) {
  if (!query) {
    return;
  }

  for (const [key, rawValue] of Object.entries(query)) {
    const values = Array.isArray(rawValue) ? rawValue : [rawValue];

    for (const value of values) {
      if (value !== null && value !== undefined) {
        url.searchParams.append(key, String(value));
      }
    }
  }
}

function isJsonContentType(contentType: string | null) {
  if (!contentType) {
    return false;
  }

  const mediaType = contentType.split(";", 1)[0]?.trim().toLowerCase();
  return mediaType === "application/json" || Boolean(mediaType?.endsWith("+json"));
}

function isAbortError(error: unknown) {
  return (
    typeof error === "object" &&
    error !== null &&
    "name" in error &&
    error.name === "AbortError"
  );
}

function isReusableBody(body: BodyInit | null | undefined) {
  return !(
    typeof ReadableStream !== "undefined" && body instanceof ReadableStream
  );
}

function parseSafeErrorBody(text: string): SafeErrorBody {
  if (!text.trim()) {
    return {};
  }

  try {
    const value: unknown = JSON.parse(text);

    if (typeof value !== "object" || value === null || Array.isArray(value)) {
      return {};
    }

    const record = value as Record<string, unknown>;

    return {
      status: typeof record.status === "number" ? record.status : undefined,
      error: typeof record.error === "string" ? record.error : undefined,
      message: typeof record.message === "string" ? record.message : undefined,
      timestamp:
        typeof record.timestamp === "string" ? record.timestamp : undefined,
      path: typeof record.path === "string" ? record.path : undefined,
    };
  } catch {
    return {};
  }
}

async function parseResponse<T>(
  response: Response,
  method: ApiMethod,
  path: string,
): Promise<T> {
  await throwForErrorResponse(response, method, path);

  if (response.status === 204) {
    return undefined as T;
  }

  const text = await response.text();

  if (!text.trim()) {
    return undefined as T;
  }

  try {
    return JSON.parse(text) as T;
  } catch {
    throw ApiError.protocol(method, path, response.status, response.statusText);
  }
}

async function throwForErrorResponse(
  response: Response,
  method: ApiMethod,
  path: string,
) {
  if (!response.ok) {
    const text = await response.text();
    const errorBody = parseSafeErrorBody(text);
    const status =
      errorBody.status === response.status ? errorBody.status : response.status;

    throw ApiError.fromHttp({
      status,
      statusText: response.statusText,
      method,
      path,
      error: errorBody.error,
      message: errorBody.message,
      timestamp: errorBody.timestamp,
      responsePath: errorBody.path,
    });
  }
}

async function parseBinaryResponse(
  response: Response,
  method: ApiMethod,
  path: string,
): Promise<ApiBinaryResponse> {
  await throwForErrorResponse(response, method, path);

  return {
    blob: await response.blob(),
    contentType: safeResponseHeader(response.headers.get("Content-Type"), 200),
    contentDisposition: safeResponseHeader(
      response.headers.get("Content-Disposition"),
      1_024,
    ),
  };
}

export function createApiClient({
  baseUrl,
  getAccessToken,
  fetch: fetchImplementation = globalThis.fetch,
}: CreateApiClientOptions): ApiClient {
  const normalizedBaseUrl = normalizeBaseUrl(baseUrl);

  async function executeRequest(
    path: string,
    options: ApiRequestMethodOptions = {},
  ) {
    const method = options.method ?? "GET";
    validateInternalPath(path);

    const url = new URL(path, normalizedBaseUrl);

    if (url.origin !== normalizedBaseUrl.origin) {
      throw ApiError.protocol(method, path);
    }

    appendQuery(url, options.query);

    const hasJson = Object.prototype.hasOwnProperty.call(options, "json");
    const hasBody = Object.prototype.hasOwnProperty.call(options, "body");

    if ((hasJson && hasBody) || (method === "GET" && (hasJson || hasBody))) {
      throw ApiError.protocol(method, path);
    }

    const headers = new Headers(options.headers);
    headers.set("Accept", "application/json");

    let body: BodyInit | null | undefined;

    if (hasJson) {
      try {
        body = JSON.stringify(options.json);
      } catch {
        throw ApiError.protocol(method, path);
      }

      if (typeof body !== "string") {
        throw ApiError.protocol(method, path);
      }

      if (!isJsonContentType(headers.get("Content-Type"))) {
        headers.set("Content-Type", "application/json");
      }
    } else if (hasBody) {
      body = options.body;
    }

    const retryOnUnauthorized =
      options.retryOnUnauthorized ?? method === "GET";

    if (retryOnUnauthorized && !isReusableBody(body)) {
      throw ApiError.protocol(method, path);
    }

    async function execute(forceRefresh: boolean) {
      const token = await getAccessToken(
        forceRefresh ? { forceRefresh: true } : undefined,
      );

      if (!token) {
        throw ApiError.protocol(method, path);
      }

      const requestHeaders = new Headers(headers);
      requestHeaders.set("Authorization", `Bearer ${token}`);

      try {
        return await fetchImplementation(url, {
          method,
          headers: requestHeaders,
          body,
          signal: options.signal,
          credentials: "omit",
        });
      } catch (error) {
        if (isAbortError(error) || options.signal?.aborted) {
          throw error;
        }

        throw ApiError.network(method, path);
      }
    }

    let response = await execute(false);

    if (response.status === 401 && retryOnUnauthorized) {
      response = await execute(true);
    }

    return { method, response };
  }

  async function request<T>(
    path: string,
    options: ApiRequestMethodOptions = {},
  ): Promise<T> {
    const { method, response } = await executeRequest(path, options);
    return parseResponse<T>(response, method, path);
  }

  return {
    request,
    get: (path, options) => request(path, { ...options, method: "GET" }),
    getBinary: async (path, options) => {
      const { method, response } = await executeRequest(path, {
        ...options,
        method: "GET",
      });
      return parseBinaryResponse(response, method, path);
    },
    post: (path, options) => request(path, { ...options, method: "POST" }),
    put: (path, options) => request(path, { ...options, method: "PUT" }),
  };
}
