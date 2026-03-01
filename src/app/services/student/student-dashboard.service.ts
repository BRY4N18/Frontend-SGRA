import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { buildHttpParams } from './http-params.helper';

/**
 * Respuesta de fn_sl_dashboard_estudiante_ui
 * Contadores: pendientes, aceptadas, próximas (programadas), realizadas (completadas)
 */
export interface StudentDashboardData {
  pending: number;
  accepted: number;
  upcoming: number;
  completed: number;
}

/**
 * StudentDashboardService
 * Consume GET /api/student/dashboard → fn_sl_dashboard_estudiante_ui
 */
@Injectable({
  providedIn: 'root'
})
export class StudentDashboardService {
  private readonly baseUrl = environment.apiUrl;
  private readonly httpOptions = { withCredentials: true };

  constructor(private http: HttpClient) {}

  /**
   * Obtiene los contadores del dashboard del estudiante.
   * Endpoint: GET /api/student/dashboard?periodId=
   * Función BD: fn_sl_dashboard_estudiante_ui(p_user_id, p_period_id)
   * @param periodId Periodo opcional; si es null/undefined usa el activo
   */
  getDashboard(periodId?: number): Observable<StudentDashboardData> {
    const params = buildHttpParams({ periodId });
    return this.http.get<StudentDashboardData>(
      `${this.baseUrl}/student/dashboard`,
      { ...this.httpOptions, params }
    ).pipe(catchError(this.handleError));
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    let message = 'Error al cargar los datos del dashboard';

    if (error.status === 0) {
      message = 'No se pudo conectar con el servidor.';
    } else if (error.status === 401) {
      message = 'Sesión expirada. Por favor, inicia sesión nuevamente.';
    } else if (error.status === 403) {
      message = 'No tienes permisos para acceder a esta información.';
    } else if (error.error?.message) {
      message = error.error.message;
    }

    console.error('[StudentDashboardService] Error:', error);
    return throwError(() => new Error(message));
  }
}

