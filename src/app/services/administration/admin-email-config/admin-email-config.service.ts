import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { GEmailConfig, GEmailConfigCUD, GEmailConfigDetail } from '../../../models/administration/admin-email-config/GEmailConfig.model';
import { SpResponse } from '../../../models/administration/SpResponse.model';

@Injectable({
  providedIn: 'root',
})
export class AdminEmailConfigService {
  private http = inject(HttpClient);
  private readonly apiUrl = environment.apiUrl;

  getEmailConfigs(filter?: string, state?: boolean): Observable<GEmailConfig[]> {
    let params = new HttpParams();
    if (filter) {
      params = params.set('filter', filter);
    }
    if (state !== undefined && state !== null) {
      params = params.set('state', state);
    }
    return this.http.get<GEmailConfig[]>(`${this.apiUrl}/security/email-settings/list-emails`, { params });
  }

  getEmailConfigById(id: number): Observable<GEmailConfigDetail> {
    let params = new HttpParams();
    params = params.set('idEmailConfig', id);
    return this.http.get<GEmailConfigDetail>(`${this.apiUrl}/security/email-config/detail`, { params });
  }

  createEmailConfig(data: GEmailConfigCUD): Observable<SpResponse> {
    return this.http.post<SpResponse>(`${this.apiUrl}/security/email-settings/create-email`, data);
  }

  updateEmailConfig(data: GEmailConfigCUD): Observable<SpResponse> {
    return this.http.put<SpResponse>(`${this.apiUrl}/security/email-config/update`, data);
  }
}
