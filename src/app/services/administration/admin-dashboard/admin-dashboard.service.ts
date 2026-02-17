import { Injectable } from '@angular/core';
import { Observable, of, delay } from 'rxjs';
import { KpiMetric } from '../../../models/administration/admin-dashboard/KpiMetric.model';
import { AuditLog } from '../../../models/administration/admin-dashboard/AuditLog.model';
import { QuickAction } from '../../../models/administration/admin-dashboard/QuickAction.model';

@Injectable({
  providedIn: 'root',
})
export class AdminDashboardService {

  constructor() { }


  getKpis(): Observable<KpiMetric[]> {
    const kpis: KpiMetric[] = [
      { id: '1', value: 0, label: 'Usuarios activos', icon: 'bi-people', theme: 'blue' },
      { id: '2', value: 0, label: 'Roles vigentes', icon: 'bi-shield-check', theme: 'purple' },
      { id: '3', value: 0, label: 'Modulos con permiso', icon: 'bi-grid', theme: 'green' },
      { id: '4', value: 0, label: 'Cuentas inactivas', icon: 'bi-person-exclamation', theme: 'orange' }
    ];
    return of(kpis);
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
