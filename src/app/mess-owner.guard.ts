// auth.guard.ts
import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { AuthService } from './auth/services/auth-service/auth.service';

@Injectable({
  providedIn: 'root'
})
export class messOwnerGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): boolean {
    if (this.authService.isLoggedIn()) {
      if (this.authService.isMessOwner()) {
        // If mess owner tries to access root, redirect to their dashboard
        if (state.url === '/' || state.url === '') {
          this.router.navigate(['/mess-owner/setup/my-thalis']);
        } else {
          // Block mess owner from accessing user routes
          this.router.navigate(['/mess-owner/setup/my-thalis']);
        }
        return false;
      }
      return true;
    }

    this.router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
    return false;
  }
}
