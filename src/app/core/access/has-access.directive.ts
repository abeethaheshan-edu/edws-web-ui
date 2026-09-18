import {
  Directive,
  effect,
  inject,
  Input,
  TemplateRef,
  ViewContainerRef,
} from '@angular/core';
import { AccessAction } from './access-policy.model';
import { PermissionService } from './permission.service';

@Directive({
  selector: '[hasAccess]',
  standalone: false,
})
export class HasAccessDirective {
  private readonly permissions = inject(PermissionService);
  private readonly template = inject(TemplateRef<unknown>);
  private readonly container = inject(ViewContainerRef);

  private elements: string[] = [];
  private requiredAction: AccessAction = 'VIEW';
  private rendered = false;

  constructor() {
    effect(() => {
      this.permissions.policy();
      this.update();
    });
  }

  @Input() set hasAccess(value: string | string[]) {
    this.elements = Array.isArray(value) ? value : [value];
    this.update();
  }

  @Input('hasAccessAction') set action(value: AccessAction) {
    this.requiredAction = value;
    this.update();
  }

  private update(): void {
    const granted = this.elements.length ? this.permissions.canAny(this.elements, this.requiredAction) : true;

    if (granted && !this.rendered) {
      this.container.createEmbeddedView(this.template);
      this.rendered = true;
    } else if (!granted && this.rendered) {
      this.container.clear();
      this.rendered = false;
    }
  }
}
