import { Component, ElementRef, EventEmitter, forwardRef, Input, Output, ViewChild } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { NgbTypeahead } from '@ng-bootstrap/ng-bootstrap';
import { debounceTime, distinctUntilChanged, filter, map, merge, Observable, Subject } from 'rxjs';
import { SelectOption } from '../../models/user-role.model';

@Component({
  selector: 'app-search-select',
  standalone: false,
  templateUrl: './search-select.component.html',
  styleUrl: './search-select.component.scss',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => SearchSelectComponent),
      multi: true,
    },
  ],
})
export class SearchSelectComponent implements ControlValueAccessor {
  @Input() options: SelectOption[] = [];
  @Input() placeholder = 'Search or select';
  @Input() inputId = '';
  @Input() maxResults = 10;

  @Output() optionSelect = new EventEmitter<SelectOption | null>();

  @ViewChild('instance', { static: true }) private instance!: NgbTypeahead;
  @ViewChild('field', { static: true }) private field!: ElementRef<HTMLInputElement>;

  protected model = '';
  protected disabled = false;

  protected readonly focus$ = new Subject<string>();
  protected readonly click$ = new Subject<string>();

  private onChange: (value: string) => void = () => undefined;
  private onTouched: () => void = () => undefined;

  protected readonly search = (text$: Observable<string>): Observable<string[]> => {
    const typed$ = text$.pipe(debounceTime(150), distinctUntilChanged());
    const clicks$ = this.click$.pipe(filter(() => !this.instance.isPopupOpen()));

    return merge(typed$, clicks$, this.focus$).pipe(map((term) => this.matches(term)));
  };

  writeValue(value: string): void {
    this.model = value ?? '';
  }

  registerOnChange(fn: (value: string) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  protected onModelChange(value: string | null): void {
    this.model = value ?? '';
    this.onChange(this.model);
    this.optionSelect.emit(this.options.find((option) => option.label === this.model) ?? null);
  }

  protected onBlur(): void {
    this.onTouched();

    const typed = this.field.nativeElement.value.trim().toLowerCase();
    if (!typed || this.model) {
      return;
    }

    const exact = this.options.find((option) => option.label.toLowerCase() === typed);
    if (exact) {
      this.onModelChange(exact.label);
    }
  }

  protected openList(): void {
    if (this.disabled) {
      return;
    }
    this.field.nativeElement.focus();
    this.click$.next(this.field.nativeElement.value);
  }

  private matches(term: string): string[] {
    const labels = this.options.map((option) => option.label);
    const search = (term ?? '').trim().toLowerCase();

    const filtered = search ? labels.filter((label) => label.toLowerCase().includes(search)) : labels;
    return filtered.slice(0, this.maxResults);
  }
}
