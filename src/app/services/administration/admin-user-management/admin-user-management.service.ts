import { Injectable, inject } from '@angular/core';
import { Observable, of} from 'rxjs';
import { GUser } from '../../../models/administration/admin-user-management/GUser.model';
import { GRoleSimple } from '../../../models/administration/admin-permission-management/GRoleSimple';
import { HttpClient , HttpParams} from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { GUserCUD } from '../../../models/administration/admin-user-management/GUser.model';
import { SpResponse } from '../../../models/administration/SpResponse.model';

@Injectable({
  providedIn: 'root',
})
export class AdminUserManagementService {
  constructor() { }

  private http = inject(HttpClient);
  private readonly apiUrl = environment.apiUrl;

  getUsers(filter?: string, date?: string, state?: boolean): Observable<GUser[]> {
    let params = new HttpParams();
    let apiFinish = "${this.apiUrl}/security/user-managements/list-userG";

    if(filter){
      params.set('filter',filter);
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

  createUser(userData: GUserCUD): Observable<SpResponse> {
    console.log('Enviando al backend este JSON:', userData);
    return this.http.post<SpResponse>(`${this.apiUrl}/security/user-managements/create-user`, userData);
  }
}
