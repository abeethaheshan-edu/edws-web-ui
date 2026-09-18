import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { WizardAction } from '../../../../shared/models/wizard.model';
import { PopupService } from '../../../../shared/popup/popup.service';
import { ToastService } from '../../../../shared/services/toast.service';
import { ALERT_WIZARD_STEPS } from '../../models/alert-wizard-steps';
import { AlertStatus, DisasterAlert } from '../../models/disaster-alert.model';
import { AlertDraftStore } from '../../services/alert-draft.store';
import { AlertStore } from '../../services/alert-store.service';
import { ApiError } from '../../../../core/net/api-error.model';
import { UiLoaderService } from '../../../../shared/ui-loader/ui-loader.service';

@Component({
  selector: 'app-alert-wizard',
  standalone: false,
  templateUrl: './alert-wizard.component.html',
  styleUrl: './alert-wizard.component.scss',
  providers: [AlertDraftStore],
})
export class AlertWizardComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly alerts = inject(AlertStore);
  private readonly popup = inject(PopupService);
  private readonly toast = inject(ToastService);
  private readonly loader = inject(UiLoaderService);
  protected readonly draft = inject(AlertDraftStore);

  protected readonly steps = ALERT_WIZARD_STEPS;
  protected readonly stepIndex = signal(0);
  protected readonly completedIndexes = signal<number[]>([]);

  private editing: DisasterAlert | null = null;

  protected readonly currentStep = computed(() => this.steps[this.stepIndex()]);

  protected readonly actions = computed<WizardAction[]>(() => {
    const isLast = this.stepIndex() === this.steps.length - 1;
    const list: WizardAction[] = [];

    if (this.stepIndex() > 0) {
      list.push({ id: 'back', label: 'Back', variant: 'outline', icon: 'arrow-left' });
    }

    list.push({ id: 'cancel', label: 'Cancel', variant: 'outline' });
    list.push({ id: 'draft', label: 'Save as Draft', variant: 'secondary' });
    list.push(
      isLast
        ? { id: 'submit', label: 'Submit for Approval', variant: 'primary' }
        : { id: 'next', label: 'Next', variant: 'primary' },
    );

    return list;
  });

  private readonly handlers: Record<string, () => void> = {
    back: () => this.goBack(),
    next: () => this.goNext(),
    cancel: () => this.cancel(),
    draft: () => this.save(AlertStatus.Draft),
    submit: () => this.submit(),
  };

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) {
      return;
    }

    this.loader.show('Loading alert...');

    this.alerts.getById(id).subscribe({
      next: (alert) => {
        this.loader.hide();
        this.editing = alert;
        this.draft.loadFrom(alert);
        this.completedIndexes.set(this.steps.map((_, index) => index));
      },
      error: (error: ApiError) => {
        this.loader.hide();
        this.toast.error('Alert not found', error?.message ?? `No alert matches ${id}.`);
        void this.router.navigateByUrl('/disasters');
      },
    });
  }

  protected get isEditing(): boolean {
    return this.editing !== null;
  }

  protected get title(): string {
    return this.isEditing ? 'Edit Alert' : 'New Alert';
  }

  protected get subtitle(): string {
    return this.editing ? this.editing.referenceCode : 'Disaster alert creation';
  }

  protected onAction(id: string): void {
    this.handlers[id]?.();
  }

  protected goToStep(target: number): void {
    if (target < this.stepIndex()) {
      this.stepIndex.set(target);
      return;
    }

    for (let index = this.stepIndex(); index < target; index++) {
      if (!this.validateStep(index)) {
        this.stepIndex.set(index);
        return;
      }
      this.markCompleted(index);
    }

    this.stepIndex.set(target);
  }

  private goBack(): void {
    this.stepIndex.update((index) => Math.max(0, index - 1));
  }

  private goNext(): void {
    if (!this.validateStep(this.stepIndex())) {
      return;
    }
    this.markCompleted(this.stepIndex());
    this.stepIndex.update((index) => Math.min(this.steps.length - 1, index + 1));
  }

  private cancel(): void {
    if (!this.draft.form.dirty) {
      this.leave();
      return;
    }

    this.popup
      .confirm({
        title: 'Discard this alert?',
        message: 'Everything entered so far will be lost.',
        confirmText: 'Discard',
        variant: 'danger',
      })
      .subscribe((confirmed) => {
        if (confirmed) {
          this.leave();
        }
      });
  }

  private leave(): void {
    console.log('[AlertWizard] cancelled');
    void this.router.navigateByUrl('/disasters');
  }

  private save(status: AlertStatus): void {
    const draft = this.draft.toDraft();
    console.log(`[AlertWizard] saving as ${status}`, draft);

    this.loader.show(status === AlertStatus.Draft ? 'Saving draft...' : 'Submitting alert...');

    const request$ = this.editing
      ? this.alerts.update(this.editing.id, draft, status)
      : this.alerts.create(draft, status);

    request$.subscribe({
      next: (saved) => {
        this.loader.hide();
        this.toast.success(
          status === AlertStatus.Draft ? 'Draft saved' : 'Alert submitted',
          `${saved.referenceCode} is now ${status === AlertStatus.Draft ? 'a draft' : 'awaiting approval'}.`,
        );
        void this.router.navigateByUrl('/disasters');
      },
      error: (error: ApiError) => {
        this.loader.hide();
        this.toast.error('Could not save the alert', error?.message ?? 'Please try again.');
      },
    });
  }

  private submit(): void {
    const firstInvalid = this.steps.findIndex((_, index) => !this.isStepValid(index));

    if (firstInvalid !== -1) {
      this.stepIndex.set(firstInvalid);
      this.validateStep(firstInvalid);
      return;
    }

    this.save(AlertStatus.PendingReview);
  }

  private validateStep(index: number): boolean {
    const group = this.draft.groupFor(this.steps[index].id);
    if (!group || group.valid) {
      return true;
    }

    group.markAllAsTouched();
    this.toast.warning(
      `${this.steps[index].label} is incomplete`,
      'Fill in the highlighted fields before continuing.',
    );
    return false;
  }

  private isStepValid(index: number): boolean {
    const group = this.draft.groupFor(this.steps[index].id);
    return !group || group.valid;
  }

  private markCompleted(index: number): void {
    this.completedIndexes.update((list) => (list.includes(index) ? list : [...list, index]));
  }
}
