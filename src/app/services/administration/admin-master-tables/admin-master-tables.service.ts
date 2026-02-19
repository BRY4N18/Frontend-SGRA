import { inject, Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { GCatalog } from '../../../models/administration/admin-master-tables/GCatalog';
import { GCatalogRecord } from '../../../models/administration/admin-master-tables/GCatalogRecord';
import { GCatalogMetrics } from './../../../models/administration/admin-master-tables/GCatalogMetrics';
import { HttpClient } from '@angular/common/http';
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
    let records: GCatalogRecord[] = [];

    if (pschematable === 'general.tbinstituciones') {
      records = [
        { id: 1, genericName: 'Universidad Técnica Estatal de Quevedo', status: 'activo' },
        { id: 2, genericName: 'Instituto Tecnológico Superior', status: 'inactivo' }
      ];
    } else {
      records = [
        { id: 1, genericName: 'Facultad de Ciencias de la Computación', status: 'activo' },
        { id: 2, genericName: 'Facultad de Ciencias Empresariales', status: 'activo' },
        { id: 3, genericName: 'Facultad de Ciencias Ambientales', status: 'activo' }
      ];
    }
    return of(records);
  }

  getMetrics(): Observable<GCatalogMetrics> {
    return of({ totalCatalogs: 12, activeRecords: 145, totalRecords: 156 });
  }
}
