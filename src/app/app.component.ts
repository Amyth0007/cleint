import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { LoadingBarComponent } from './home/shared/loading-bar/loading-bar.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet,LoadingBarComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'cleint';
}
