import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { NgModule, provideBrowserGlobalErrorListeners } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { App } from './app';
import { AppRoutingModule } from './app-routing-module';
import { apiErrorInterceptor } from './core/interceptors/api-error.interceptor';
import { authTokenInterceptor } from './core/interceptors/auth-token.interceptor';
import { refreshTokenInterceptor } from './core/interceptors/refresh-token.interceptor';
import { LayoutModule } from './core/layout/layout-module';
import { SharedModule } from './shared/shared-module';

@NgModule({
  declarations: [App],
  imports: [BrowserModule, AppRoutingModule, SharedModule, LayoutModule],
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideHttpClient(
      withInterceptors([apiErrorInterceptor, authTokenInterceptor, refreshTokenInterceptor]),
    ),
  ],
  bootstrap: [App],
})
export class AppModule {}
