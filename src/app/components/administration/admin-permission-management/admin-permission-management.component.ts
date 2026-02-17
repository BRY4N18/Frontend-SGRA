import { Component, OnInit, inject } from '@angular/core';
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
  selectedRoleId: number | null = null;

  metrics: GPermissionMetrics | null = null;
  schemas: GSchemaPermission[] = [];

  isLoadingData: boolean = false;
  isSaving: boolean = false;

  private permissionService = inject(AdminPermissionManagement);

  ngOnInit(): void {
    this.permissionService.getRolesForSelect().subscribe(roles => {
      this.rolesList = roles;
    });
  }

  onRoleChange(event: any): void {
    const roleId = Number(event.target.value);
    if (!roleId) return;

    this.selectedRoleId = roleId;
    this.isLoadingData = true;

    this.permissionService.getMetricsByRoleId(roleId).subscribe(data => this.metrics = data);

    this.permissionService.getPermissionsByRoleId(roleId).subscribe(data => {
      this.schemas = data;
      this.isLoadingData = false;
    });
  }

  saveConfiguration(): void {
    if (!this.selectedRoleId) return;

    this.isSaving = true;

    this.permissionService.savePermissions(this.selectedRoleId, this.schemas).subscribe({
      next: () => {
        this.isSaving = false;
        alert('Permisos guardados con éxito en la base de datos.');
      },
      error: () => {
        this.isSaving = false;
        alert('Error al guardar los permisos.');
      }
    });
  }
}
