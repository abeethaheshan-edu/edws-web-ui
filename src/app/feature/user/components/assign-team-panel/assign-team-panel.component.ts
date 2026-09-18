import { Component, inject, Input, OnInit } from '@angular/core';
import { NgbActiveOffcanvas } from '@ng-bootstrap/ng-bootstrap';
import { AdminTeam, SystemUser } from '../../../../shared/models/user.model';

@Component({
  selector: 'app-assign-team-panel',
  standalone: false,
  templateUrl: './assign-team-panel.component.html',
  styleUrl: './assign-team-panel.component.scss',
})
export class AssignTeamPanelComponent implements OnInit {
  protected readonly offcanvas = inject(NgbActiveOffcanvas);

  @Input({ required: true }) admin!: SystemUser;
  @Input() reviewers: SystemUser[] = [];
  @Input() drawers: SystemUser[] = [];

  protected selectedReviewerIds = new Set<string>();
  protected selectedDrawerIds = new Set<string>();

  ngOnInit(): void {
    this.reviewers
      .filter((user) => user.reportsToAdminId === this.admin.id)
      .forEach((user) => this.selectedReviewerIds.add(user.id));

    this.drawers
      .filter((user) => user.reportsToAdminId === this.admin.id)
      .forEach((user) => this.selectedDrawerIds.add(user.id));
  }

  protected isSelected(group: 'reviewer' | 'drawer', id: string): boolean {
    return this.bucket(group).has(id);
  }

  protected toggle(group: 'reviewer' | 'drawer', id: string): void {
    const bucket = this.bucket(group);
    if (bucket.has(id)) {
      bucket.delete(id);
    } else {
      bucket.add(id);
    }
  }

  private bucket(group: 'reviewer' | 'drawer'): Set<string> {
    return group === 'reviewer' ? this.selectedReviewerIds : this.selectedDrawerIds;
  }

  protected assignedElsewhere(user: SystemUser): boolean {
    return !!user.reportsToAdminId && user.reportsToAdminId !== this.admin.id;
  }

  protected onSubmit(): void {
    const team: AdminTeam = {
      adminId: this.admin.id,
      reviewerIds: [...this.selectedReviewerIds],
      drawerIds: [...this.selectedDrawerIds],
    };

    console.log('[AssignTeamPanel] submit', team);
    this.offcanvas.close(team);
  }
}
