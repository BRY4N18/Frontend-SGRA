import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { GRole } from '../../../models/administration/admin-role-management/GRole.model';

@Injectable({
  providedIn: 'root',
})
export class AdminRoleManagementService {
  constructor() { }

  getRoles(): Observable<GRole[]> {
    const mockRoles: GRole[] = [
      { id: 1, name: 'Administrador', description: 'Acceso completo al sistema', permissionsCount: 3, status: 'activo', createdAt: new Date('2023-12-31') },
      { id: 2, name: 'Docente', description: 'Acceso a gestión académica', permissionsCount: 2, status: 'activo', createdAt: new Date('2023-12-31') },
      { id: 3, name: 'Estudiante', description: 'Acceso básico', permissionsCount: 1, status: 'activo', createdAt: new Date('2023-12-31') },
      { id: 4, name: 'Coordinador', description: 'Gestión de espacios y reportes', permissionsCount: 9, status: 'inactivo', createdAt: new Date('2024-01-15') }
    ];
    return of(mockRoles);
  }

  createRole(roleData: any): Observable<boolean> {
    console.log('Enviando rol al backend:', roleData);
    return of(true);
  }
}
