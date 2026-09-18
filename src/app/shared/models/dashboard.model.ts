export interface DashboardStat {
  key: string;
  label: string;
  value: string;
  icon: string;
  tone: 'danger' | 'info';

  chips?: Array<{ label: string; level: number }>;

  progress?: { percentage: number; label: string };
}

export interface RiskLevel {
  label: string;
  tone: 'high' | 'moderate' | 'stable';
}

export interface ActivityItem {
  id: string;
  icon: string;
  tone: 'primary' | 'danger' | 'warning' | 'info';
  title: string;
  description: string;
  time: string;
  attachment?: string;
}
