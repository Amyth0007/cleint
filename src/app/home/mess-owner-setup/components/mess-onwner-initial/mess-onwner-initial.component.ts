import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/auth/services/auth-service/auth.service';
import { MessService } from 'src/app/services/mess.service';

@Component({
  selector: 'app-mess-onwner-initial',
  templateUrl: './mess-onwner-initial.component.html',
  styleUrl: './mess-onwner-initial.component.css',
  imports: [ReactiveFormsModule, CommonModule ]
})
export class MessOnwnerInitialComponent {
    messForm: FormGroup;
    submitted = false;
    registering = false;
    lat: number | null = null;
    lng: number | null = null;
    selectedImageName: string | null = null;
    address: string | null = null;
    addressLoading: boolean = false;
  
    constructor(private fb: FormBuilder, private router: Router, private messService: MessService, private authService: AuthService) {
      this.messForm = this.fb.group({
        name: ['', Validators.required],
        description: ['', Validators.required],
        type: ['', Validators.required],
        city: ['', Validators.required],
        image: [null],
        location: ['']
      });
    }
  

    async onDetectLocation() {
      if (!navigator.geolocation) {
        alert('Geolocation is not supported by your browser.');
        return;
      }
    
      this.addressLoading = true;
    
      try {
        const position = await this.getCurrentPosition();
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;
    
        this.lat = lat;
        this.lng = lng;
    
        const address = await this.reverseGeocode(lat, lng);
        this.address = address || 'Address not found';
    
        this.messForm.patchValue({ location: this.address });
      } catch (error) {
        console.error('Location detection failed:', error);
        alert('Unable to retrieve your location.');
        this.address = 'Address not found';
      } finally {
        this.addressLoading = false;
      }
    }
    
    private getCurrentPosition(): Promise<GeolocationPosition> {
      return new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0
        });
      });
    }
    
    private async reverseGeocode(lat: number, lng: number): Promise<string | null> {
      const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`;
      try {
        const response = await fetch(url, {
          headers: {
            'Accept': 'application/json',
          }
        });
        const data = await response.json();
        return data?.display_name ?? null;
      } catch (err) {
        console.error('Reverse geocoding failed:', err);
        return null;
      }
    }
    
  
    onUploadImage(event: any) {
      const file = event.target.files[0];
      if (file) {
        this.messForm.patchValue({ image: file });
        this.selectedImageName = file.name;
      }
    }
  
    onSubmit() {
      this.submitted = true;
      if (this.messForm.invalid || !this.lat || !this.lng || !this.address) {
        alert('Please fill all required fields and detect location.');
        return;
      }
      this.registering = true;
      const { name, description, type, city } = this.messForm.value;
      const currentUser = this.authService.currentUserValue;
      const ownerId = currentUser?.id || currentUser?.userId;
      if (!ownerId) {
        alert('User not found. Please login again.');
        this.registering = false;
        return;
      }
      const messData = {
        name,
        description,
        type,
        city,
        address: this.address,
        latitude: this.lat,
        longitude: this.lng,
        ownerId,
      };
      this.messService.createMess(messData).subscribe({
        next: (createdMess) => {
          this.registering = false;
          this.router.navigate(['/mess-owner/setup/dash']);
        },
        error: (error) => {
          this.registering = false;
          alert('Failed to create mess. Please try again.');
        }
      });
    }
  }
