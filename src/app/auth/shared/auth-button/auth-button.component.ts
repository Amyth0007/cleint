import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-auth-button',
  templateUrl: './auth-button.component.html',
  standalone: true,
  imports: [CommonModule]
})
export class AuthButtonComponent {
  @Input() text: string = '';
  @Input() onClick: () => void = () => {};
  @Input() disabled: boolean = false;
}
