import { Component, EventEmitter, OnInit, Output, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RoleSelect } from '../../../../models/administration/admin-user-management/RoleSelect.model';
import { AdminUserManagementService } from '../../../../services/administration/admin-user-management/admin-user-management.service';

declare var bootstrap: any;

@Component({
  selector: 'app-admin-user-create-modal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './admin-user-create-modal.component.html',
  styleUrl: './admin-user-create-modal.component.css',
})
export class AdminUserCreateModalComponent implements OnInit{

  @Output() userCreated = new EventEmitter<void>();

  rolesList: RoleSelect[] = [];
  createUserForm: FormGroup;
  isSubmitting: boolean = false;

  private fb = inject(FormBuilder);
  private userService = inject(AdminUserManagementService);

  constructor() {
    this.createUserForm = this.fb.group({
      username: ['', [Validators.required, Validators.minLength(4)]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      roleId: ['', [Validators.required]],
      status: ['activo']
    });
  }

  ngOnInit(): void {
    this.userService.getRolesForSelect().subscribe(data => this.rolesList = data);
  }

  onSubmitCreate(): void {
    if (this.createUserForm.invalid) {
      this.createUserForm.markAllAsTouched();
      return;
    }

    this.isSubmitting = true;
    this.userService.createUser(this.createUserForm.value).subscribe({
      next: (success) => {
        if (success) {
          const modalElement = document.getElementById('createUserModal');
          if (modalElement) {
            bootstrap.Modal.getInstance(modalElement)?.hide();
          }

          this.createUserForm.reset({ status: 'activo' });
          this.userCreated.emit();
        }
        this.isSubmitting = false;
      },
      error: () => {
        this.isSubmitting = false;
        alert('Error al crear usuario');
      }
    });
  }

  get f() { return this.createUserForm.controls; }
}
