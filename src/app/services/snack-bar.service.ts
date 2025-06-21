import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root'
})
export class SnackBarService {
  constructor(private snackBar: MatSnackBar) {}

  showSuccess(message: string = '✅ Operation successful!') {
    this.snackBar.open(message, 'Close', {
      duration: 3000,
      panelClass: ['snackbar-success']
    });
  }

  showError(message: string = '❌ Something went wrong.') {
    this.snackBar.open(message, 'Close', {
      duration: 3000,
      panelClass: ['snackbar-error']
    });
  }
}
