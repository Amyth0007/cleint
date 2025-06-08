import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../services/auth-service/auth.service';
import { AuthButtonComponent } from '../shared/auth-button/auth-button.component';
import { AuthInputComponent } from '../shared/auth-input/auth-input.component';
import { AuthLayoutComponent } from '../shared/auth-layout/auth-layout.component';
import { AuthSeparatorComponent } from "../shared/auth-separator/auth-separator.component";
import { AuthSocialButtonComponent } from "../shared/auth-social-button/auth-social-button.component";

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
    AuthSocialButtonComponent
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
  ) {
    this.signupForm = this.fb.group({
      username: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]]
    }, { validator: this.passwordMatchValidator });
  }

  passwordMatchValidator(g: FormGroup) {
    return g.get('password')?.value === g.get('confirmPassword')?.value
      ? null
      : { mismatch: true };
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

      this.authService.signup({ username, email, password }).subscribe({
        next: (response) => {
          if (response.success) {
            // this.toastr.success(response.message, 'Success');
            this.router.navigate(['/']);
          } else {
            this.errorMessage = response.message || 'Signup failed. Please try again.';
            // this.toastr.error(response.message, 'Error');
          }
        },
        error: (error) => {
          this.errorMessage = error.error?.message || 'Signup failed. Please try again.';
          this.isLoading = false;
        },
        complete: () => {
          this.isLoading = false;
        }
      });
    }
  }
  signUpWithGoogle = () => {
    console.log('Google sign-up');
  };

  signUpWithFacebook = () => {
    console.log('Facebook sign-up');
  };
}

