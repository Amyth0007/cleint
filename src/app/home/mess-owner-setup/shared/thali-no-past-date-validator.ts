import { AbstractControl, ValidationErrors } from '@angular/forms';

export function thaliNoPastDateValidator(control: AbstractControl): ValidationErrors | null {
  const selectedDate = new Date(control.value);
  const today = new Date();
  today.setHours(0, 0, 0, 0); // Remove time part

  return selectedDate < today ? { pastDate: true } : null;
}
