import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router, RouterLink } from '@angular/router';
import { MessService } from 'src/app/services/mess.service';
import { AuthService } from '../../services/auth-service/auth.service';
import { AuthButtonComponent } from '../../shared/auth-button/auth-button.component';
import { AuthInputComponent } from '../../shared/auth-input/auth-input.component';
import { AuthLayoutComponent } from '../../shared/auth-layout/auth-layout.component';
import { AuthSeparatorComponent } from "../../shared/auth-separator/auth-separator.component";
import { userRole } from '../../interfaces/user.interface';
import { passwordMatchValidator } from '../../shared/validators/password-match.validator';

@Component({
  selector: 'app-messsownersignup',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterLink,
    AuthInputComponent,
    AuthButtonComponent,
    AuthLayoutComponent,
    AuthSeparatorComponent
  ],
  templateUrl: './messsownersignup.component.html',
  styleUrl: './messsownersignup.component.css'
})
export class MesssownersignupComponent {
  signupForm: FormGroup;
  isLoading = false;
  errorMessage = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private snackBar: MatSnackBar,
    private messService: MessService
  ) {
       this.signupForm = this.fb.group({
         username: ['', [Validators.required, Validators.minLength(3)]],
         email: ['', [Validators.required, Validators.email]],
         password: ['', [Validators.required, Validators.minLength(6)]],
         confirmPassword: ['', [Validators.required]]
       }, { validator: passwordMatchValidator });
  }

  showSuccess() {
    this.snackBar.open('✅ Signup successful!', 'Close', {
      duration: 3000,
      panelClass: ['snackbar-success']
    });
  }

  showError() {
    this.snackBar.open('❌ Signup failed. Please try again.', 'Close', {
      duration: 3000,
      panelClass: ['snackbar-error']
    });
  }

  onSubmit() {
    if (this.signupForm.valid) {
      this.isLoading = true;
      this.errorMessage = '';

      const formData = {
        ...this.signupForm.value,
        role: userRole.mess_owner
      };

      this.authService.signupMessOwner(formData).subscribe({
        next: async (response: any) => {
          if (response.success) {
            this.showSuccess();
            setTimeout(async () => {
              const currentUser = this.authService.currentUserValue;
              const userId = currentUser?.id || currentUser?.userId;

              if (!userId) {
                this.router.navigate(['/mess-owner/initial-setup']);
                return;
              }
              this.messService.checkMessExists(userId).subscribe({
                next: (result) => {

                  
                  if (result?.exists) {
                    this.router.navigate(['/mess-owner/setup/my-thalis']);
                  } else {
                    this.router.navigate(['/mess-owner/initial-setup']);
                  }
                },
                error: () => {
                  this.router.navigate(['/mess-owner/initial-setup']);
                }
              });
            }, 500);
          }
        },
        error: (error: any) => {
          this.errorMessage = error.error?.message || 'Signup failed. Please try again.';
          this.showError();
          this.isLoading = false;
        },
        complete: () => {
          this.isLoading = false;
        }
      });
    }
  }


}
