import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-avatar',
  standalone: false,
  templateUrl: './avatar.component.html',
  styleUrl: './avatar.component.scss',
})
export class AvatarComponent {
  @Input() name = '';
  @Input() size = 40;

  protected get initials(): string {
    const parts = this.name.trim().split(/\s+/).filter(Boolean);
    if (!parts.length) {
      return '–';
    }
    const first = parts[0][0];
    const last = parts.length > 1 ? parts[parts.length - 1][0] : '';
    return (first + last).toUpperCase();
  }
}
