import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';

export interface SuccessPopupData {
  title: string;
  message: string;
  orderId?: string;
  details?: string[];
  showOrderId?: boolean;
}

@Component({
  selector: 'app-success-popup',
  templateUrl: './success-popup.component.html',
  styleUrls: ['./success-popup.component.css'],
  standalone: true,
  imports: [CommonModule]
})
export class SuccessPopupComponent {
  @Input() data: SuccessPopupData = {
    title: 'Success!',
    message: 'Operation completed successfully.',
    showOrderId: false
  };
  @Input() isVisible: boolean = false;
  @Output() close = new EventEmitter<void>();

  onClose() {
    this.close.emit();
  }

  onOverlayClick(event: Event) {
    if (event.target === event.currentTarget) {
      this.onClose();
    }
  }
} 