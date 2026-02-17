import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { GSchemaPermission } from '../../../models/administration/admin-permission-management/GSchemaPermission';
import { GPermissionMetrics } from '../../../models/administration/admin-permission-management/GPermissionMetrics';
import { GRoleSimple } from '../../../models/administration/admin-permission-management/GRoleSimple';

@Injectable({
  providedIn: 'root',
})
export class AdminPermissionManagement {
  constructor() { }

  getRolesForSelect(): Observable<GRoleSimple[]> {
    const roles: GRoleSimple[] = [
      { id: 1, name: 'Administrador' },
      { id: 2, name: 'Docente' },
      { id: 3, name: 'Coordinador' }
    ];
    return of(roles);
  }

  getMetricsByRoleId(roleId: number): Observable<GPermissionMetrics> {
    const metrics: GPermissionMetrics = roleId === 1
      ? { totalSchemas: 3, totalTablesWithAccess: 12, fullAccessTables: 12 }
      : { totalSchemas: 2, totalTablesWithAccess: 5, fullAccessTables: 1 };

    return of(metrics);
  }

  getPermissionsByRoleId(roleId: number): Observable<GSchemaPermission[]> {
    const isAdmin = roleId === 1;

    const schemas: GSchemaPermission[] = [
      {
        schemaName: 'Seguridad',
        tables: [
          { tableName: 'Usuarios', description: 'Gestión de credenciales y acceso al sistema.', canRead: true, canCreate: isAdmin, canUpdate: isAdmin, canDelete: isAdmin },
          { tableName: 'Roles', description: 'Definición de niveles de acceso y perfiles.', canRead: true, canCreate: isAdmin, canUpdate: isAdmin, canDelete: isAdmin }
        ]
      },
      {
        schemaName: 'Académico',
        tables: [
          { tableName: 'Asignaturas', description: 'Catálogo de materias, temarios y sílabos.', canRead: true, canCreate: false, canUpdate: isAdmin, canDelete: false },
          { tableName: 'Periodos', description: 'Configuración de los ciclos académicos vigentes.', canRead: true, canCreate: isAdmin, canUpdate: isAdmin, canDelete: false }
        ]
      }
    ];

    return of(schemas);
  }

  savePermissions(roleId: number, permissions: GSchemaPermission[]): Observable<boolean> {
    console.log(`Guardando permisos para el rol ${roleId}:`, permissions);
    return of(true);
  }
}
