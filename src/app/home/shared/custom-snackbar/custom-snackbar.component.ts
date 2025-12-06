import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MAT_SNACK_BAR_DATA, MatSnackBarRef } from '@angular/material/snack-bar';

export interface SnackBarData {
  message: string;
  type: 'success' | 'error' | 'info' | 'warning';
  icon: string;
}

@Component({
  selector: 'app-custom-snackbar',
  imports: [MatIconModule, CommonModule],
  templateUrl: './custom-snackbar.component.html',
  styleUrls: ['./custom-snackbar.component.css']
})
export class CustomSnackbarComponent {

  constructor(
    public snackBarRef: MatSnackBarRef<CustomSnackbarComponent>,
    @Inject(MAT_SNACK_BAR_DATA) public data: SnackBarData
  ) { }

  close() {
    this.snackBarRef.dismiss();
  }
}
