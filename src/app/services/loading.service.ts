import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoadingService {
  private apiRequestCount = 0;
  private loadingSubject = new BehaviorSubject<boolean>(false);
  isLoading$ = this.loadingSubject.asObservable();

  show() {
    this.apiRequestCount++;
    this.loadingSubject.next(true);
  }
  hide() {
    this.apiRequestCount--;
    if (this.apiRequestCount === 0) {
      this.loadingSubject.next(false)
    }

  }
}
