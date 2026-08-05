import { z } from "zod";
import {
  entryFiltersSchema,
  statementDetailsSchema,
  statementEntryListSchema,
  statementFiltersSchema,
  statementListItemSchema,
  statementListSchema,
} from "../schemas/statement-monitor.schemas";

export type StatementFilters = z.infer<typeof statementFiltersSchema>;
export type StatementEntryFilters = z.infer<typeof entryFiltersSchema>;
export type OperationsStatementList = z.infer<typeof statementListSchema>;
export type OperationsStatementListItem = z.infer<typeof statementListItemSchema>;
export type OperationsStatementDetails = z.infer<typeof statementDetailsSchema>;
export type OperationsStatementEntryList = z.infer<typeof statementEntryListSchema>;
