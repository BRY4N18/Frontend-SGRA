import { Component, EventEmitter, Output, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AdminRoleManagementService } from '../../../../services/administration/admin-role-management/admin-role-management-service';

declare var bootstrap: any;

@Component({
  selector: 'app-admin-role-create-modal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './admin-role-create-modal.component.html',
  styleUrl: './admin-role-create-modal.component.css',
})
export class AdminRoleCreateModalComponent {
  @Output() roleCreated = new EventEmitter<void>();

  createRoleForm: FormGroup;
  isSubmitting: boolean = false;

  private fb = inject(FormBuilder);
  private roleService = inject(AdminRoleManagementService);

  constructor() {
    this.createRoleForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      description: ['', [Validators.required, Validators.maxLength(200)]],
      status: ['activo', Validators.required]
    });
  }

  onSubmitCreate(): void {
    if (this.createRoleForm.invalid) {
      this.createRoleForm.markAllAsTouched();
      return;
    }

    this.isSubmitting = true;
    this.roleService.createRole(this.createRoleForm.value).subscribe({
      next: (success) => {
        if (success) {
          const modalElement = document.getElementById('createRoleModal');
          if (modalElement) {
            bootstrap.Modal.getInstance(modalElement)?.hide();
          }
          this.createRoleForm.reset({ status: 'activo' });
          this.roleCreated.emit();
        }
        this.isSubmitting = false;
      },
      error: () => {
        this.isSubmitting = false;
        alert('Error al crear el rol');
      }
    });
  }

  get f() { return this.createRoleForm.controls; }
}
