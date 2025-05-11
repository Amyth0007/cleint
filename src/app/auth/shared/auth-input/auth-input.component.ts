import { Component, Input } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-auth-input',
  template: `<div>
  <label class="block text-sm font-medium text-gray-700 mb-1">{{ label }}</label>
  <input
    [type]="type"
    [placeholder]="placeholder"
    class="auth-input w-full mb-8"
    [formControl]="control" />
</div>`,
  imports: [ReactiveFormsModule],
  standalone: true
})
export class AuthInputComponent {
  @Input() label: string = '';
  @Input() placeholder: string = '';
  @Input() type: string = 'text';
  @Input() control: any;
}
