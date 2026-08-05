import { z } from "zod";

import {
  operationsPaymentInstructionDetailsSchema,
  operationsPaymentInstructionListItemSchema,
  operationsPaymentInstructionListSchema,
  paymentApplicationItemSchema,
  paymentApplicationSchema,
  paymentApplicationStatusSchema,
  paymentBankConnectionSchema,
  paymentInstructionStatusSchema,
  paymentMonitorFiltersSchema,
  paymentMonitorSortDirectionSchema,
  paymentMonitorSortFieldSchema,
  paymentMonitorTransactionSchema,
  paymentStatusReportSchema,
  paymentTimelineSchema,
  paymentTransactionStatusSchema,
  paymentTransferTraceSchema,
  paymentValidationResultSchema,
} from "../schemas/payment-monitor.schemas";

export type PaymentInstructionStatus = z.infer<
  typeof paymentInstructionStatusSchema
>;
export type PaymentTransactionStatus = z.infer<
  typeof paymentTransactionStatusSchema
>;
export type PaymentApplicationStatus = z.infer<
  typeof paymentApplicationStatusSchema
>;
export type PaymentMonitorSortField = z.infer<
  typeof paymentMonitorSortFieldSchema
>;
export type PaymentMonitorSortDirection = z.infer<
  typeof paymentMonitorSortDirectionSchema
>;
export type PaymentMonitorFilters = z.infer<typeof paymentMonitorFiltersSchema>;
export type OperationsPaymentBankConnectionView = z.infer<
  typeof paymentBankConnectionSchema
>;
export type OperationsPaymentInstructionListItem = z.infer<
  typeof operationsPaymentInstructionListItemSchema
>;
export type OperationsPaymentInstructionList = z.infer<
  typeof operationsPaymentInstructionListSchema
>;
export type OperationsPaymentMonitorTransactionView = z.infer<
  typeof paymentMonitorTransactionSchema
>;
export type OperationsPaymentStatusReportApplicationItemView = z.infer<
  typeof paymentApplicationItemSchema
>;
export type OperationsPaymentStatusReportApplicationView = z.infer<
  typeof paymentApplicationSchema
>;
export type OperationsPaymentInstructionStatusReportView = z.infer<
  typeof paymentStatusReportSchema
>;
export type OperationsPaymentValidationResultView = z.infer<
  typeof paymentValidationResultSchema
>;
export type OperationsPaymentTimeline = z.infer<typeof paymentTimelineSchema>;
export type OperationsPaymentTransferTraceView = z.infer<
  typeof paymentTransferTraceSchema
>;
export type OperationsPaymentInstructionDetails = z.infer<
  typeof operationsPaymentInstructionDetailsSchema
>;
