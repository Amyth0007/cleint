import { Component, OnInit } from '@angular/core';
import { AuthLayoutComponent } from '../shared/auth-layout/auth-layout.component';
import { AuthInputComponent } from '../shared/auth-input/auth-input.component';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthSeparatorComponent } from '../shared/auth-separator/auth-separator.component';
import { AuthButtonComponent } from '../shared/auth-button/auth-button.component';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-forgot-password',
  imports: [AuthLayoutComponent,AuthInputComponent,AuthSeparatorComponent,AuthButtonComponent,ReactiveFormsModule,RouterModule],
  templateUrl: './forgot-password.component.html',
  styleUrl: './forgot-password.component.css'
})
export class ForgotPasswordComponent implements OnInit{
  forgotPasswordForm!: FormGroup;

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    console.log('ForgotPasswordComponent loaded');
    this.forgotPasswordForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      phoneNumber: ['', [Validators.required, Validators.pattern(/^\d{10}$/)]],
    });
  }
  onSubmit = () => {
    if (this.forgotPasswordForm.valid) {
      const data = this.forgotPasswordForm.value;
      // handle forgot password logic
    }
  }
} 
