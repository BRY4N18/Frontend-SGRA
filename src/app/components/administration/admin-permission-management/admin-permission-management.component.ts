import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { GSchemaPermission } from '../../../models/administration/admin-permission-management/GSchemaPermission';
import { GPermissionMetrics } from '../../../models/administration/admin-permission-management/GPermissionMetrics';
import { GRoleSimple } from '../../../models/administration/admin-permission-management/GRoleSimple';
import { AdminPermissionManagement } from '../../../services/administration/admin-permission-management/admin-permission-management.service';
import { AdminPermissionKpisComponent } from './admin-permission-kpis/admin-permission-kpis.component';
import { AdminPermissionMatrixComponent } from './admin-permission-matrix/admin-permission-matrix.component';

@Component({
  selector: 'app-admin-permission-management',
  standalone: true,
  imports: [CommonModule, FormsModule, AdminPermissionKpisComponent, AdminPermissionMatrixComponent],
  templateUrl: './admin-permission-management.component.html',
  styleUrl: './admin-permission-management.component.css',
})
export class AdminPermissionManagementComponent implements OnInit{
  rolesList: GRoleSimple[] = [];
  selectedRole: String | null = null;

  metrics: GPermissionMetrics | null = null;
  schemas: GSchemaPermission[] = [];

  isSaving: boolean = false;

  private cdr = inject(ChangeDetectorRef);
  private permissionService = inject(AdminPermissionManagement);

  ngOnInit(): void {
    this.permissionService.getRolesForSelect().subscribe(roles => {
      this.rolesList = roles;
      this.cdr.detectChanges();
    });
  }

  onRoleChange(event: any): void {
    const idselect = Number((event.target as HTMLSelectElement).value);
    const roleid = this.rolesList.find(role => role.roleGId === idselect);
    const role = roleid?.roleG;

    if (!role) return;

    this.selectedRole = role;

    this.permissionService.getMetricsByRoleId(role).subscribe({

    });

    this.permissionService.getPermissionsByRole(role).subscribe(data => {
      this.schemas = data;
      this.cdr.detectChanges();
    });
  }

  saveConfiguration(): void {
    if (!this.selectedRole) return;

    this.isSaving = true;

    this.permissionService.savePermissions(this.selectedRole, this.schemas).subscribe({
      next: () => {
        this.isSaving = false;
        alert('Permisos guardados con éxito');
      },
      error: () => {
        this.isSaving = false;
        alert('Error al guardar los permisos.');
      }
    });
  }
}
