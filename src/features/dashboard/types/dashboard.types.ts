export interface DashboardMetric {
  id: string;
  label: string;
  value: string;
  trend?: string;
  tone?: "default" | "success" | "warning" | "danger";
}

export interface DashboardActivityItem {
  id: string;
  title: string;
  description: string;
  timestamp: string;
  status: "info" | "success" | "warning" | "danger";
}

export interface DashboardQuickLink {
  id: string;
  label: string;
  description: string;
  to: string;
}

export interface DashboardSummary {
  metrics: DashboardMetric[];
  activity: DashboardActivityItem[];
  quickLinks: DashboardQuickLink[];
}