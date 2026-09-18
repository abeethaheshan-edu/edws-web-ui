import { Component } from '@angular/core';
import { ACTIVITY_FEED, DASHBOARD_STATS, REGIONAL_RISK } from './data/dashboard-data';

@Component({
  selector: 'app-dashboard',
  standalone: false,
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
})
export class DashboardComponent {
  protected readonly stats = DASHBOARD_STATS;
  protected readonly riskLevels = REGIONAL_RISK;
  protected readonly activities = ACTIVITY_FEED;

  protected readonly coverage = { provinces: '09', districts: '25' };
  protected readonly lastSynced = '02 Mins Ago';

  protected onViewAll(): void {
    console.log('[Dashboard] view all activity');
  }
}
