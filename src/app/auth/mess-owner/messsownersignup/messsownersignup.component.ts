import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth-service/auth.service';
import { AuthButtonComponent } from '../../shared/auth-button/auth-button.component';
import { AuthInputComponent } from '../../shared/auth-input/auth-input.component';
import { AuthLayoutComponent } from '../../shared/auth-layout/auth-layout.component';
import { AuthSeparatorComponent } from "../../shared/auth-separator/auth-separator.component";
import { AuthSocialButtonComponent } from "../../shared/auth-social-button/auth-social-button.component";

@Component({
  selector: 'app-messsownersignup',
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
    private snackBar: MatSnackBar
  ) {
    this.signupForm = this.fb.group({
      username: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
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
        role: 'mess_owner'
      };

      this.authService.signupMessOwner(formData).subscribe({
        next: (response) => {
          if (response.success) {
            this.showSuccess();
            setTimeout(() => {
              this.router.navigate(['/mess-owner/dashboard']);
            }, 500);
          }
        },
        error: (error) => {
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

  signUpWithGoogle = () => {
    console.log('Google signup');
  };

  signUpWithFacebook = () => {
    console.log('Facebook signup');
  };
} 
