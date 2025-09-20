import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { thaliTimeRangeValidator } from '../../shared/thali-time-range-validator';
import { SnackBarService } from 'src/app/services/snack-bar.service';
import { Thali, ThaliType } from 'src/app/auth/interfaces/thali.interface';
import { ConfirmDialogComponent } from '../../shared/confirm-dialog/confirm-dialog.component';
import { EditingStateService } from 'src/app/services/editing-state.service';
import { Subject, takeUntil } from 'rxjs';
import { ThaliService } from 'src/app/services/thalis.service';

@Component({
  selector: 'app-add-thali',
  templateUrl: './add-thali.component.html',
  styleUrls: ['./add-thali.component.css'],
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, ConfirmDialogComponent]
})
export class AddThaliComponent implements OnInit, OnDestroy {
  @Input() thaliData: Thali | null = null;
  @Input() readonly: boolean = false;
  @Output() delete = new EventEmitter<void>();
  @Output() cancelEdit = new EventEmitter<void>();
  @Output() thaliChange = new EventEmitter<Partial<Thali>>();
  @Output() thaliCreated = new EventEmitter<Thali>(); // For new thalis
  @Output() thaliUpdated = new EventEmitter<void>();   // For updates

  isEditing = false;
  thaliForm: FormGroup;
  previewUrl: string | ArrayBuffer | null = null;
  timeMin = '00:00';
  timeMax = '23:59';
  ThaliType = ThaliType;
  private timeRanges: Record<ThaliType, { min: string; max: string }> = {
    [ThaliType.Lunch]: { min: '12:00', max: '16:00' },
    [ThaliType.Dinner]: { min: '19:00', max: '23:00' }
  };
  thaliTypes = Object.values(ThaliType).filter(value => typeof value === 'string');
  private destroy$ = new Subject<void>();
  showDialog = false;
  dialogTitle = '';
  dialogMessage = '';
  dialogConfirmText = '';
  dialogCancelText = '';
  dialogColor: 'publish' | 'unpublish' | 'delete' | 'save' | 'cancel' = 'publish';
  dialogCallback: () => void = () => { };

  constructor(
    private fb: FormBuilder,
    private snackBar: SnackBarService,
    private editingState: EditingStateService,
    private thaliService: ThaliService
  ) {
    this.thaliForm = this.fb.group({
      thaliName: ['', Validators.required],
      rotis: ['', [Validators.required, Validators.min(0)]],
      sabzi: ['', Validators.required],
      daal: ['', Validators.required],
      daalReplacement: [''],
      rice: ['', Validators.required],
      salad: ['no'],
      sweet: ['no'],
      sweetInfo: [''],
      otherItems: [''],
      price: ['', [Validators.required, Validators.min(1)]],
      type: [null, Validators.required],
      image: [null, Validators.required],
      availableFrom: ['', Validators.required],
      availableUntil: ['', Validators.required],
    });
    this.thaliForm.setValidators(thaliTimeRangeValidator());
  }

  ngOnInit(): void {
    this.setupFormInitialState();
    this.setupFormLogic();

    this.editingState.isEditing$
      .pipe(takeUntil(this.destroy$))
      .subscribe(isEditing => {
        this.isEditing = isEditing;
        this.handleEditStateChange();
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private setupFormInitialState(): void {
    if (this.thaliData) {
      this.patchThali(this.thaliData);
      this.previewUrl = this.thaliData.image || null;
    }

    if (this.isEditing) {
      this.enableEditMode();
    } else if (this.readonly) {
      this.thaliForm.disable();
    } else {
      this.thaliForm.enable();
    }
  }

  private handleEditStateChange(): void {
    if (this.isEditing) {
      this.enableEditMode();
    } else if (this.readonly) {
      this.thaliForm.disable();
    } else {
      this.thaliForm.enable();
    }
  }

  private setupFormLogic(): void {
    // Sweet logic
    this.getControl('sweet')?.valueChanges.subscribe((value: string) => {
      const sweetInfoControl = this.getControl('sweetInfo');
      value === 'yes' ? sweetInfoControl?.enable() : (sweetInfoControl?.disable(), sweetInfoControl?.reset());
    });

    // Daal logic
    this.getControl('daal')?.valueChanges.subscribe((value: string) => {
      const daalReplacementControl = this.getControl('daalReplacement');
      value === 'no' ? daalReplacementControl?.enable() : (daalReplacementControl?.disable(), daalReplacementControl?.reset());
    });

    // Initial daal replacement state
    if (this.getControl('daal')?.value !== 'no') {
      this.getControl('daalReplacement')?.disable();
    }

    // Time range logic
    this.getControl('type')?.valueChanges.subscribe((type: ThaliType) => {
      const range = this.timeRanges[type];
      if (range) {
        this.timeMin = range.min;
        this.timeMax = range.max;
      } else {
        this.timeMin = '00:00';
        this.timeMax = '23:59';
      }
      this.resetInvalidTimes();
    });
  }

  private getControl(controlName: string): AbstractControl | null {
    return this.thaliForm.get(controlName);
  }

  patchThali(thali: Thali): void {
    this.thaliForm.patchValue({
      thaliName: thali.thaliName,
      rotis: thali.rotis,
      sabzi: thali.sabzi,
      daal: thali.daal ? 'yes' : 'no',
      daalReplacement: thali.daalReplacement || '',
      rice: thali.rice ? 'yes' : 'no',
      salad: thali.salad ? 'yes' : 'no',
      sweet: thali.sweet ? 'yes' : 'no',
      sweetInfo: thali.sweetInfo || '',
      otherItems: thali.otherItems || '',
      price: thali.price,
      type: thali.type,
      availableFrom: thali.availableFrom?.substring(11, 16) || '',
      availableUntil: thali.availableUntil?.substring(11, 16) || ''
    });
  }

  resetInvalidTimes(): void {
    const from = this.getControl('availableFrom')?.value;
    const until = this.getControl('availableUntil')?.value;

    if (from && (from < this.timeMin || from > this.timeMax)) {
      this.getControl('availableFrom')?.setValue('');
    }
    if (until && (until < this.timeMin || until > this.timeMax)) {
      this.getControl('availableUntil')?.setValue('');
    }
  }

  enableEditMode(): void {
    this.isEditing = true;
    this.thaliForm.enable();

    if (this.getControl('daal')?.value !== 'no') {
      this.getControl('daalReplacement')?.disable();
    }
    if (this.getControl('sweet')?.value !== 'yes') {
      this.getControl('sweetInfo')?.disable();
    }
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => this.previewUrl = reader.result;
      reader.readAsDataURL(file);
      this.getControl('image')?.setValue(file);
      this.getControl('image')?.updateValueAndValidity();
    }
  }

  removeImage(): void {
    this.previewUrl = null;
    this.getControl('image')?.setValue(null);
    this.getControl('image')?.updateValueAndValidity();
  }

  confirmSave(): void {
    if (this.thaliForm.valid) {
      this.openDialog(
        'save',
        'Save Changes',
        'Are you sure you want to save these changes?',
        'Save',
        'Cancel',
        () => {
          this.submitThali();
        }
      );
    } else {
      this.thaliForm.markAllAsTouched();
      this.snackBar.showError('Please fix all errors before saving');
    }
  }

  // Dialog handlers
  onDialogConfirm() {
    this.dialogCallback();
    this.showDialog = false;
  }

  onDialogCancel() {
    this.showDialog = false;
  }

  confirmCancel(): void {
    this.openDialog(
      'cancel',
      'Cancel Editing',
      'Are you sure you want to cancel? All unsaved changes will be lost.',
      'Yes, Cancel',
      'No, Continue Editing',
      () => {
        if (this.thaliData) {
          this.patchThali(this.thaliData);
        }
        this.isEditing = false;
        this.cancelEdit.emit();
      }
    );
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

  submitThali(): void {
    if (this.thaliForm.valid) {
      const formValue = this.thaliForm.value;

      // Prepare complete thali data
      const thaliData: Omit<Thali, 'id' | 'available_date' | 'availableFrom' | 'availableUntil'> = {
        thaliName: formValue.thaliName!,
        type: formValue.type!,
        published: formValue.published || false,
        editable: formValue.editable !== false,
        rotis: formValue.rotis!,
        sabzi: formValue.sabzi!,
        daal: formValue.daal!,
        daalReplacement: formValue.daalReplacement || '',
        rice: formValue.rice!,
        salad: formValue.salad!,
        sweet: formValue.sweet!,
        sweetInfo: formValue.sweetInfo || '',
        otherItems: formValue.otherItems || '',
        price: formValue.price!,
        image: this.previewUrl as string,
        timeFrom: formValue.availableFrom!,
        timeTo: formValue.availableUntil!,
        isDeleted: false
      };

      if (this.thaliData?.id) {
        // For updates, emit just the id to indicate success
        this.thaliService.updateThali(this.thaliData.id, thaliData).subscribe({
          next: (response) => {
            this.snackBar.showSuccess('Thali updated successfully!');
            this.thaliUpdated.emit(); // Emit update event
          },
          error: (error) => {
            console.error('Error updating thali:', error);
            this.snackBar.showError('Error updating thali: ' + error.message);
          }
        });
      } else {
        // For new thalis, emit the complete thali with id
        this.thaliService.addThali(thaliData).subscribe({
          next: (newThali: Thali) => {
            this.snackBar.showSuccess('Thali created successfully!');
            this.thaliCreated.emit(newThali); // Emit create event with data
          },
          error: (error) => {
            console.error('Error creating thali:', error);
            this.snackBar.showError('Error creating thali: ' + error.message);
          }
        });
      }
    }
  }
}
