import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { AbstractControl, FormControl, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-auth-input',
  templateUrl: './auth-input.component.html',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule]
})
export class AuthInputComponent {
  @Input() label: string = '';
  @Input() placeholder: string = '';
  @Input() type: string = 'text';
  @Input() control!: AbstractControl;

  get formControl(): FormControl {
    return this.control as FormControl;
  }
}
