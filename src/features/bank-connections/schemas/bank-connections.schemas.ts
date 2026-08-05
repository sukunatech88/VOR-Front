import { z } from "zod";

export const bankConnectionIdSchema = z.guid();
const dateTime = z.iso.datetime({ offset: true });
export const bankConnectionProfileSchema = z.object({
  host: z.string(), port: z.number().int(), username: z.string(),
  authenticationType: z.enum(["PASSWORD", "PRIVATE_KEY"]),
  credentialConfigured: z.boolean(), knownHostsConfigured: z.boolean(),
  inboundSourceName: z.string(), inboundRemoteDirectory: z.string(),
  inboundProcessedPath: z.string(), inboundFailedPath: z.string(), inboundSkippedPath: z.string(),
  outboundRemoteDirectory: z.string(), inboundMaxFileSizeBytes: z.number().int(),
  outboundMaxFileSizeBytes: z.number().int(), connectTimeoutMs: z.number().int(),
  authenticationTimeoutMs: z.number().int(), operationTimeoutMs: z.number().int(),
});
export const bankConnectionSchema = z.object({
  bankConnectionId: bankConnectionIdSchema, organizationId: bankConnectionIdSchema,
  code: z.string(), bankName: z.string(), displayName: z.string(), status: z.enum(["ACTIVE", "INACTIVE"]),
  sftpProfile: bankConnectionProfileSchema.nullable(), createdAt: dateTime, updatedAt: dateTime,
});
export const bankConnectionListSchema = z.array(bankConnectionSchema);
export const bankConnectionTestSchema = z.object({
  bankConnectionId: bankConnectionIdSchema, organizationId: bankConnectionIdSchema,
  outcome: z.enum(["SUCCESS", "FAILED"]), connectionEstablished: z.boolean(),
  inboundDirectoryAccessible: z.boolean(), outboundDirectoryAccessible: z.boolean(),
  errorCode: z.string().nullable(), message: z.string(), testedAt: dateTime,
});
export const bankConnectionInputSchema = z.object({
  code: z.string().trim().regex(/^[A-Z0-9][A-Z0-9_-]{2,99}$/),
  bankName: z.string().trim().min(1).max(255), displayName: z.string().trim().min(1).max(255),
  sftpProfile: z.object({
    host: z.string().trim().min(1).max(255), port: z.number().int().min(1).max(65535),
    username: z.string().trim().min(1).max(255), authenticationType: z.enum(["PASSWORD", "PRIVATE_KEY"]),
    credentialReference: z.string().trim().max(512).optional(), knownHostsReference: z.string().trim().max(512).optional(),
    inboundSourceName: z.string().trim().min(1).max(255), inboundRemoteDirectory: z.string().trim().startsWith("/"),
    inboundProcessedPath: z.string().trim().min(1), inboundFailedPath: z.string().trim().min(1), inboundSkippedPath: z.string().trim().min(1),
    outboundRemoteDirectory: z.string().trim().startsWith("/"), inboundMaxFileSizeBytes: z.number().int().positive(),
    outboundMaxFileSizeBytes: z.number().int().positive(), connectTimeoutMs: z.number().int().min(1).max(300000),
    authenticationTimeoutMs: z.number().int().min(1).max(300000), operationTimeoutMs: z.number().int().min(1).max(300000),
  }),
});
