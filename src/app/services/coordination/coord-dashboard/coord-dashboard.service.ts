import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, of } from 'rxjs';
import { environment } from '../../../environments/environment';
import { CoordinationDashboard } from '../../../models/coordination/coord-dashboard';

const EMPTY_DASHBOARD: CoordinationDashboard = {
  kpis: { totalSolicitudes: 0, pendientes: 0, gestionadas: 0 },
  asistencia: {
    totalSesionesRegistradas: 0,
    totalAsistencias: 0,
    totalInasistencias: 0,
    porcentajeAsistencia: 0,
    tasaInasistencia: 0
  },
  solicitudesPorMateria: [],
  modalidades: []
};

@Injectable({
  providedIn: 'root'
})
export class CoordDashboardService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = `${environment.apiUrl}/coordination/dashboard`;

  getDashboard(): Observable<CoordinationDashboard> {
    return this.http.get<CoordinationDashboard>(this.apiUrl).pipe(
      catchError(() => of(EMPTY_DASHBOARD))
    );
  }
}
