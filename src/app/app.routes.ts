import { Routes } from '@angular/router';
import { AuthGuard } from './auth.guard';

export const routes: Routes = [
    {
        path: '',
        loadComponent: () =>
          import('./home/dashboard/dashboard.component').then((m) => m.DashboardComponent),
        canActivate: [AuthGuard]
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
    },
    {
        path: 'profile',
        loadComponent: () =>
          import('./home/profile/profile.component').then((m) => m.ProfileComponent),
        canActivate: [AuthGuard]
    },
    {
        path: 'orders',
        loadComponent: () =>
          import('./home/orders/orders.component').then((m) => m.OrdersComponent),
        canActivate: [AuthGuard]
    }
];
