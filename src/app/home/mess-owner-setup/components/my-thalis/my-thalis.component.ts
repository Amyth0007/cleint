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

@Component({
  selector: 'app-my-thalis',
  templateUrl: './my-thalis.component.html',
  styleUrls: ['./my-thalis.component.css'],
  imports: [ConfirmDialogComponent, CommonModule, FormsModule, AddThaliComponent, ConfirmDialogComponent]
})
export class MyThalisComponent implements OnInit {
  thalis: Thali[] = [
    {
      id: 1,
      thaliName: 'Maharaja Special Thali',
      rotis: 4,
      sabzi: 'Paneer Butter Masala',
      daal: 'Dal Tadka',
      daalReplacement: 'Rajma Masala',
      rice: 'Jeera Rice',
      salad: 'Cucumber & Tomato Salad',
      sweet: 'Gulab Jamun',
      sweetInfo: '2 pieces',
      otherItems: 'Papad, Pickle, Buttermilk',
      price: 250,
      type: ThaliType.Lunch,
      image: 'https://example.com/images/thali.jpg',
      availableFrom: '2025-08-11T12:00',
      availableUntil: '2025-08-11T15:00',
      published: false,
      isDeleted: false,// Added soft delete flag,
      timeFrom: '', // Add empty string if required
      timeTo: '',   // Add empty string if required
      editable: false
    },
    {
      id: 2,
      thaliName: 'Amit Special Thali',
      rotis: 4,
      sabzi: 'Paneer Butter Masala',
      daal: 'Dal Tadka',
      daalReplacement: 'Rajma Masala',
      rice: 'Jeera Rice',
      salad: 'Cucumber & Tomato Salad',
      sweet: 'Gulab Jamun',
      sweetInfo: '2 pieces',
      otherItems: 'Papad, Pickle, Buttermilk',
      price: 250,
      type: ThaliType.Dinner,
      image: 'https://example.com/images/thali.jpg',
      availableFrom: '2025-08-11T12:00',
      availableUntil: '2025-08-11T15:00',
      published: true,
      isDeleted: false, // Added soft delete flag
      timeFrom: '', // Add empty string if required
      timeTo: '',   // Add empty string if required
      editable: false
    }
  ];
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

  constructor(
    private snackBar: SnackBarService,
    public editingState: EditingStateService,
    private thaliService: ThaliService,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    this.editingState.setEditing(false);
    this.loadThalis();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
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
      console.log('thali date', thali.available_date)
      console.log('selected date', this.selectedDate);
      return nameMatch && statusMatch && dateMatch;
    });
  }

  // Date filter handler
  applyDateFilter(): void {
    console.log("selected date on selected date filter");

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

          // this.thaliService.togglePublishStatus(thali.id, newPublishedState).subscribe({
          //   next: () => {
          //     this.snackBar.showSuccess(
          //       `Thali ${newPublishedState ? 'published' : 'unpublished'} successfully`
          //     );
          //   },
          //   error: (err: HttpErrorResponse) => {
          //     // Revert on error
          //     this.thalis[index].published = thali.published;
          //     this.snackBar.showError(
          //       `Failed to ${action} thali: ${err.error?.message || 'Please try again'}`
          //     );
          //   }
          // });
        }
      }
    );
  }

  editThali(thali: Thali) {
    this.selectedThali = { ...thali };
    this.editingState.setEditing(true);
    this.originalThaliData = { ...thali }; // Store original data for cancel
  }

  loadThalis(): void {
    // Load ALL thalis initially
    this.thaliService.getThalis().subscribe({
      next: (response) => {
        if (response && response.data) {
          this.thalis = response.data.map((thali: any) =>
            this.thaliService.transformToFrontendFormat(thali)
          );
          this.applyFilters();
        } else {
          this.thalis = [];
          this.applyFilters();
        }
      },
      error: (error) => {
        console.error('Error loading thalis:', error);
        this.thalis = [];
        this.applyFilters();
      }
    });
  }

  saveThali(updatedThali: Partial<Thali>) {
    // Extract id first
    const thaliId = updatedThali.id;

    // Validate that all required fields are present
    const requiredFields = [
      'thaliName', 'type', 'rotis', 'sabzi', 'daal', 'rice',
      'salad', 'sweet', 'price', 'image', 'timeFrom', 'timeTo'
    ];

    const missingFields = requiredFields.filter(field => updatedThali[field as keyof Thali] === undefined);

    if (missingFields.length > 0) {
      this.snackBar.showError(`Missing required fields: ${missingFields.join(', ')}`);
      return;
    }

    // Create thaliData without id
    const thaliData: Omit<Thali, 'id' | 'available_date' | 'availableFrom' | 'availableUntil'> = {
      thaliName: updatedThali.thaliName!,
      type: updatedThali.type! as ThaliType,
      published: updatedThali.published ?? false,
      editable: updatedThali.editable ?? true,
      rotis: updatedThali.rotis!,
      sabzi: updatedThali.sabzi!,
      daal: updatedThali.daal!,
      daalReplacement: updatedThali.daalReplacement ?? '',
      rice: updatedThali.rice!,
      salad: updatedThali.salad!,
      sweet: updatedThali.sweet!,
      sweetInfo: updatedThali.sweetInfo ?? '',
      otherItems: updatedThali.otherItems ?? '',
      price: updatedThali.price!,
      image: updatedThali.image!,
      timeFrom: updatedThali.timeFrom!,
      timeTo: updatedThali.timeTo!,
      isDeleted: updatedThali.isDeleted ?? false
    };

    if (thaliId) {
      this.thaliService.updateThali(thaliId, thaliData).subscribe({
        next: () => {
          this.snackBar.showSuccess('Thali updated successfully');

          // Reload thalis from server to get updated data
          this.loadThalis(); // This will call applyFilters() internally

          this.editingState.setEditing(false);
          this.selectedThali = null;
        },
        error: (error) => {
          this.snackBar.showError('Error updating thali: ' + error.message);
        }
      });
    } else {
      this.thaliService.addThali(thaliData).subscribe({
        next: () => {
          this.snackBar.showSuccess('Thali created successfully');

          // Reload thalis from server to include the new thali
          this.loadThalis(); // This will call applyFilters() internally

          this.editingState.setEditing(false);
          this.selectedThali = null;
        },
        error: (error) => {
          this.snackBar.showError('Error creating thali: ' + error.message);
        }
      });
    }
  }

  cancelEdit() {
    this.editingState.setEditing(false); // Exit edit mode
    this.selectedThali = null;
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
            error: (err:Error) => {
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

  onThaliSaved(newThali?: Thali) {
    if (newThali) {
      // If a new thali was created, add it to the list
      this.thalis.unshift(newThali);
      this.applyFilters(); // Apply filters to include the new thali
    } else {
      // If an existing thali was updated, we need to refresh the list
      // Since we don't know which thali was updated, reload from server
      this.loadThalis();
    }
    this.editingState.setEditing(false);
    this.selectedThali = null;
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
