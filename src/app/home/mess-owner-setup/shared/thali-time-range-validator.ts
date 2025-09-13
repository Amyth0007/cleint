import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function thaliTimeRangeValidator(): ValidatorFn {
  return (group: AbstractControl): ValidationErrors | null => {
    const type = group.get('type')?.value;
    const from = group.get('availableFrom')?.value;
    const until = group.get('availableUntil')?.value;

    if (!type || !from || !until) return null;

    const isValid = (time: string, min: string, max: string) =>
      time >= min && time <= max;

    if (type === 'lunch') {
      if (!isValid(from, '12:00', '16:00') || !isValid(until, '12:00', '16:00')) {
        return { invalidLunchTime: true };
      }
    }

    if (type === 'dinner') {
      if (!isValid(from, '19:00', '23:00') || !isValid(until, '19:00', '23:00')) {
        return { invalidDinnerTime: true };
      }
    }

    return null;
  };
}
