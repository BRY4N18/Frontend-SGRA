import { Injectable, inject } from '@angular/core';
import { Observable, of} from 'rxjs';
import { GRole } from '../../../models/administration/admin-role-management/GRole.model';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AdminRoleManagementService {

  private http = inject(HttpClient);
  private readonly apiUrl = environment.apiUrl;

  getRoles(filter: string = '', state: boolean = true): Observable<GRole[]> {
    let params = new HttpParams().set('state',state);
    if(filter) params = params.set('filter',filter);

    return this.http.get<GRole[]>(`${this.apiUrl}/security/role-managements/list-roles`,{ params });
  }

  createRole(roleData: any): Observable<boolean> {
    console.log('Enviando rol al backend:', roleData);
    return of(true);
  }
}
