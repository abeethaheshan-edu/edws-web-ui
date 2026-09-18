import { Component, Input } from '@angular/core';
import { TableColumn } from '../../models/table.model';

@Component({
  selector: 'app-data-table',
  standalone: false,
  templateUrl: './data-table.component.html',
  styleUrl: './data-table.component.scss',
})
export class DataTableComponent {
  @Input() columns: TableColumn[] = [];
  @Input() showHeader = false;
  @Input() loading = false;
  @Input() isEmpty = false;
  @Input() emptyTitle = 'No records found';
  @Input() emptyMessage = 'Try changing the filters and search again.';

  protected get gridTemplate(): string {
    return this.columns.map((column) => column.width ?? '1fr').join(' ');
  }
}
