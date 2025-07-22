import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterOutlet } from '@angular/router';
import { MessOwnerNavComponent } from './components/mess-owner-nav/mess-owner-nav.component';

@Component({
  selector: 'app-mess-owner-setup',
  templateUrl: './mess-owner-setup.component.html',
  styleUrls: ['./mess-owner-setup.component.css'],
  imports: [ReactiveFormsModule, CommonModule, RouterOutlet, MessOwnerNavComponent]
})
export class MessOwnerSetupComponent {
 
  constructor( private router: Router) {

  }

}
