import { Injectable, inject } from '@angular/core';
import { Observable} from 'rxjs';
import { GRole, GRoleCUD } from '../../../models/administration/admin-role-management/GRole.model';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { SpResponse } from '../../../models/administration/SpResponse.model';
import { GRoleApp, GRoleServer, GRolesAppServerCUD } from '../../../models/administration/admin-role-management/GAppRoleServers';

@Injectable({
  providedIn: 'root',
})
export class AdminRoleManagementService {

  private http = inject(HttpClient);
  private readonly apiUrl = environment.apiUrl;

  getRoles(filter: string = '', state?: boolean): Observable<GRole[]> {
    let params = new HttpParams();
    if(filter){
      params = params.set('filter',filter);
    }
    if(state !== undefined && state !== null) {
      params = params.set('state', state);
    }
    console.log(params);
    return this.http.get<GRole[]>(`${this.apiUrl}/security/role-managements/list-roles`,{ params });
  }

  createRole(roleData: GRoleCUD): Observable<SpResponse> {
    return this.http.post<SpResponse>(`${this.apiUrl}/security/role-managements/create-role`, roleData);
  }

  updateRole(roleData: GRoleCUD): Observable<SpResponse> {
    console.log(roleData);
    return this.http.put<SpResponse>(`${this.apiUrl}/security/role-managements/update-role`, roleData);
  }

  getRoleServerMatrix(): Observable<GRoleApp[]> {
    return this.http.get<GRoleApp[]>(`${this.apiUrl}/security/role-managements/list-rolesgroles-conexion`);
  }

  updateServerMappings(payload: GRolesAppServerCUD[]): Observable<SpResponse> {
    return this.http.put<SpResponse>(`${this.apiUrl}/security/role-management-role/update-assignment`, payload);
  }
}
