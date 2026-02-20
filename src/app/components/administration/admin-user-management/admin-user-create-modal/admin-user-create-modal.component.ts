import { Component, EventEmitter, OnInit, Output, inject } from '@angular/core';
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
      roleIdsArray.push(new FormControl(roleId));
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
      user: formValues.username,
      password: formValues.password,
      state: formValues.status === 'activo',
      roles: formValues.roleIds
    }

    this.userService.createUser(requestPayLoad).subscribe({
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
        alert('Error al crear usuario');
      }
    });
  }

  get f() { return this.createUserForm.controls; }
}
