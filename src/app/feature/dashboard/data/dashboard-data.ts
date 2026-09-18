import { ActivityItem, DashboardStat, RiskLevel } from '../../../shared/models/dashboard.model';

export const DASHBOARD_STATS: DashboardStat[] = [
  {
    key: 'active-disasters',
    label: 'Total Active Disasters',
    value: '12',
    icon: 'alert-triangle',
    tone: 'danger',
    chips: [
      { label: '4 Level 5', level: 5 },
      { label: '8 Level 3', level: 3 },
    ],
  },
  {
    key: 'pending-approvals',
    label: 'Pending Approvals',
    value: '07',
    icon: 'clipboard',
    tone: 'info',
    progress: { percentage: 65, label: '65% Processed' },
  },
];

export const REGIONAL_RISK: RiskLevel[] = [
  { label: 'High Risk (Southern)', tone: 'high' },
  { label: 'Moderate (Central)', tone: 'moderate' },
  { label: 'Stable (Northern)', tone: 'stable' },
];

export const ACTIVITY_FEED: ActivityItem[] = [
  {
    id: 'ACT-01',
    icon: 'shield-check',
    tone: 'primary',
    title: 'Southern Alert Approved',
    description: 'Admin [ID-455] verified the Level 4 flood warning for Galle district.',
    time: '12:45 PM',
    attachment: 'ALERT_SOUTHERN_FLOOD_V2.pdf',
  },
  {
    id: 'ACT-02',
    icon: 'file-text',
    tone: 'danger',
    title: 'Directive Published',
    description: 'New evacuation protocol published for Matara regional center.',
    time: '11:20 AM',
  },
  {
    id: 'ACT-03',
    icon: 'user-plus',
    tone: 'info',
    title: 'New District Admin',
    description: "User 'R. Perera' assigned to Kalutara District Response Unit.",
    time: '09:15 AM',
  },
  {
    id: 'ACT-04',
    icon: 'alert-triangle',
    tone: 'warning',
    title: 'System Latency Warning',
    description: 'Database mirroring delay detected in Eastern Province relay server.',
    time: '08:00 AM',
  },
];
