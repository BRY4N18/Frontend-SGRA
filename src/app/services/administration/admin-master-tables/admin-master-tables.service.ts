import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { GCatalog } from '../../../models/administration/admin-master-tables/GCatalog';
import { GCatalogRecord } from '../../../models/administration/admin-master-tables/GCatalogRecord';
import { GCatalogMetrics } from './../../../models/administration/admin-master-tables/GCatalogMetrics';

@Injectable({
  providedIn: 'root',
})
export class AdminMasterTablesService {
  constructor() { }

  getCatalogs(): Observable<GCatalog[]> {
    const catalogs: GCatalog[] = [
      { pschematable: 'general.tbinstituciones', pname: 'Instituciones', icon: 'bi-building', recordCount: 2 },
      { pschematable: 'academico.tbareas', pname: 'Áreas Académicas', icon: 'bi-book', recordCount: 4 },
      { pschematable: 'academico.tbcarreras', pname: 'Carreras', icon: 'bi-mortarboard', recordCount: 3 }
    ];
    return of(catalogs);
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
