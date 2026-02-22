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
  selectedRoleId: number | null = null;

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
    const roleFound = this.rolesList.find(role => role.roleGId === idselect);
    const role = roleFound?.roleG;

    if (!role) return;

    this.selectedRoleId = roleFound.roleGId;
    this.selectedRole = roleFound.roleG;

    this.permissionService.getPermissionsByRole(role).subscribe(data => {
      this.schemas = data;
      this.cdr.detectChanges();
      this.calculateMetrics();
    });
  }

  calculateMetrics(): void {
    let schemasCount = 0;
    let tablesWithAccess = 0;
    let fullAccess = 0;

    this.schemas.forEach(schema => {
      let schemaHasAccess = false;

      schema.tablas.forEach(table => {
        const hasAny = table.ppselect || table.ppinsert || table.ppupdate || table.ppdelete;
        const hasAll = table.ppselect && table.ppinsert && table.ppupdate && table.ppdelete;

        if (hasAny) {
          schemaHasAccess = true;
          tablesWithAccess++;
        }
        if (hasAll) {
          fullAccess++;
        }
      });

      if (schemaHasAccess) {
        schemasCount++;
      }
    });

    this.metrics = {
      totalSchemas: schemasCount,
      totalTablesWithAccess: tablesWithAccess,
      fullAccessTables: fullAccess
    };
    this.cdr.detectChanges();
  }

  saveConfiguration(): void {
    if (!this.selectedRole || !this.selectedRoleId) return;

    this.permissionService.savePermissions(this.selectedRoleId, this.schemas).subscribe({
      next: () => {
        alert('Permisos guardados con éxito');
        this.cdr.detectChanges();
      },
      error: () => {
        alert('Error al guardar los permisos.');
        this.cdr.detectChanges();
      }
    });
  }
}
