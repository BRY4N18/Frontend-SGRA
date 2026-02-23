import { Component, EventEmitter, OnInit, Output, inject, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup,FormArray, FormControl, Validators} from '@angular/forms';
import { GRoleSimple } from './../../../../models/administration/admin-permission-management/GRoleSimple';
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

  rolesList: GRoleSimple[] = [];
  createUserForm: FormGroup;
  isSubmitting: boolean = false;
  isEditing: boolean = false;
  currentUserId: number | null = null;

  private fb = inject(FormBuilder);
  private userService = inject(AdminUserManagementService);

  constructor() {
    this.createUserForm = this.fb.group({
      username: ['', [Validators.required, Validators.minLength(4)]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      roleIds: this.fb.array([], [Validators.required]),
      status: ['activo']
    });
  }

  ngOnInit(): void {
    this.userService.getRolesForSelect().subscribe(data => this.rolesList = data);
  }

  onRoleToggle(event: Event, roleId: number): void {
    const roleIdsArray = this.createUserForm.get('roleIds') as FormArray;
    const isChecked = (event.target as HTMLInputElement).checked;

    if (isChecked) {
      if (!this.isRoleSelected(roleId)) {
        roleIdsArray.push(new FormControl(roleId));
      }
    } else {
      const index = roleIdsArray.controls.findIndex(ctrl => ctrl.value === roleId);
      if (index !== -1) {
        roleIdsArray.removeAt(index);
      }
    }
    roleIdsArray.markAsTouched();
  }

  isRoleSelected(roleId: number): boolean {
    const roleIdsArray = this.createUserForm.get('roleIds') as FormArray;
    return roleIdsArray.value.includes(roleId);
  }

  onSubmitCreate(): void {
    if (this.createUserForm.invalid) {
      this.createUserForm.markAllAsTouched();
      return;
    }

    this.isSubmitting = true;
    const formValues = this.createUserForm.value;

    const requestPayLoad ={
      userGId: this.isEditing ? (this.currentUserId ?? undefined) : undefined,
      user: formValues.username,
      password: formValues.password,
      state: formValues.status === 'activo',
      roles: formValues.roleIds
    }

    const request$ = this.isEditing
      ? this.userService.updateUser(requestPayLoad)
      : this.userService.createUser(requestPayLoad);

    request$.subscribe({
      next: (response) => {
        if (response.success) {
          alert(response.message);
          const modalElement = document.getElementById('createUserModal');
          if (modalElement) {
            bootstrap.Modal.getInstance(modalElement)?.hide();
          }

          this.createUserForm.reset({ status: 'activo' });
          const roleIdsArray = this.createUserForm.get('roleIds') as FormArray;
          roleIdsArray.clear();
          this.userCreated.emit();
        }
        else {
          alert(response.message);
        }

        this.isSubmitting = false;
      },
      error: () => {
        this.isSubmitting = false;
        alert(this.isEditing ? 'Error al actualizar usuario' : 'Error al crear usuario');
      }
    });
  }

  @Input() set userIdToEdit(id: number | null) {
    const roleIdsArray = this.createUserForm.get('roleIds') as FormArray;
    const passwordControl = this.createUserForm.get('password');

    if (id) {
      this.isEditing = true;
      roleIdsArray.clear();
      this.currentUserId = id;

      passwordControl?.clearValidators();
      passwordControl?.setValidators([Validators.minLength(6)]);
      passwordControl?.updateValueAndValidity();

      this.userService.getUserById(id).subscribe({
        next: (userData) => {
          this.createUserForm.patchValue({
            username: userData.usuariogu,
            password: userData.contrasena,
            status: userData.estadogu.toLowerCase() === 'activo' ? 'activo' : 'inactivo'
          });

          if (userData.roles && Array.isArray(userData.roles)) {
            const uniqueRoles = [...new Set(userData.roles)] as number[];
            uniqueRoles.forEach((roleId: number) => {
              roleIdsArray.push(new FormControl(roleId));
            });
          }

          this.createUserForm.updateValueAndValidity();
        },
        error: (err) => {
          alert('No se pudo cargar la información del usuario.');
        }
      });

    } else {
      this.isEditing = false;
      this.currentUserId = null;
      this.createUserForm.reset({ status: 'activo' });
      if (roleIdsArray) roleIdsArray.clear();

      passwordControl?.setValidators([Validators.required, Validators.minLength(6)]);
      passwordControl?.updateValueAndValidity();
    }
  }

  get f() { return this.createUserForm.controls; }
}
