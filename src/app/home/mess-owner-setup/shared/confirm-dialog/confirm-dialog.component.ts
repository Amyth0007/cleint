// confirm-dialog.component.ts
import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-confirm-dialog',
  templateUrl: './confirm-dialog.component.html',
  styleUrls: ['./confirm-dialog.component.css'],
  imports: [CommonModule]
})
export class ConfirmDialogComponent {
  @Input() title = 'Confirmation';
  @Input() message = 'Are you sure?';
  @Input() confirmText = 'Yes';
  @Input() cancelText = 'Cancel';
  @Input() colorScheme: 'publish' | 'unpublish' | 'delete' | 'save' | 'cancel' = 'publish';
  @Output() confirm = new EventEmitter<void>();
  @Output() cancel = new EventEmitter<void>();

  onConfirm() {
    this.confirm.emit();
  }

  onCancel() {
    this.cancel.emit();
  }
}
