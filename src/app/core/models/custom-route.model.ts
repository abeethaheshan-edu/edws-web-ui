import { Route } from '@angular/router';

export type CustomRoutes = Array<CustomRoute>;

export interface CustomRoute extends Route {
  children?: CustomRoute[];
  data?: {
    animation?: string;
    accessControlElements?: string[];
    actions?: Array<'VIEW' | 'CREATE' | 'EDIT' | 'DELETE' | 'APPROVE'>;

    [key: string]: any;
  };
}
