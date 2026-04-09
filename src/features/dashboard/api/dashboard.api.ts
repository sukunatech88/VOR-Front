import { z } from "zod";

import { dashboardMock } from "../mocks/dashboard.mock";
import type { DashboardSummary } from "../types/dashboard.types";

const metricSchema = z.object({
  id: z.string(),
  label: z.string(),
  value: z.string(),
  trend: z.string().optional(),
  tone: z.enum(["default", "success", "warning", "danger"]).optional(),
});

const activitySchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string(),
  timestamp: z.string(),
  status: z.enum(["info", "success", "warning", "danger"]),
});

const quickLinkSchema = z.object({
  id: z.string(),
  label: z.string(),
  description: z.string(),
  to: z.string(),
});

const dashboardSummarySchema = z.object({
  metrics: z.array(metricSchema),
  activity: z.array(activitySchema),
  quickLinks: z.array(quickLinkSchema),
});

export async function getDashboardSummary(): Promise<DashboardSummary> {
  await new Promise((resolve) => setTimeout(resolve, 250));
  return dashboardSummarySchema.parse(dashboardMock);
}