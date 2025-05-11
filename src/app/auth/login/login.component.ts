import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink, RouterModule } from '@angular/router';
import { AuthButtonComponent } from '../shared/auth-button/auth-button.component';
import { AuthInputComponent } from '../shared/auth-input/auth-input.component';
import { AuthLayoutComponent } from '../shared/auth-layout/auth-layout.component';
import { AuthSeparatorComponent } from '../shared/auth-separator/auth-separator.component';
import { AuthSocialButtonComponent } from '../shared/auth-social-button/auth-social-button.component';

@Component({
  selector: 'app-login',
  imports: [
    ReactiveFormsModule,
    AuthLayoutComponent,
    AuthButtonComponent,
    AuthInputComponent,
    AuthSeparatorComponent,
    AuthSocialButtonComponent,
    RouterModule
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  constructor(
    private fb: FormBuilder,
  ) {}
  ngOnInit(): void {
    console.log('LoginComponent loaded');
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    });
  }

  onSubmit = () => {
    if (this.loginForm.valid) {
      const data = this.loginForm.value;
      // handle login logic
    }
  }
  logInWithGoogle = () => {
    console.log('Google sign-up');
  };
  
  logInWithFacebook = () => {
    console.log('Facebook sign-up');
  }; 
}
