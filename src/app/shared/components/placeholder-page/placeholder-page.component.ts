import { Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-placeholder-page',
  standalone: false,
  templateUrl: './placeholder-page.component.html',
  styleUrl: './placeholder-page.component.scss',
})
export class PlaceholderPageComponent {
  private readonly route = inject(ActivatedRoute);

  protected readonly title: string = this.route.snapshot.data['title'] ?? 'Coming soon';
  protected readonly icon: string = this.route.snapshot.data['icon'] ?? 'layers';
}
