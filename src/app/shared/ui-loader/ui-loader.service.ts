import { Injectable, signal } from '@angular/core';
import { finalize, MonoTypeOperatorFunction, Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class UiLoaderService {
  private pending = 0;

  private readonly state = signal<{ visible: boolean; message: string }>({ visible: false, message: '' });

  readonly loader = this.state.asReadonly();

  show(message = ''): void {
    this.pending++;
    this.state.set({ visible: true, message });
  }

  hide(): void {
    this.pending = Math.max(0, this.pending - 1);
    if (this.pending === 0) {
      this.state.set({ visible: false, message: '' });
    }
  }

  forceHide(): void {
    this.pending = 0;
    this.state.set({ visible: false, message: '' });
  }

  during<T>(message = ''): MonoTypeOperatorFunction<T> {
    return (source: Observable<T>) => {
      this.show(message);
      return source.pipe(finalize(() => this.hide()));
    };
  }
}
