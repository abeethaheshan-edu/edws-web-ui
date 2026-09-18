import { Component, EventEmitter, Input, Output } from '@angular/core';
import { PageState } from '../../models/table.model';

type PageSlot = number | 'gap';

@Component({
  selector: 'app-pagination',
  standalone: false,
  templateUrl: './pagination.component.html',
  styleUrl: './pagination.component.scss',
})
export class PaginationComponent {
  @Input({ required: true }) state!: PageState;
  @Input() showSummary = true;

  @Output() pageChange = new EventEmitter<number>();

  protected get totalPages(): number {
    return Math.max(1, Math.ceil(this.state.totalItems / this.state.pageSize));
  }

  protected get rangeStart(): number {
    return this.state.totalItems === 0 ? 0 : (this.state.page - 1) * this.state.pageSize + 1;
  }

  protected get rangeEnd(): number {
    return Math.min(this.state.page * this.state.pageSize, this.state.totalItems);
  }

  protected get slots(): PageSlot[] {
    const total = this.totalPages;
    const current = this.state.page;

    if (total <= 5) {
      return Array.from({ length: total }, (_, index) => index + 1);
    }

    const wanted = [1, current - 1, current, current + 1, total]
      .filter((page) => page >= 1 && page <= total)
      .sort((a, b) => a - b);

    const slots: PageSlot[] = [];
    let previous = 0;

    for (const page of wanted) {
      if (page === previous) {
        continue;
      }
      if (previous && page - previous > 1) {
        slots.push('gap');
      }
      slots.push(page);
      previous = page;
    }

    return slots;
  }

  protected isGap(slot: PageSlot): boolean {
    return slot === 'gap';
  }

  protected goTo(page: number): void {
    if (page < 1 || page > this.totalPages || page === this.state.page) {
      return;
    }
    this.pageChange.emit(page);
  }
}
