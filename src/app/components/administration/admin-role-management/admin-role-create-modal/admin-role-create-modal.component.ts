import { Component, EventEmitter, Output, inject, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AdminRoleManagementService } from '../../../../services/administration/admin-role-management/admin-role-management.service';
import { GRole } from '../../../../models/administration/admin-role-management/GRole.model';

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
  isEditing: boolean = false;
  currentRoleId: number | null = null;

  private fb = inject(FormBuilder);
  private roleService = inject(AdminRoleManagementService);

  constructor() {
    this.createRoleForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      description: ['', [Validators.required, Validators.maxLength(200)]],
      status: ['activo', Validators.required],
    });
  }

  onSubmitCreate(): void {
    if (this.createRoleForm.invalid) {
      this.createRoleForm.markAllAsTouched();
      return;
    }

    this.isSubmitting = true;
    const formValues = this.createRoleForm.value;

    const requestPayload = {
      roleGId: this.isEditing ? (this.currentRoleId ?? undefined) : undefined,
      roleG: formValues.name,
      description: formValues.description,
      state: formValues.status === 'activo',
    };

    const request$ = this.isEditing
      ? this.roleService.updateRole(requestPayload)
      : this.roleService.createRole(requestPayload)

    request$.subscribe({
      next: (response) => {
        if (response.success) {
          alert(response.message);

          const modalElement = document.getElementById('createRoleModal');
          if (modalElement) {
            bootstrap.Modal.getInstance(modalElement)?.hide();
          }
          this.createRoleForm.reset({ status: 'activo' });
          this.roleCreated.emit();
        } else {
          alert(response.message);
        }
        this.isSubmitting = false;
      },
      error: (error) => {
        console.error('Error creando rol:', error);
        this.isSubmitting = false;
        alert(this.isEditing ? 'Error al actualizar el rol' : 'Error al crear el rol');
      },
    });
  }

  @Input() set roleToEdit(role: GRole | null) {
    if (role) {
      this.isEditing = true;
      this.currentRoleId = role.idg;

      this.createRoleForm.patchValue({
        name: role.nombreg,
        description: role.descripciong,
        status: role.estadog.toLowerCase() === 'activo' ? 'activo' : 'inactivo',
      });
    } else {
      this.isEditing = false;
      this.currentRoleId = null;
      this.createRoleForm.reset({ status: 'activo' });
    }
  }

  get f() {
    return this.createRoleForm.controls;
  }
}
