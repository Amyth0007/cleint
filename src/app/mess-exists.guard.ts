import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { MessService } from './services/mess.service';
import { SnackBarService } from './services/snack-bar.service';
import { catchError, map, of, tap } from 'rxjs';

export const messExistsGuard: CanActivateFn = () => {
  const messService = inject(MessService);
  const router = inject(Router);
  const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
  const userId = currentUser.id || currentUser.userId;
  const snackbar = inject(SnackBarService);

  if (!userId) {
    snackbar.showError('Please login to continue');
    router.navigate(['/login']);
    return of(false);
  }

  return messService.checkMessExists(userId).pipe(
    tap(res => {
      if (!res.exists) {
        // mess doesn't exist -> show snackbar
        snackbar.showError('You don\'t have a mess. Please create one.');
      }
    }),
    // return true when exists, false when not
    map(res => res.exists ? true : router.parseUrl('/mess-owner/initial-setup')),
    // map(res => res.exists ? true : router.parseUrl('/page-not-found')),
    // on error -> block and notify
    catchError(err => {
      snackbar.showError('Error checking mess exists');
      return of(false);
    })
  );

};
