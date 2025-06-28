import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from './services/auth-service/auth.service';

export const MessOwnerGuard = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isMessOwner()) {
    return true;
  }

  // Redirect to login page
  return router.parseUrl('/login');
}; 