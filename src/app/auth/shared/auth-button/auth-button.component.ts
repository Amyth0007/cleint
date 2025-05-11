import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-auth-button',
  template: `<button type="button" (click)="onClick()" class="auth-button">{{ text }}</button>`,
  standalone:true
})
export class AuthButtonComponent {
  @Input() text: string = '';
  @Input() onClick: () => void = () => {};
}
