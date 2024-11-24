import { provideRouter, Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { RegistrarComponent } from './components/registrar/registrar.component';
import { ProfileComponent } from './components/profile/profile.component';

export const routes: Routes = [
  { path: '', component: LoginComponent },
  { path: 'registrar', component: RegistrarComponent },
  { path: 'profile', component: ProfileComponent },
];

export const appRouterProviders = [provideRouter(routes)];