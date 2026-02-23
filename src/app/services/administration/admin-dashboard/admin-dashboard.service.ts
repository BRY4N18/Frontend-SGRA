import { Injectable, inject } from '@angular/core';
import { Observable, map, of} from 'rxjs';
import { KpiMetric, KpiCard } from '../../../models/administration/admin-dashboard/KpiMetric.model';
import { AuditLog } from '../../../models/administration/admin-dashboard/AuditLog.model';
import { QuickAction } from '../../../models/administration/admin-dashboard/QuickAction.model';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AdminDashboardService {

  private http = inject(HttpClient);
  private readonly apiUrl = environment.apiUrl;

  getKpis(): Observable<KpiCard[]> {
    return this.http.get<KpiMetric>(`${this.apiUrl}/security/user-role-managements/kpi-dashboard-management`).pipe(
      map((data: KpiMetric) => {
        return [
          { id: '1', value: data.userActive, label: 'Usuarios Activos', icon: 'bi-people', theme: 'primary' },
          { id: '2', value: data.userIncative, label: 'Usuarios Inactivos', icon: 'bi-person-exclamation', theme: 'danger' },
          { id: '3', value: data.rolesActive, label: 'Roles Activos', icon: 'bi-shield-check', theme: 'success' },
          { id: '4', value: data.rolesInactive, label: 'Roles Inactivos', icon: 'bi-shield-x', theme: 'secondary' }
        ];
      })
    );
  }

  getRecentLogs(): Observable<AuditLog[]> {
    const logs: AuditLog[] = [
      { id: 1, action: 'Cambio de rol: Docente -> Coordinador', user: 'Daniela P.', timeAgo: 'Hace 2 horas', status: 'Aprobado' },
      { id: 2, action: 'Reset de clave solicitado', user: 'Mario C.', timeAgo: 'Hace 1 día', status: 'Completado' },
      { id: 3, action: 'Permisos del modulo Refuerzos ajustados', user: 'Rol: Coordinador', timeAgo: 'Hace 2 días', status: 'En revision' }
    ];
    return of(logs);
  }

  getQuickActions(): QuickAction[] {
    return [
      { id: 'qa1', title: 'Gestion de usuarios', icon: 'bi-people', route: '/admin/users' },
      { id: 'qa2', title: 'Roles y niveles', icon: 'bi-shield-check', route: '/admin/roles' },
      { id: 'qa3', title: 'Permisos por modulo', icon: 'bi-key', route: '/admin/permissions' },
      { id: 'qa4', title: 'Activar accesos', icon: 'bi-person-check', route: '/admin/users' }
    ];
  }
}
