import { Injectable, inject } from '@angular/core';
import { Observable, of} from 'rxjs';
import { GUser, GUserDetail } from '../../../models/administration/admin-user-management/GUser.model';
import { GRoleSimple } from '../../../models/administration/admin-permission-management/GRoleSimple';
import { HttpClient , HttpParams} from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { GUserCUD } from '../../../models/administration/admin-user-management/GUser.model';
import { SpResponse } from '../../../models/administration/SpResponse.model';

@Injectable({
  providedIn: 'root',
})
export class AdminUserManagementService {
  private http = inject(HttpClient);
  private readonly apiUrl = environment.apiUrl;

  getUsers(filter?: string, date?: string, state?: boolean): Observable<GUser[]> {
    let params = new HttpParams();

    if(filter){
      params = params.set('filter',filter);
    }

    if(date) {
      params = params.set('date',date);
    }

    if(state){
      params = params.set('state',state);
    }

    return this.http.get<GUser[]>(`${this.apiUrl}/security/user-managements/list-userG`,{ params });
  }

  getRolesForSelect(): Observable<GRoleSimple[]> {
      return this.http.get<GRoleSimple[]>(`${this.apiUrl}/security/role-managements/list-roles-combo`);
  }

  getUserById(userId: number): Observable<GUserDetail> {
    let params = new HttpParams();
    params = params.set('idUser',userId);
    return this.http.get<any>(`${this.apiUrl}/security/user-managements/list-userG-update`,{ params });
  }

  createUser(userData: GUserCUD): Observable<SpResponse> {
    return this.http.post<SpResponse>(`${this.apiUrl}/security/user-managements/create-user`, userData);
  }

  updateUser(userData: GUserCUD): Observable<SpResponse> {
    console.log('Enviando actualización al backend:', userData);
    return this.http.put<SpResponse>(`${this.apiUrl}/security/security/user-managements/update-user`, userData);
  }
}
