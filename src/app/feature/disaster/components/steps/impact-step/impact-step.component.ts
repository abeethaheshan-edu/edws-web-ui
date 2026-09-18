import { Component, inject, OnInit } from '@angular/core';
import { AlertDraftStore } from '../../../services/alert-draft.store';

@Component({
  selector: 'app-impact-step',
  standalone: false,
  templateUrl: './impact-step.component.html',
  styleUrl: './impact-step.component.scss',
})
export class ImpactStepComponent implements OnInit {
  private readonly store = inject(AlertDraftStore);

  protected readonly form = this.store.form.controls.impact;
  protected readonly summary = this.store.areaSummary;

  ngOnInit(): void {
    this.applyEstimates(true);
  }

  protected applyEstimates(onlyPristine = false): void {
    const { estimatedPopulation, criticalInfrastructure } = this.summary();

    if (!this.summary().boundaryValidated) {
      return;
    }

    const population = this.form.controls.estimatedPopulation;
    const infrastructure = this.form.controls.criticalInfrastructure;

    if (!onlyPristine || (population.pristine && population.value === null)) {
      population.setValue(estimatedPopulation);
    }
    if (!onlyPristine || (infrastructure.pristine && infrastructure.value === null)) {
      infrastructure.setValue(criticalInfrastructure);
    }
  }
}
