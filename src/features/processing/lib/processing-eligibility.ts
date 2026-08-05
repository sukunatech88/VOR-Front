import type {
  ProcessingEligibility,
  ProcessingMessageStatus,
  ProcessingMessageType,
} from "../types/processing.types";

const supportedMessageTypes = new Set<ProcessingMessageType>([
  "PAIN_001",
  "PAIN_002",
  "CAMT_053",
]);

export function getIdentifyEligibility(
  hasAssociatedMessage: boolean,
): ProcessingEligibility {
  return hasAssociatedMessage
    ? {
        allowed: false,
        reason: "This file already has an associated message.",
      }
    : { allowed: true };
}

export function getDispatchEligibility(input: {
  direction: "INBOUND" | "OUTBOUND";
  messageStatus?: ProcessingMessageStatus;
  messageType?: ProcessingMessageType;
}): ProcessingEligibility {
  if (input.direction !== "OUTBOUND") {
    return {
      allowed: false,
      reason: "Only OUTBOUND files can be dispatched.",
    };
  }

  if (!input.messageStatus || !input.messageType) {
    return {
      allowed: false,
      reason: "The file must have an associated message.",
    };
  }

  if (input.messageType !== "PAIN_001") {
    return {
      allowed: false,
      reason: "Dispatch currently supports only PAIN_001.",
    };
  }

  return input.messageStatus === "VALIDATED"
    ? { allowed: true }
    : {
        allowed: false,
        reason: "The associated message must be VALIDATED before dispatch.",
      };
}

function eligibilityForStatus(
  currentStatus: ProcessingMessageStatus,
  requiredStatus: ProcessingMessageStatus,
  messageType: ProcessingMessageType,
): ProcessingEligibility {
  if (!supportedMessageTypes.has(messageType)) {
    return {
      allowed: false,
      reason: "This message type is not supported by the operation.",
    };
  }

  return currentStatus === requiredStatus
    ? { allowed: true }
    : {
        allowed: false,
        reason: `The message must be ${requiredStatus} before this operation.`,
      };
}

export function getParseEligibility(
  status: ProcessingMessageStatus,
  type: ProcessingMessageType,
) {
  return eligibilityForStatus(status, "IDENTIFIED", type);
}

export function getNormalizeEligibility(
  status: ProcessingMessageStatus,
  type: ProcessingMessageType,
) {
  return eligibilityForStatus(status, "PARSED", type);
}

export function getValidateEligibility(
  status: ProcessingMessageStatus,
  type: ProcessingMessageType,
) {
  return eligibilityForStatus(status, "NORMALIZED", type);
}

export function getApplyStatusReportEligibility(
  status: ProcessingMessageStatus,
  type: ProcessingMessageType,
): ProcessingEligibility {
  if (type !== "PAIN_002") {
    return {
      allowed: false,
      reason: "Only PAIN_002 messages can apply a status report.",
    };
  }

  return status === "VALIDATED"
    ? { allowed: true }
    : {
        allowed: false,
        reason: "The PAIN_002 message must be VALIDATED first.",
      };
}
