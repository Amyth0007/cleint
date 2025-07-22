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
import { AuthSocialButtonComponent } from "../../shared/auth-social-button/auth-social-button.component";

@Component({
  selector: 'app-mess-owner-login',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterLink,
    AuthInputComponent,
    AuthButtonComponent,
    AuthLayoutComponent,
    AuthSocialButtonComponent,
    AuthSeparatorComponent
  ],
  templateUrl: './mess-owner-login.component.html',
})
export class MessOwnerLoginComponent {
  loginForm: FormGroup;
  isLoading = false;
  errorMessage = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private snackBar: MatSnackBar,
    private messService: MessService
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  showSuccess() {
    this.snackBar.open('✅ Login successful!', 'Close', {
      duration: 3000,
      panelClass: ['snackbar-success']
    });
  }

  showError() {
    this.snackBar.open('❌ Invalid email or password.', 'Close', {
      duration: 3000,
      panelClass: ['snackbar-error']
    });
  }

  onSubmit() {
    if (this.loginForm.valid) {
      this.isLoading = true;
      this.errorMessage = '';

      const { email, password } = this.loginForm.value;

      this.authService.loginMessOwner(email, password).subscribe({
        next: async (response) => {
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
                    this.router.navigate(['/mess-owner/setup/dash']);
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
        error: (error) => {
          this.errorMessage = error.error?.message || 'Login failed. Please try again.';
          this.showError();
          this.isLoading = false;
        },
        complete: () => {
          this.isLoading = false;
        }
      });
    }
  }

  logInWithGoogle = () => {
    console.log('Google login');
  };

  logInWithFacebook = () => {
    console.log('Facebook login');
  };

  
} 