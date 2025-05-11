import { Component } from '@angular/core';
import { AuthLayoutComponent } from '../shared/auth-layout/auth-layout.component';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthButtonComponent } from '../shared/auth-button/auth-button.component';

@Component({
  selector: 'app-enter-otp',
  imports: [AuthLayoutComponent,CommonModule,FormsModule,ReactiveFormsModule,AuthButtonComponent],
  templateUrl: './enter-otp.component.html',
  styleUrl: './enter-otp.component.css'
})
export class EnterOtpComponent {
  otpForm!: FormGroup; // Form group to handle OTP inputs
  otpArray: string[] = ['', '', '', '', '', '']; // Array to store OTP values
  otpVerified: boolean = false;

  constructor(private router: Router, private fb: FormBuilder) {}

  ngOnInit(): void {
    // Initialize the form with empty values
    this.otpForm = this.fb.group({
      otp1: ['', [Validators.required, Validators.pattern('[0-9]{1}')]],
      otp2: ['', [Validators.required, Validators.pattern('[0-9]{1}')]],
      otp3: ['', [Validators.required, Validators.pattern('[0-9]{1}')]],
      otp4: ['', [Validators.required, Validators.pattern('[0-9]{1}')]],
      otp5: ['', [Validators.required, Validators.pattern('[0-9]{1}')]],
      otp6: ['', [Validators.required, Validators.pattern('[0-9]{1}')]]
    });
  }

  onInputChange(event: Event, index: number): void {
    const input = event.target as HTMLInputElement;
    const value = input.value;
  
    if (!/^\d$/.test(value)) {
      input.value = '';
      return;
    }
  
    const next = input.nextElementSibling as HTMLInputElement;
    if (next) {
      next.focus();
    }
  }
  
  onKeyDown(event: KeyboardEvent, index: number): void {
    const input = event.target as HTMLInputElement;
    if (event.key === 'Backspace' && !input.value) {
      const prev = input.previousElementSibling as HTMLInputElement;
      if (prev) {
        prev.focus();
      }
    }
  }
  

  // Function to handle OTP input verification
  verifyOtp() {
    if (this.otpForm.valid) {
      const otp = Object.values(this.otpForm.value).join('');
      console.log('OTP Entered:', otp);
      // Simulate OTP verification logic (API call can go here)
      if (otp === '123456') { // Dummy OTP for testing
        this.otpVerified = true;
        console.log('OTP Verified');
        // Navigate to the next step (e.g., home page)
        this.router.navigate(['/home']);
      } else {
        console.log('Invalid OTP');
      }
    } else {
      console.log('Please enter a valid OTP');
    }
  }

  // Function to handle Resend OTP functionality
  resendOtp() {
    console.log('Resend OTP');
    // Call API or trigger resend OTP logic here
    // After successful resend, show a message or handle UI accordingly
  }

  // Convenience getter to check form validity for OTP fields
  get otpControls() {
    return this.otpForm.controls;
  }
}
