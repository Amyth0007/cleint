import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-auth-separator',
  imports: [CommonModule],
  templateUrl: './auth-separator.component.html',
  styleUrl: './auth-separator.component.css'
})
export class AuthSeparatorComponent {
  @Input() margin: string = 'my-6 mb-7'; // default
}
