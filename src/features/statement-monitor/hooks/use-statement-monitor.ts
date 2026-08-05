import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { useApiClient } from "../../../core/http/api-client-context";
import type { ApiError } from "../../../core/http/api-error";
import { getStatement, getStatementEntries, getStatements } from "../api/statement-monitor.api";
import { statementIdSchema } from "../schemas/statement-monitor.schemas";
import type { OperationsStatementDetails, OperationsStatementEntryList, OperationsStatementList, StatementEntryFilters, StatementFilters } from "../types/statement-monitor.types";

export function useStatements(filters: StatementFilters) {
  const client = useApiClient();
  return useQuery<OperationsStatementList, ApiError>({
    queryKey: ["statement-monitor", "list", filters],
    queryFn: ({ signal }) => getStatements(client, filters, signal),
    placeholderData: keepPreviousData,
  });
}

export function useStatement(statementId: string) {
  const client = useApiClient();
  return useQuery<OperationsStatementDetails, ApiError>({
    queryKey: ["statement-monitor", "detail", statementId],
    queryFn: ({ signal }) => getStatement(client, statementId, signal),
    enabled: statementIdSchema.safeParse(statementId).success,
  });
}

export function useStatementEntries(statementId: string, filters: StatementEntryFilters) {
  const client = useApiClient();
  return useQuery<OperationsStatementEntryList, ApiError>({
    queryKey: ["statement-monitor", "entries", statementId, filters],
    queryFn: ({ signal }) => getStatementEntries(client, statementId, filters, signal),
    enabled: statementIdSchema.safeParse(statementId).success,
    placeholderData: keepPreviousData,
  });
}
