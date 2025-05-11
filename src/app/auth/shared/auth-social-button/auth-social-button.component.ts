import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-auth-social-button',
  imports: [],
  templateUrl: './auth-social-button.component.html',
  styleUrl: './auth-social-button.component.css'
})
export class AuthSocialButtonComponent {
  @Input() iconUrl: string = '';
  @Input() text: string = 'Continue';
  @Input() onClick: () => void = () => {};
}
