import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CustomSnackbarComponent } from '../home/shared/custom-snackbar/custom-snackbar.component';

@Injectable({
  providedIn: 'root'
})
export class SnackBarService {
constructor(private snackBar: MatSnackBar) {}

  showSuccess(message: string) {
    this.openSnack(message, 'success', 'check_circle');
  }

  showError(message: string) {
    this.openSnack(message, 'error', 'error');
  }

  showInfo(message: string) {
    this.openSnack(message, 'info', 'info');
  }

  showWarning(message: string) {
    this.openSnack(message, 'warning', 'warning');
  }

  private openSnack(message: string, type: any, icon: string) {
    this.snackBar.openFromComponent(CustomSnackbarComponent, {
      data: { message, type, icon },
      duration: 3500,
      horizontalPosition: 'right',
      verticalPosition: 'bottom',
      panelClass: ['snackbar-panel']
    });
  }
}
