import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { AuthService } from "../../auth/services/auth-service/auth.service";
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthInputComponent } from 'src/app/auth/shared/auth-input/auth-input.component';
import { AuthButtonComponent } from 'src/app/auth/shared/auth-button/auth-button.component';
import { NavbarComponent } from '../shared/navbar/navbar.component';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, AuthInputComponent, AuthButtonComponent, FormsModule,NavbarComponent]
})
export class ProfileComponent implements OnInit {
  profileForm!: FormGroup;
  currentUser: any;
  genderOptions = ['Male', 'Female', 'Other', 'Prefer not to say'];


  constructor(private authService: AuthService, private fb: FormBuilder) { }

  ngOnInit() {
    this.currentUser = this.authService.currentUserValue;
    this.profileForm = this.fb.group({
      name: [this.currentUser?.name || '', Validators.required],
      email: [this.currentUser?.email || '', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      age: [this.currentUser?.age || '', Validators.required],
      gender: [this.currentUser?.gender || '', Validators.required]
    });
  }
  get genderControl(): FormControl {
    return this.profileForm.get('gender') as FormControl;
  }
  getInitials(): string {
    if (!this.currentUser?.name) return 'U';
    return this.currentUser.name
      .split(' ')
      .map((n: string) => n[0])
      .join('')
      .toUpperCase();
  }
  onUpdateProfile() {
    if (this.profileForm.valid) {
      const updatedProfile = this.profileForm.value;
      console.log('Updated Profile:', updatedProfile);

      // TODO: Send to API or update local storage/session
    }
  }
}
