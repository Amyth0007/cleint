import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators, ReactiveFormsModule, FormGroup } from '@angular/forms';
import { AuthLayoutComponent } from '../shared/auth-layout/auth-layout.component';
import { AuthInputComponent } from '../shared/auth-input/auth-input.component';
import { AuthButtonComponent } from '../shared/auth-button/auth-button.component';
import { AuthSeparatorComponent } from '../shared/auth-separator/auth-separator.component';
import { AuthSocialButtonComponent } from '../shared/auth-social-button/auth-social-button.component';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    AuthLayoutComponent,
    AuthButtonComponent,
    AuthInputComponent,
    AuthSeparatorComponent,
    AuthSocialButtonComponent,
    RouterModule
  ],
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']  // fixed: `styleUrls`, not `styleUrl`
})
export class SignupComponent implements OnInit {
  signupForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
  ) {}
  ngOnInit(): void {
    console.log('SignupComponent loaded');
    this.signupForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    });
  }

  onSubmit = () => {
    if (this.signupForm.valid) {
      const data = this.signupForm.value;
      // handle signup logic
    }
  }
  signUpWithGoogle = () => {
    console.log('Google sign-up');
  };
  
  signUpWithFacebook = () => {
    console.log('Facebook sign-up');
  }; 
}

