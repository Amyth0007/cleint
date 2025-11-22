import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../services/auth-service/auth.service';
import { AuthButtonComponent } from '../shared/auth-button/auth-button.component';
import { AuthInputComponent } from '../shared/auth-input/auth-input.component';
import { AuthLayoutComponent } from '../shared/auth-layout/auth-layout.component';
import { AuthSeparatorComponent } from "../shared/auth-separator/auth-separator.component";
import { SnackBarService } from 'src/app/services/snack-bar.service';
import { userRole } from '../interfaces/user.interface';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterLink,
    AuthInputComponent,
    AuthButtonComponent,
    AuthLayoutComponent,
    AuthSeparatorComponent
  ]
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  isLoading = false;
  errorMessage = '';
  returnUrl: string = '/';
  isMessOwnerLogin = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute,
    private toastr: ToastrService,
    private snackBar: MatSnackBar,
    private snackBarService: SnackBarService
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  ngOnInit() {
    // Get return url from route parameters or default to '/'
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
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

  toggleLoginType() {
    this.isMessOwnerLogin = !this.isMessOwnerLogin;
    this.loginForm.reset();
  }

  onSubmit() {
    if (this.loginForm.valid) {
      this.isLoading = true;
      this.errorMessage = '';

      const { email, password } = this.loginForm.value;

      this.authService.login(email, password).subscribe({
        next: (response) => {
          if (response.success) {
            if (this.authService.currentUserValue.role !== userRole.customer) {
              this.snackBarService.showError('⚠️ This is a customer login. Cannot login as mess owner.');
              return;
            }
            this.showSuccess()
            setTimeout(() => {
              this.router.navigate([this.returnUrl]);
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

}
