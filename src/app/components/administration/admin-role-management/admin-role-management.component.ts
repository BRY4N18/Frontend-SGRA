import { Component, OnInit, inject} from '@angular/core';
import { CommonModule } from '@angular/common';
import { GRole } from '../../../models/administration/admin-role-management/GRole.model';
import { AdminRoleManagementService } from '../../../services/administration/admin-role-management/admin-role-management.service';
import { AdminRoleTableComponent } from './admin-role-table/admin-role-table.component';
import { AdminRoleCreateModalComponent } from './admin-role-create-modal/admin-role-create-modal.component';

declare var bootstrap: any;

@Component({
  selector: 'app-admin-role-management',
  standalone: true,
  imports: [CommonModule, AdminRoleTableComponent, AdminRoleCreateModalComponent],
  templateUrl: './admin-role-management.component.html',
  styleUrl: './admin-role-management.component.css',
})
export class AdminRoleManagementComponent implements OnInit{
  roles: GRole[] = [];
  isLoading: boolean = true;

  private roleService = inject(AdminRoleManagementService);

  ngOnInit(): void {
    this.loadRoles();
  }

  loadRoles(): void {
    this.isLoading = true;
    this.roleService.getRoles().subscribe({
      next: (data) => {
        this.roles = data;
        this.isLoading = false;
      },
      error: (err) => console.error('Error', err)
    });
  }

  openModal(): void {
    const modalElement = document.getElementById('createRoleModal');
    if (modalElement) {
      const modal = new bootstrap.Modal(modalElement);
      modal.show();
    }
  }
}
