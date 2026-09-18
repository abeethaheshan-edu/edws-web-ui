import { Component, EventEmitter, Input, Output } from '@angular/core';
import { TableColumn } from '../../models/table.model';

@Component({
  selector: 'app-data-table-row',
  standalone: false,
  templateUrl: './data-table-row.component.html',
  styleUrl: './data-table-row.component.scss',
})
export class DataTableRowComponent {
  @Input() columns: TableColumn[] = [];
  @Input() clickable = false;
  @Input() active = false;

  @Output() rowClick = new EventEmitter<void>();

  protected get gridTemplate(): string {
    return this.columns.map((column) => column.width ?? '1fr').join(' ');
  }

  protected onClick(): void {
    if (this.clickable) {
      this.rowClick.emit();
    }
  }
}
