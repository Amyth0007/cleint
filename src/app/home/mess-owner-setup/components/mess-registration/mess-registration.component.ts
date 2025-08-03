import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/auth/services/auth-service/auth.service';
import { MessService } from 'src/app/services/mess.service';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
@Component({
  selector: 'app-mess-registration',
  templateUrl: './mess-registration.component.html',
  styleUrl: './mess-registration.component.css',
  imports: [ReactiveFormsModule, CommonModule ]
})
export class MessRegistrationComponent {
  messForm: FormGroup;
    submitted = false;
    registering = false;
    lat: number | null = null;
    lng: number | null = null;
    selectedImageName: string | null = null;
    address: string | null = null;
    addressLoading: boolean = false;
    imageUploading: boolean = false;
    imageUrl: any = null;
  
    constructor(private fb: FormBuilder, private router: Router, private messService: MessService, private authService: AuthService, private http: HttpClient) {
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
    
    uploadImageToCloudinary(file: File): Observable<string> {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('upload_preset', 'mess_owner'); 
      return this.http.post<any>('https://api.cloudinary.com/v1_1/dd8oitnyu/image/upload', formData)
      .pipe(
        map((response: any) => response.url)
      );
    }
    
    onUploadImage(event: any) {
      const file = event.target.files[0];
      if (file) {
        this.selectedImageName = file.name;
        this.imageUploading = true;
    
        this.uploadImageToCloudinary(file).subscribe({
          next: (url: any) => {
            this.imageUrl = url;
            this.imageUploading = false;
          },
          error: () => {
            alert('Image upload failed.');
            this.imageUploading = false;
          }
        });
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
      console.log(this.imageUrl);
      
      const messData = {
        name,
        description,
        type,
        city,
        address: this.address,
        latitude: this.lat,
        longitude: this.lng,
        ownerId,
        image: this.imageUrl
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
