import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { buildHttpParams } from './http-params.helper';
import { environment } from '../../environments/environment';

// DTOs matching backend exactly
export interface HistoryRequestItemDTO {
  requestId: number;
  createdAt: string;
  subjectName: string;
  syllabusName: string;
  unit: number;
  teacherName: string;
  sessionType: string;
  statusId: number;
  statusName: string;
  reason: string;
  requestedDay: number;
}

export interface HistoryRequestsPageDTO {
  items: HistoryRequestItemDTO[];
  totalCount: number;
  page: number;
  size: number;
}

export interface HistorySessionItemDTO {
  completedSessionId: number;
  attended: boolean;
  duration: string;
  notes: string;
  requestId: number;
  requestDateTime: string;
  subjectName: string;
  syllabusName: string;
  unit: number;
  teacherName: string;
  sessionType: string;
}

export interface HistorySessionsPageDTO {
  items: HistorySessionItemDTO[];
  totalCount: number;
  page: number;
  size: number;
}

@Injectable({ providedIn: 'root' })
export class StudentHistoryService {
  private readonly baseUrl = environment.apiUrl;
  private readonly httpOptions = { withCredentials: true };

  constructor(private http: HttpClient) {}

  /**
   * GET /api/student/history/requests
   */
  getHistoryRequests(filters: {
    periodId?: number;
    statusId?: number;
    page?: number;
    size?: number;
  } = {}): Observable<HistoryRequestsPageDTO> {
    const params = buildHttpParams({
      periodId: filters.periodId,
      statusId: filters.statusId,
      page: filters.page ?? 1,
      size: filters.size ?? 10
    });

    return this.http.get<HistoryRequestsPageDTO>(
      `${this.baseUrl}/student/history/requests`,
      { ...this.httpOptions, params }
    ).pipe(catchError(this.handleError));
  }

  /**
   * GET /api/student/history/sessions
   */
  getHistorySessions(filters: {
    onlyAttended?: boolean;
    page?: number;
    size?: number;
  } = {}): Observable<HistorySessionsPageDTO> {
    const params = buildHttpParams({
      onlyAttended: filters.onlyAttended,
      page: filters.page ?? 1,
      size: filters.size ?? 10
    });

    return this.http.get<HistorySessionsPageDTO>(
      `${this.baseUrl}/student/history/sessions`,
      { ...this.httpOptions, params }
    ).pipe(catchError(this.handleError));
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    let message = 'Error al cargar el historial';

    if (error.status === 0) message = 'No se pudo conectar con el servidor.';
    else if (error.status === 401) message = 'Sesión expirada. Inicia sesión nuevamente.';
    else if (error.status === 403) message = 'No tienes permisos para acceder.';
    else if (error.error?.message) message = error.error.message;

    console.error('[StudentHistoryService] Error:', error);
    return throwError(() => new Error(message));
  }
}

