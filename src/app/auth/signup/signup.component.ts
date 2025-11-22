import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../services/auth-service/auth.service';
import { AuthButtonComponent } from '../shared/auth-button/auth-button.component';
import { AuthInputComponent } from '../shared/auth-input/auth-input.component';
import { AuthLayoutComponent } from '../shared/auth-layout/auth-layout.component';
import { AuthSeparatorComponent } from "../shared/auth-separator/auth-separator.component";
import { passwordMatchValidator } from '../shared/validators/password-match.validator';
import { SnackBarService } from 'src/app/services/snack-bar.service';
import { userRole } from '../interfaces/user.interface';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterLink,
    AuthInputComponent,
    AuthButtonComponent,
    AuthLayoutComponent,
    AuthSeparatorComponent,
  ]
})
export class SignupComponent {
  signupForm: FormGroup;
  isLoading = false;
  errorMessage = '';
  passwordMismatch = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private snackBarService: SnackBarService

  ) {
    this.signupForm = this.fb.group({
      username: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]]
    }, { validator: passwordMatchValidator });
  }



  onSubmit() {
    if (this.signupForm.hasError('mismatch')) {
      this.passwordMismatch = true;
      this.isLoading = false;
      return;
    }
    if (this.signupForm.valid) {
      this.isLoading = true;
      this.errorMessage = '';
      this.passwordMismatch = false;

      const { username, email, password } = this.signupForm.value;

      this.authService.signup({ username, email, password, role:userRole.customer }).subscribe({
        next: (response) => {
          if (response.success) {
            // this.toastr.success(response.message, 'Success');
            this.snackBarService.showSuccess('🎉 Account created!');
            setTimeout(() => {
              this.router.navigate(['/']);
            }, 500);
          } else {
            this.errorMessage = response.message || 'Signup failed. Please try again.';
            this.snackBarService.showError('⚠️ Email already exists!');
            // this.toastr.error(response.message, 'Error');
          }
        },
        error: (error) => {
          // this.errorMessage = error.error?.message || 'Signup failed. Please try again.';
          if (error.error?.message === 'User already exists') {
            this.signupForm.get('email')?.setErrors({ emailExists: true });
            this.snackBarService.showError('⚠️ Email already exists!');
          } else {
            // Handle other errors, optional
          }
          this.isLoading = false;
        },
        complete: () => {
          this.isLoading = false;
        }
      });
    }
  }

}

