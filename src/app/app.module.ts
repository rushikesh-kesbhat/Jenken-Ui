import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { AuthService } from './services/auth.service';
import { AuthGuardService } from './services/auth-guard.service';
import { HTTP_INTERCEPTORS, provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { MockBackendInterceptor } from './services/mock';


@NgModule({
  declarations: [],
  imports: [
    BrowserModule,
    FormsModule,
    RouterModule
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: MockBackendInterceptor,
      multi: true
    },
    AuthService,
    AuthGuardService,
  ]
})
export class AppModule {}
