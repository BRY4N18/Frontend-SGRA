import { Injectable } from '@angular/core';
import { Observable, of} from 'rxjs';
import { GUser } from '../../../models/administration/admin-user-management/GUser.model';
import { RoleSelect } from '../../../models/administration/admin-user-management/RoleSelect.model';

@Injectable({
  providedIn: 'root',
})
export class AdminUserManagementService {
  constructor() { }

  getUsers(): Observable<GUser[]> {
    const mockUsers: GUser[] = [
      { id: 1, username: 'admin', role: 'Administrador', status: 'activo', createdAt: new Date('2023-12-31') },
      { id: 2,  username: 'jperez',role: 'Docente', status: 'activo', createdAt: new Date('2024-02-14') },
      { id: 3, username: 'mgonzalez', role: 'Estudiante', status: 'inactivo', createdAt: new Date('2024-03-19') },
      { id: 4, username: 'clopez', role: 'Coordinador', status: 'activo', createdAt: new Date('2024-04-01') }
    ];
    return of(mockUsers);
  }

  getRolesForSelect(): Observable<RoleSelect[]> {
    const mockRoles: RoleSelect[] = [
      { id: 1, name: 'Administrador' },
      { id: 2, name: 'Coordinador' },
      { id: 3, name: 'Docente' },
      { id: 4, name: 'Estudiante' }
    ];
    return of(mockRoles);
  }

  createUser(userData: any): Observable<boolean> {
    console.log('Enviando al backend:', userData);
    return of(true);
  }
}
