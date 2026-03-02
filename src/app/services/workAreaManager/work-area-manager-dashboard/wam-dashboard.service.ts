import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { environment } from '../../../environments/environment';
import { WamKpiCard, WamKpiMetric, WamQuickAction } from '../../../models/workAreaManager/work-area-manager-dashboard';

@Injectable({
  providedIn: 'root',
})
export class WamDashboardService {
  private http = inject(HttpClient);
  private readonly apiUrl = environment.apiUrl;

  getKpis(): Observable<WamKpiCard[]> {
    return this.http.get<WamKpiMetric>(`${this.apiUrl}/work-area-management/kpi-dashboard`).pipe(
      map((data: WamKpiMetric) => [
        { id: 1, value: data.registeredSpaces, label: 'Espacios Registrados', subtitle: 'Espacios disponibles',    icon: 'bi-building',     theme: 'success' },
        { id: 2, value: data.pendingRequests,   label: 'Solicitudes Pendientes', subtitle: 'Esperando revisión',    icon: 'bi-clock-history', theme: 'warning' },
        { id: 3, value: data.approvedRequests,  label: 'Solicitudes Aprobadas', subtitle: 'Solicitudes aceptadas',  icon: 'bi-check-circle', theme: 'primary' },
        { id: 4, value: data.rejectedRequests,  label: 'Solicitudes Rechazadas', subtitle: 'Solicitudes denegadas', icon: 'bi-x-circle',     theme: 'danger' },
      ])
    );
  }

  getQuickActions(): WamQuickAction[] {
    return [
      {
        id: 1,
        icon: 'bi-clipboard-check',
        title: 'Gestionar Solicitudes',
        description: 'Revisa, aprueba o rechaza las solicitudes presenciales asignadas.',
        linkText: 'Ir a solicitudes',
        route: '/workAreaManagement/management-requests',
      },
      {
        id: 2,
        icon: 'bi-boxes',
        title: 'Ver Dashboard',
        description: 'Consulta las métricas y el estado general de tu área de trabajo.',
        linkText: 'Ver resumen',
        route: '/workAreaManagement/dashboard',
      },
    ];
  }
}
