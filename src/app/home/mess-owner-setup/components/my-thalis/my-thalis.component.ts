import { Component, OnInit } from '@angular/core';
import { Thali, ThaliType } from 'src/app/auth/interfaces/thali.interface';
import { ConfirmDialogComponent } from '../../shared/confirm-dialog/confirm-dialog.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AddThaliComponent } from "../add-thali/add-thali.component";
import { SnackBarService } from 'src/app/services/snack-bar.service';
import { ThaliService } from 'src/app/services/thalis.service';
import { AuthService } from 'src/app/auth/services/auth-service/auth.service';
import { Subject } from 'rxjs';
import { EditingStateService } from 'src/app/services/editing-state.service';
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-my-thalis',
  templateUrl: './my-thalis.component.html',
  styleUrls: ['./my-thalis.component.css'],
  imports: [ConfirmDialogComponent, CommonModule, FormsModule, ConfirmDialogComponent, AddThaliComponent]
})
export class MyThalisComponent implements OnInit {
  thalis: Thali[] = [];
  filteredThalis: Thali[] = [];
  selectedThali: Thali | null = null;

  // Filter properties
  filterName: string = '';
  filterStatus: 'all' | 'published' | 'unpublished' = 'all';
  selectedDate: string = ''; // Only custom date filter

  // Other properties remain the same
  isEditing = false;
  originalThaliData: Partial<Thali> = {};
  private destroy$ = new Subject<void>();

  // Dialog state
  dialogColor: 'publish' | 'unpublish' | 'delete' | 'save' | 'cancel' = 'publish';
  dialogTitle = '';
  dialogMessage = '';
  dialogConfirmText = '';
  dialogCancelText = '';
  dialogCallback: () => void = () => { };
  showDialog = false;

  //loading indicator
  loading = false;
  error: string | null = null;

  constructor(
    private snackBar: SnackBarService,
    public editingState: EditingStateService,
    private thaliService: ThaliService,
    private authService: AuthService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.editingState.setEditing(false);
    this.loadThalis();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  refreshThalis() {
    this.loadThalis();
  }

  applyFilters(): void {
    this.filteredThalis = this.thalis.filter(thali => {
      // Skip deleted thalis
      if (thali.isDeleted) return false;

      // Apply name filter
      const nameMatch = this.filterName === '' ||
        thali.thaliName.toLowerCase().includes(this.filterName.toLowerCase());

      // Apply status filter
      const statusMatch = this.filterStatus === 'all' ||
        (this.filterStatus === 'published' && thali.published) ||
        (this.filterStatus === 'unpublished' && !thali.published);

      // Apply date filter - only if a date is selected
      const dateMatch =
        this.selectedDate === '' ||
        (thali.available_date && thali.available_date === this.selectedDate);
      return nameMatch && statusMatch && dateMatch;
    });
  }

  // Date filter handler
  applyDateFilter(): void {
    this.applyFilters();
  }

  // Clear date filter
  clearDateFilter(): void {
    this.selectedDate = '';
    this.applyFilters();
  }

  // Clear all filters
  clearAllFilters(): void {
    this.filterName = '';
    this.filterStatus = 'all';
    this.selectedDate = '';
    this.applyFilters();
  }

  // Other filter handlers
  onNameFilterInput(event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    this.filterName = inputElement.value;
    this.applyFilters();
  }

  onStatusFilterChange(event: Event): void {
    const selectElement = event.target as HTMLSelectElement;
    this.filterStatus = selectElement.value as 'all' | 'published' | 'unpublished';
    this.applyFilters();
  }

  togglePublish(thali: Thali) {
    const action = thali.published ? 'unpublish' : 'publish';
    const actionTitle = thali.published ? 'Unpublish Thali' : 'Publish Thali';
    const actionMessage = thali.published
      ? `Unpublish "${thali.thaliName}"? It will be immediately hidden from users.`
      : `Publish "${thali.thaliName}" for today? It will be visible to all users until you unpublish it.`;

    this.openDialog(
      thali.published ? 'unpublish' : 'publish',
      actionTitle,
      actionMessage,
      actionTitle,
      'Cancel',
      () => {
        const index = this.thalis.findIndex(t => t.id === thali.id);
        if (index !== -1) {
          const newPublishedState = !thali.published;

          // Optimistic UI update
          this.thalis[index].published = newPublishedState;

          this.thaliService.togglePublishStatus(thali.id, newPublishedState).subscribe({
            next: () => {
              this.snackBar.showSuccess(
                `Thali ${newPublishedState ? 'published' : 'unpublished'} successfully`
              );
            },
            error: (err: HttpErrorResponse) => {
              // Revert on error
              this.thalis[index].published = thali.published;
              this.snackBar.showError(
                `Failed to ${action} thali: ${err.error?.message || 'Please try again'}`
              );
            }
          });
        }
      }
    );
  }

  editThali(thali: Thali) {
    this.selectedThali = { ...thali };
    this.editingState.setEditing(true);
    console.log('EDIT DATA:', this.selectedThali);
    this.originalThaliData = { ...thali }; // Store original data for cancel
  }

  loadThalis(): void {
    this.loading = true;
    this.error = null;
    // Load ALL thalis initially
    this.thaliService.getThalis().subscribe({
      next: (response) => {
        if (response && response.data) {
          this.loading = false;
          this.thalis = response.data.map((thali: any) =>
            this.thaliService.transformToFrontendFormat(thali)
          );
          this.applyFilters();
        } else {
          this.loading = false;
          this.thalis = [];
          this.applyFilters();
        }
      },
      error: (error) => {
        this.loading = false;
        this.error = error.error?.message || 'Please try again';
        console.error('Error loading thalis:', error);
        this.thalis = [];
        this.applyFilters();
      }
    });
  }

  deleteThali(thali: Thali) {
    this.openDialog(
      'delete',
      'Delete Thali',
      `Are you sure you want to delete "${thali.thaliName}"?`,
      'Delete',
      'Cancel',
      () => {
        // Find the thali in the array
        const index = this.thalis.findIndex(t => t.id === thali.id);
        if (index !== -1) {
          // Call backend service to update in database
          this.thaliService.deleteThali(thali.id).subscribe({
            next: () => {
              this.loadThalis(); // This will call applyFilters() internally
              this.snackBar.showSuccess('Thali moved to trash');
            },
            error: (err: Error) => {
              this.snackBar.showError('Failed to delete thali');
              // Revert local change if API fails
              this.thalis[index].isDeleted = false;
            }
          });
        }
      }
    );
  }

  addNewThali() {
    this.router.navigate(['/mess-owner/setup/add-thali']);
    this.selectedThali = null;
    this.editingState.setEditing(true);
    // this.isEditing = true;
  }

  openDialog(
    type: 'publish' | 'unpublish' | 'delete' | 'save' | 'cancel',
    title: string,
    message: string,
    confirmText: string,
    cancelText: string,
    callback: () => void
  ) {
    this.dialogColor = type;
    this.dialogTitle = title;
    this.dialogMessage = message;
    this.dialogConfirmText = confirmText;
    this.dialogCancelText = cancelText;
    this.dialogCallback = callback;
    this.showDialog = true;
  }

  confirmDialog() {
    this.dialogCallback();
    this.showDialog = false;
  }

  cancelDialog() {
    this.showDialog = false;
  }

  onCancelEdit() {
    this.editingState.setEditing(false);
    this.selectedThali = null;
  }

  onThaliCreated(newThali: Thali) {
    this.thalis.unshift(newThali);
    this.applyFilters();
    this.editingState.setEditing(false);
    this.selectedThali = null;
  }

  onThaliUpdated() {
    this.loadThalis();
    this.editingState.setEditing(false);
    this.selectedThali = null;
  }
}
