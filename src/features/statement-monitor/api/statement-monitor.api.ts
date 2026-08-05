import type { ApiClient } from "../../../core/http/api-client";
import { ApiError } from "../../../core/http/api-error";
import { statementDetailsSchema, statementEntryListSchema, statementListSchema } from "../schemas/statement-monitor.schemas";
import type { OperationsStatementDetails, OperationsStatementEntryList, OperationsStatementList, StatementEntryFilters, StatementFilters } from "../types/statement-monitor.types";

const path = "/api/operations/statements";

export async function getStatements(client: ApiClient, filters: StatementFilters, signal?: AbortSignal): Promise<OperationsStatementList> {
  const response = await client.get<unknown>(path, { signal, query: {
    search: filters.search, bankConnectionId: filters.bankConnectionId, currency: filters.currency,
    messageStatus: filters.messageStatus, validationStatus: filters.validationStatus,
    page: filters.page, size: filters.size, sort: `${filters.sortField},${filters.sortDirection}`,
  }});
  const parsed = statementListSchema.safeParse(response);
  if (!parsed.success) throw ApiError.protocol("GET", path);
  return parsed.data;
}

export async function getStatement(client: ApiClient, statementId: string, signal?: AbortSignal): Promise<OperationsStatementDetails> {
  const requestPath = `${path}/${statementId}`;
  const parsed = statementDetailsSchema.safeParse(await client.get<unknown>(requestPath, { signal }));
  if (!parsed.success) throw ApiError.protocol("GET", requestPath);
  return parsed.data;
}

export async function getStatementEntries(client: ApiClient, statementId: string, filters: StatementEntryFilters, signal?: AbortSignal): Promise<OperationsStatementEntryList> {
  const requestPath = `${path}/${statementId}/entries`;
  const response = await client.get<unknown>(requestPath, { signal, query: {
    creditDebitIndicator: filters.creditDebitIndicator, currency: filters.currency, status: filters.status,
    page: filters.page, size: filters.size, sort: `${filters.sortField},${filters.sortDirection}`,
  }});
  const parsed = statementEntryListSchema.safeParse(response);
  if (!parsed.success) throw ApiError.protocol("GET", requestPath);
  return parsed.data;
}
