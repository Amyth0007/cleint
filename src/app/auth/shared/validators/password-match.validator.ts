import { AbstractControl, ValidationErrors, ValidatorFn, FormGroup } from '@angular/forms';

export const passwordMatchValidator: ValidatorFn = (group: AbstractControl): ValidationErrors | null => {
  const password = group.get('password');
  const confirmPassword = group.get('confirmPassword');

  if (!password || !confirmPassword) return null;

  const mismatch = password.value !== confirmPassword.value;

  // Set custom error only on confirmPassword field
  if (mismatch) {
    confirmPassword.setErrors({ mismatch: true });
  } else {
    // Remove only the mismatch error, not others
    const errors = confirmPassword.errors;
    if (errors && errors['mismatch']) {
      delete errors['mismatch'];
      if (Object.keys(errors).length === 0) {
        confirmPassword.setErrors(null);
      } else {
        confirmPassword.setErrors(errors);
      }
    }
  }

  return null;
};

