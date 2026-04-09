import type { DashboardSummary } from "../types/dashboard.types";

export const dashboardMock: DashboardSummary = {
  metrics: [
    {
      id: "files-processed",
      label: "Files processed today",
      value: "128",
      trend: "+12 vs yesterday",
      tone: "success",
    },
    {
      id: "pending-validations",
      label: "Pending validations",
      value: "12",
      trend: "3 require attention",
      tone: "warning",
    },
    {
      id: "exceptions",
      label: "Operational exceptions",
      value: "4",
      trend: "1 critical",
      tone: "danger",
    },
    {
      id: "successful-identifications",
      label: "Successful identifications",
      value: "96.8%",
      trend: "Stable",
      tone: "default",
    },
  ],
  activity: [
    {
      id: "act-1",
      title: "Pain.001 identified successfully",
      description: "File f-1001 was classified as PAIN_001 for OpCo Colombia.",
      timestamp: "2026-04-08T10:12:00Z",
      status: "success",
    },
    {
      id: "act-2",
      title: "Unsupported file detected",
      description: "File f-1004 could not be mapped to a supported Phase 1 message.",
      timestamp: "2026-04-08T09:20:08Z",
      status: "danger",
    },
    {
      id: "act-3",
      title: "Outbound batch failed",
      description: "Outbound payment batch f-1005 failed in downstream processing.",
      timestamp: "2026-04-08T10:00:12Z",
      status: "warning",
    },
    {
      id: "act-4",
      title: "Statement file stored",
      description: "Statement file f-1003 was persisted successfully in custody storage.",
      timestamp: "2026-04-08T09:05:05Z",
      status: "info",
    },
  ],
  quickLinks: [
    {
      id: "ql-1",
      label: "Open File Registry",
      description: "Inspect received files, statuses and custody metadata.",
      to: "/file-registry",
    },
    {
      id: "ql-2",
      label: "Go to Message Hub",
      description: "Continue with traceability and message lifecycle monitoring.",
      to: "/message-hub",
    },
    {
      id: "ql-3",
      label: "Review User Administration",
      description: "Manage users, roles, profiles and access flows.",
      to: "/user-administration",
    },
  ],
};