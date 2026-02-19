import { Injectable, inject } from '@angular/core';
import { Observable, of} from 'rxjs';
import { GUser } from '../../../models/administration/admin-user-management/GUser.model';
import { GRoleSimple } from '../../../models/administration/admin-permission-management/GRoleSimple';
import { HttpClient , HttpParams} from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AdminUserManagementService {
  constructor() { }

  private http = inject(HttpClient);
  private readonly apiUrl = environment.apiUrl;

  getUsers(): Observable<GUser[]> {
    const mockUsers: GUser[] = [
      { id: 1, username: 'admin', role: 'Administrador', status: 'activo', createdAt: new Date('2023-12-31') },
      { id: 2,  username: 'jperez',role: 'Docente', status: 'activo', createdAt: new Date('2024-02-14') },
      { id: 3, username: 'mgonzalez', role: 'Estudiante', status: 'inactivo', createdAt: new Date('2024-03-19') },
      { id: 4, username: 'clopez', role: 'Coordinador', status: 'activo', createdAt: new Date('2024-04-01') }
    ];
    return of(mockUsers);
  }

  getRolesForSelect(): Observable<GRoleSimple[]> {
      return this.http.get<GRoleSimple[]>(`${this.apiUrl}/security/role-managements/list-roles-combo`);
  }

  createUser(userData: any): Observable<boolean> {
    console.log('Enviando al backend este JSON:', userData);
    return this.http.post<boolean>(`${this.apiUrl}/security/user-managements/create-user`, userData);
  }
}
