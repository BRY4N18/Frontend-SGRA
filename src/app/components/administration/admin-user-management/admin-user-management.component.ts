import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { GUser } from '../../../models/administration/admin-user-management/GUser.model';
import { RoleSelect } from '../../../models/administration/admin-user-management/RoleSelect.model';
import { AdminUserManagementService } from '../../../services/administration/admin-user-management/admin-user-management.service';

declare var bootstrap: any;

@Component({
  selector: 'app-admin-user-management',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './admin-user-management.component.html',
  styleUrl: './admin-user-management.component.css',
})
export class AdminUserManagementComponent implements OnInit{
  users: GUser[] = [];
  isLoading: boolean = true;
  rolesList: RoleSelect[] = [];

  createUserForm: FormGroup;
  isSubmitting: boolean = false;

  private userService = inject(AdminUserManagementService);
  private fb = inject(FormBuilder);

  constructor() {
    this.createUserForm = this.fb.group({
      username: ['', [Validators.required, Validators.minLength(5)]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      roleId: ['', [Validators.required]],
      status: ['activo']
    });
  }

  ngOnInit(): void {
    this.loadInitialData();
  }

  loadInitialData(): void {
    this.userService.getUsers().subscribe({
      next: (data) => {
        this.users = data;
        this.isLoading = false;
      },
      error: (err) => console.error('Error cargando usuarios', err)
    });

    this.userService.getRolesForSelect().subscribe({
      next: (data) => this.rolesList = data
    });
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
          const modalInstance = bootstrap.Modal.getInstance(modalElement);
          modalInstance.hide();

          this.createUserForm.reset({ status: 'activo' });
          this.loadInitialData();
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
