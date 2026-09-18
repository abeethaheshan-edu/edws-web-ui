import { Component, EventEmitter, Input, Output, signal } from '@angular/core';
import { FileAttachment, formatFileSize } from '../../models/file-attachment.model';

@Component({
  selector: 'app-file-drop',
  standalone: false,
  templateUrl: './file-drop.component.html',
  styleUrl: './file-drop.component.scss',
})
export class FileDropComponent {
  @Input() files: FileAttachment[] = [];

  @Input() accept = 'image/png,image/jpeg,application/pdf';
  @Input() maxSizeMb = 25;
  @Input() hint = 'MAX FILE SIZE: 25MB (PNG, JPG, PDF)';
  @Input() disabled = false;

  @Output() filesChange = new EventEmitter<FileAttachment[]>();

  protected readonly dragging = signal(false);
  protected readonly error = signal('');
  protected readonly formatFileSize = formatFileSize;

  protected onDragOver(event: DragEvent): void {
    if (this.disabled) {
      return;
    }
    event.preventDefault();
    this.dragging.set(true);
  }

  protected onDragLeave(): void {
    this.dragging.set(false);
  }

  protected onDrop(event: DragEvent): void {
    if (this.disabled) {
      return;
    }
    event.preventDefault();
    this.dragging.set(false);
    this.addFiles(event.dataTransfer?.files ?? null);
  }

  protected onBrowse(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.addFiles(input.files);

    input.value = '';
  }

  protected remove(id: string): void {
    this.filesChange.emit(this.files.filter((file) => file.id !== id));
  }

  private addFiles(list: FileList | null): void {
    if (!list?.length) {
      return;
    }

    const accepted: FileAttachment[] = [];
    const rejected: string[] = [];

    for (const file of Array.from(list)) {
      if (!this.isTypeAllowed(file)) {
        rejected.push(`${file.name} is not a supported format`);
        continue;
      }
      if (file.size > this.maxSizeMb * 1_048_576) {
        rejected.push(`${file.name} is larger than ${this.maxSizeMb}MB`);
        continue;
      }
      accepted.push({
        id: `${file.name}-${file.size}-${Date.now()}`,
        name: file.name,
        size: file.size,
        type: file.type,
      });
    }

    this.error.set(rejected.join(', '));

    if (accepted.length) {
      this.filesChange.emit([...this.files, ...accepted]);
    }
  }

  private isTypeAllowed(file: File): boolean {
    const allowed = this.accept.split(',').map((type) => type.trim());
    return allowed.some((type) => (type.endsWith('/*') ? file.type.startsWith(type.slice(0, -1)) : file.type === type));
  }
}
