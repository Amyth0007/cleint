import { Routes } from '@angular/router';
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home/home.component';
import { SignupComponent } from './auth/signup/signup.component';
import { LoginComponent } from './auth/login/login.component';

export const routes: Routes = [
    {path: '', pathMatch: 'full', redirectTo: '/home'},
    {
        path: 'home',
        loadComponent: () =>
          import('./home/home/home.component').then((m) => m.HomeComponent),
      },
    {
        path: 'signup',
        loadComponent: () =>
          import('./auth/signup/signup.component').then((m) => m.SignupComponent),
      },
    {
        path: 'login',
        loadComponent: () =>
          import('./auth/login/login.component').then((m) => m.LoginComponent),
      },
      {
        path: 'forgotPassword',
        loadComponent: () =>
          import('./auth/forgot-password/forgot-password.component').then((m) => m.ForgotPasswordComponent),
      },
      {
        path: 'sendOTP',
        loadComponent: () =>
          import('./auth/enter-otp/enter-otp.component').then((m) => m.EnterOtpComponent),
      }
];
