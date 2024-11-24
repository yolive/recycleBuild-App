import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';
import { provideHttpClient } from '@angular/common/http';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { appRouterProviders } from './app/app.routes';

bootstrapApplication(AppComponent,{
  ...appConfig,
  providers:[
    provideHttpClient(), provideAnimationsAsync('noop'),
    appRouterProviders,
  ]
  }).catch((err) => console.error(err));
