import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AdminMasterTablesService } from '../../../../services/administration/admin-master-tables/admin-master-tables.service';
import { GCatalogRecord } from '../../../../models/administration/admin-master-tables/GCatalogRecord';

declare var bootstrap: any;

@Component({
  selector: 'app-admin-master-create-modal',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './admin-master-create-modal.component.html',
  styleUrl: './admin-master-create-modal.component.css',
})
export class AdminMasterCreateModalComponent {
  @Output() recordSaved = new EventEmitter<void>();

  @Input() currentSchema: string | null = null;

  masterForm: FormGroup;
  isSubmitting: boolean = false;
  isEditing: boolean = false;
  currentRecordId: number | null = null;

  private fb = inject(FormBuilder);
  private masterService = inject(AdminMasterTablesService);

  constructor() {
    this.masterForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      status: ['activo', Validators.required]
    });
  }

  @Input() set recordToEdit(record: GCatalogRecord | null) {
    if (record) {
      this.isEditing = true;
      this.currentRecordId = record.mid;
      this.masterForm.patchValue({
        name: record.mnombre,
        status: record.mestado.toLowerCase() === 'activo' ? 'activo' : 'inactivo'
      });
    } else {
      this.isEditing = false;
      this.currentRecordId = null;
      this.masterForm.reset({ status: 'activo' });
    }
  }

  onSubmitSave(): void {
    if (this.masterForm.invalid || !this.currentSchema) {
      this.masterForm.markAllAsTouched();
      return;
    }

    this.isSubmitting = true;
    const formValues = this.masterForm.value;

    const requestPayload = {
      id: this.isEditing ? this.currentRecordId : undefined,
      nombre: formValues.name,
      estado: formValues.status === 'activo'
    };

    const request$ = this.isEditing
      ? this.masterService.updateRecord(this.currentSchema, requestPayload)
      : this.masterService.createRecord(this.currentSchema, requestPayload);

    request$.subscribe({
      next: (response: any) => {
        if (response.success) {
          alert(response.message);
          const modalElement = document.getElementById('createMasterModal');
          if (modalElement) bootstrap.Modal.getInstance(modalElement)?.hide();

          this.masterForm.reset({ status: 'activo' });
          this.recordSaved.emit();
        } else {
          alert(response.message);
        }
        this.isSubmitting = false;
      },
      error: (err) => {
        this.isSubmitting = false;
        alert('Error al guardar el registro.');
      }
    });
  }

  get f() { return this.masterForm.controls; }
}
