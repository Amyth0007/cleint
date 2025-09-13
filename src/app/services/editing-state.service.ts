import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class EditingStateService {
  private isEditingSubject = new BehaviorSubject<boolean>(false);
  isEditing$ = this.isEditingSubject.asObservable();

  setEditing(isEditing: boolean) {
    this.isEditingSubject.next(isEditing);
  }
}
