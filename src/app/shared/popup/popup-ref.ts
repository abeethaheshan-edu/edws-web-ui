import { NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { Observable, Subject } from 'rxjs';

export class PopupRef<TResult = unknown> {
  private modalRef?: NgbModalRef;
  private readonly closed = new Subject<TResult | undefined>();

  attach(modalRef: NgbModalRef): void {
    this.modalRef = modalRef;

    modalRef.result.then(
      (result: TResult) => this.emit(result),
      () => this.emit(undefined),
    );
  }

  close(result?: TResult): void {
    this.modalRef?.close(result as TResult);
  }

  dismiss(): void {
    this.modalRef?.dismiss();
  }

  afterClosed(): Observable<TResult | undefined> {
    return this.closed.asObservable();
  }

  private emit(result: TResult | undefined): void {
    this.closed.next(result);
    this.closed.complete();
  }
}
