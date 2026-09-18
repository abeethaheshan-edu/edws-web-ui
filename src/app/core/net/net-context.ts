import { HttpContext, HttpContextToken } from '@angular/common/http';

export const SKIP_AUTH = new HttpContextToken<boolean>(() => false);

export function skipAuthContext(): HttpContext {
  return new HttpContext().set(SKIP_AUTH, true);
}
