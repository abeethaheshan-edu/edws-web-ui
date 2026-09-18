import { Component, inject } from '@angular/core';
import { UiLoaderService } from './ui-loader.service';

@Component({
  selector: 'app-ui-loader',
  standalone: false,
  templateUrl: './ui-loader.component.html',
  styleUrl: './ui-loader.component.scss',
})
export class UiLoaderComponent {
  private readonly service = inject(UiLoaderService);

  protected readonly loader = this.service.loader;
}
