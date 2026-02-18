import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { RequestChipsDTO } from '../../models/student/request-chips.model';
import { buildHttpParams } from './http-params.helper';
import { SummaryRowDTO } from '../../models/student/request-summary.model';

/**
 * StudentDashboardService
 * Service for student dashboard data
 */
@Injectable({
  providedIn: 'root'
})
export class StudentDashboardService {
  private readonly baseUrl = environment.apiUrl;
  private readonly httpOptions = { withCredentials: true };

  constructor(private http: HttpClient) {}

  /**
   * Get request chips (counts by status) for dashboard
   * @param periodId Optional period filter
   */
  getMyRequestChips(periodId?: number): Observable<RequestChipsDTO> {
    const params = buildHttpParams({ periodId });
    return this.http.get<RequestChipsDTO>(
      `${this.baseUrl}/student/requests/chips`,
      { ...this.httpOptions, params }
    ).pipe(catchError(this.handleError));
  }

  getMyRequestsSummary(periodId?: number) {
    const params = buildHttpParams({ periodId });

    return this.http.get<SummaryRowDTO[]>(
      `${this.baseUrl}/student/requests/summary`,
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

