import { Injectable, inject } from '@angular/core';
import { map, Observable, of } from 'rxjs';
import { GSchemaPermission } from '../../../models/administration/admin-permission-management/GSchemaPermission';
import { GPermissionMetrics } from '../../../models/administration/admin-permission-management/GPermissionMetrics';
import { GRoleSimple } from '../../../models/administration/admin-permission-management/GRoleSimple';
import { HttpClient , HttpParams} from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AdminPermissionManagement {

  private http = inject(HttpClient);
  private readonly apiUrl = environment.apiUrl;

  getRolesForSelect(): Observable<GRoleSimple[]> {
    return this.http.get<GRoleSimple[]>(`${this.apiUrl}/security/role-managements/list-roles-combo`);
  }

  getMetricsByRoleId(role: String): Observable<GPermissionMetrics> {
    const metrics: GPermissionMetrics = role === 'admin'
      ? { totalSchemas: 3, totalTablesWithAccess: 12, fullAccessTables: 12 }
      : { totalSchemas: 2, totalTablesWithAccess: 5, fullAccessTables: 1 };

    return of(metrics);
  }

  getPermissionsByRole(role: string): Observable<GSchemaPermission[]> {
    let params = new HttpParams().set('role',role);

    return this.http.get<any[]>(`${this.apiUrl}/security/module-managements/list-modules-permisis`,{ params }).pipe(
      map(datosPlanos => {
        const agrupados = datosPlanos.reduce((acumulador: GSchemaPermission[], tablaActual) =>{

          let esquemaExistente = acumulador.find(e => e.pesquema === tablaActual.pesquema);

          if(!esquemaExistente){
            esquemaExistente = { pesquema: tablaActual.pesquema, tablas: []};
            acumulador.push(esquemaExistente);
          }

          esquemaExistente.tablas.push(tablaActual);

          return acumulador;
        }, []);
        return agrupados;
      })
    );
  }

  savePermissions(roleId: number, permissions: GSchemaPermission[]): Observable<any> {
    const tablasPlanas = permissions.flatMap(schema => schema.tablas);

    const permisosLimpios = tablasPlanas.map(table => ({
      pesquematabla: table.pesquematabla,
      ppselect: table.ppselect,
      ppinsert: table.ppinsert,
      ppupdate: table.ppupdate,
      ppdelete: table.ppdelete
    }));

    const payload = {
      roleId: roleId,
      permissions: permisosLimpios
    };

    console.log('JSON a enviar al backend:', payload);

    return this.http.put(`${this.apiUrl}/security/module-managements/update-permissions`, payload);
  }
}
