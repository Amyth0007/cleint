import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-auth-layout',
  templateUrl: './auth-layout.component.html',
  standalone:true
})
export class AuthLayoutComponent {
  @Input() title: string = '';
  @Input() showFooter: boolean = false;
}
