import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { NgbOffcanvas } from '@ng-bootstrap/ng-bootstrap';

import { ApiError } from '../../../../core/net/api-error.model';
import { CitizenService } from '../../../../services/citizen.service';
import { DEFAULT_PAGE_SIZE, PageState, TableColumn } from '../../../../shared/models/table.model';
import { ToastService } from '../../../../shared/services/toast.service';
import { UiLoaderService } from '../../../../shared/ui-loader/ui-loader.service';
import { CitizenFormValue, CitizenSummary } from '../../models/citizen.model';
import { CitizenFormPanelComponent } from '../citizen-form-panel/citizen-form-panel.component';

@Component({
  selector: 'app-citizen-list',
  standalone: false,
  templateUrl: './citizen-list.component.html',
  styleUrl: './citizen-list.component.scss',
})
export class CitizenListComponent implements OnInit {
  private readonly citizens = inject(CitizenService);
  private readonly offcanvas = inject(NgbOffcanvas);
  private readonly toast = inject(ToastService);
  private readonly loader = inject(UiLoaderService);

  protected readonly columns: TableColumn[] = [
    { key: 'citizen', header: 'Householder', width: 'minmax(12rem, 2fr)' },
    { key: 'nic', header: 'NIC', width: 'minmax(8rem, 1fr)' },
    { key: 'contact', header: 'Contact', width: 'minmax(9rem, 1.2fr)' },
    { key: 'town', header: 'Town', width: 'minmax(7rem, 1fr)' },
    { key: 'household', header: 'Household', width: 'minmax(7rem, 1fr)' },
  ];

  protected readonly items = signal<CitizenSummary[]>([]);
  protected readonly total = signal(0);
  protected readonly loading = signal(false);
  protected readonly search = signal('');
  protected readonly page = signal(1);

  protected readonly pageState = computed<PageState>(() => ({
    page: this.page(),
    pageSize: DEFAULT_PAGE_SIZE,
    totalItems: this.total(),
  }));

  ngOnInit(): void {
    this.fetch();
  }

  protected onSearch(value: string): void {
    this.search.set(value);
    this.page.set(1);
    this.fetch();
  }

  protected onPageChange(page: number): void {
    this.page.set(page);
    this.fetch();
  }

  protected async openRegister(): Promise<void> {
    const panel = this.offcanvas.open(CitizenFormPanelComponent, {
      position: 'end',
      panelClass: 'side-panel-offcanvas',
      backdrop: true,
      scroll: false,
    });

    const value: CitizenFormValue | undefined = await panel.result.catch(() => undefined);
    if (!value) {
      return;
    }

    this.loader.show('Registering citizen...');

    this.citizens.register(value).subscribe({
      next: (citizen) => {
        this.loader.hide();
        console.log('[CitizenList] registered', citizen);
        this.toast.success('Citizen registered', `${citizen.fullName || value.fullName} was added to the registry.`);
        this.page.set(1);
        this.fetch();
      },
      error: (error: ApiError) => {
        this.loader.hide();
        this.toast.error('Registration failed', error?.message ?? 'Please check the details and try again.');
      },
    });
  }

  private fetch(): void {
    this.loading.set(true);

    this.citizens
      .findAll({ search: this.search(), page: this.page(), pageSize: DEFAULT_PAGE_SIZE })
      .subscribe({
        next: (result) => {
          this.items.set(result.items);
          this.total.set(result.totalItems);
          this.loading.set(false);
        },
        error: (error: ApiError) => {
          this.loading.set(false);
          this.toast.error('Could not load the registry', error?.message ?? 'Please try again.');
        },
      });
  }
}
