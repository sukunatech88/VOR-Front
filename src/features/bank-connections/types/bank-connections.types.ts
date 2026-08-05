import { z } from "zod";
import { bankConnectionInputSchema, bankConnectionSchema, bankConnectionTestSchema } from "../schemas/bank-connections.schemas";
export type BankConnection = z.infer<typeof bankConnectionSchema>;
export type BankConnectionInput = z.infer<typeof bankConnectionInputSchema>;
export type BankConnectionTestResult = z.infer<typeof bankConnectionTestSchema>;
