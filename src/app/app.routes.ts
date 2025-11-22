import { Routes } from '@angular/router';
import { AuthGuard } from './auth.guard';
import { MessOwnerGuard } from './auth/mess-owner.guard';
import { messOwnerGuard } from './mess-owner.guard';
import { messExistsGuard } from './mess-exists.guard';

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
  },

  // Mess Owner Routes
  {
    path: 'mess-owner',
    children: [
      {
        path: 'login',
        loadComponent: () =>
          import('./auth/mess-owner/login/login.component').then((m) => m.MessOwnerLoginComponent),
      },
      {
        path: 'signup',
        loadComponent: () =>
          import('./auth/mess-owner/messsownersignup/messsownersignup.component').then((m) => m.MesssownersignupComponent),
      },
      {
        path: 'initial-setup',
        loadComponent: () =>
          import('./home/mess-owner-setup/components/mess-registration/mess-registration.component').then((m) =>
            m.MessRegistrationComponent),
      },
      {
        path: 'setup',
        loadComponent: () =>
          import('./home/mess-owner-setup/mess-owner-setup.component').then((m) => m.MessOwnerSetupComponent),
        canActivate: [MessOwnerGuard, messExistsGuard],
        // canActivate: [messOwnerGuard],
        children: [
          {
            path: '',
            redirectTo: 'my-thalis',
            pathMatch: 'full'
          },
          {
            path: 'add-thali',
            loadComponent: () =>
              import('./home/mess-owner-setup/components/add-thali/add-thali.component').then((m) => m.AddThaliComponent),
          },
          {
            path: 'view-intents',
            loadComponent: () =>
              import('./home/mess-owner-setup/components/view-intents/view-intents.component').then((m) => m.ViewIntentsComponent),
          },
          {
            path: 'my-thalis',
            loadComponent: () =>
              import('./home/mess-owner-setup/components/my-thalis/my-thalis.component').then((m) => m.MyThalisComponent),
          },
          {
            path: 'profile',
            loadComponent: () =>
              import('./home/mess-owner-setup/components/mess-onwer-user-profile/mess-onwer-user-profile.component').then((m) => m.MessOnwerUserProfileComponent),
          }
        ]
      }
    ]
  },
  {
    path: '**',
    redirectTo: '',
    pathMatch: 'full'
  },

];
