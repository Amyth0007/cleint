import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class FileUploadService {

  constructor(private http: HttpClient) { }
  uploadImageToCloudinary(file: File): Observable<string> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', 'mess_owner');
    return this.http.post<any>('https://api.cloudinary.com/v1_1/dd8oitnyu/image/upload', formData)
      .pipe(
        map((response: any) => response.url)
      );
  }
} 