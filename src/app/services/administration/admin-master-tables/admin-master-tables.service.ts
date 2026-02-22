import { inject, Injectable } from '@angular/core';
import { map, Observable, of } from 'rxjs';
import { GCatalog } from '../../../models/administration/admin-master-tables/GCatalog';
import { GCatalogRecord } from '../../../models/administration/admin-master-tables/GCatalogRecord';
import { GCatalogMetrics } from './../../../models/administration/admin-master-tables/GCatalogMetrics';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AdminMasterTablesService {
  constructor() { }

  private http = inject(HttpClient);
  private readonly apiUrl = environment.apiUrl;

  getCatalogs(): Observable<GCatalog[]> {
    return this.http.get<GCatalog[]>(`${this.apiUrl}/security/module-managements/list-master-tables`);
  }

  getRecordsByCatalog(pschematable: string): Observable<GCatalogRecord[]> {
    let params = new HttpParams().set('schemaTable',pschematable);
    return this.http.get<any[]>(`${this.apiUrl}/security/module-managements/list-data-master-table`, { params });
  }

  getMetrics(): Observable<GCatalogMetrics> {
    return of({ totalCatalogs: 12, activeRecords: 145, totalRecords: 156 });
  }

  createRecord(schemaTable: string, data: any): Observable<any> {
    let params = new HttpParams().set('schemaTable', schemaTable);
    return this.http.post<any>(`${this.apiUrl}/security/module-managements/create-master-record`, data, { params });
  }

  updateRecord(schemaTable: string, data: any): Observable<any> {
    let params = new HttpParams().set('schemaTable', schemaTable);
    return this.http.put<any>(`${this.apiUrl}/security/module-managements/update-master-record`, data, { params });
  }
}
