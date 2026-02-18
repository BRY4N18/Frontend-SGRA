import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { buildHttpParams } from './http-params.helper';
import {environment} from '../../environments/environment';

export interface MyRequestRowDTO {
  requestId: number;
  requestDateTime: string;     // Backend field name
  subjectCode: string;
  subjectName: string;
  topic: string;
  teacherName: string;         // Backend field name
  sessionType: string;
  status: string;
  totalCount: number;
}

export interface StudentMyRequestsPageDTO {
  items: MyRequestRowDTO[];
  totalCount: number;
  page: number;
  size: number;
}

export interface StatusSummaryDTO {
  statusId: number;
  status: any;   // tu DTO dice estado jsonb en BD; aquí puede venir string u objeto
  total: number;
}

export interface CancelRequestResponseDTO {
  requestId: number;
  status: string;    // "CANCELLED" or "NOT_MODIFIED"
  message: string;
}

@Injectable({ providedIn: 'root' })
export class StudentMyRequestsService {
  private readonly baseUrl = environment.apiUrl;
  private readonly httpOptions = { withCredentials: true };

  constructor(private http: HttpClient) {}

  getMyRequests(filters: {
    periodId?: number;
    statusId?: number;
    sessionTypeId?: number;
    subjectId?: number;
    search?: string;
    page?: number;
    size?: number;
  }): Observable<StudentMyRequestsPageDTO> {

    const params = buildHttpParams({
      periodId: filters.periodId,
      statusId: filters.statusId,
      sessionTypeId: filters.sessionTypeId,
      subjectId: filters.subjectId,
      search: filters.search,
      page: filters.page ?? 1,
      size: filters.size ?? 10,
    });

    return this.http.get<StudentMyRequestsPageDTO>(
      `${this.baseUrl}/student/requests`,
      { ...this.httpOptions, params }
    ).pipe(catchError(this.handleError));
  }

  getMyRequestsSummary(periodId?: number): Observable<StatusSummaryDTO[]> {
    const params = buildHttpParams({ periodId });
    return this.http.get<StatusSummaryDTO[]>(
      `${this.baseUrl}/student/requests/summary`,
      { ...this.httpOptions, params }
    ).pipe(catchError(this.handleError));
  }

  cancelRequest(requestId: number): Observable<CancelRequestResponseDTO> {
    return this.http.put<CancelRequestResponseDTO>(
      `${this.baseUrl}/student/requests/${requestId}/cancel`,
      {},
      this.httpOptions
    ).pipe(catchError(this.handleError));
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    let message = 'Error al cargar la información';

    if (error.status === 0) message = 'No se pudo conectar con el servidor.';
    else if (error.status === 401) message = 'Sesión expirada. Inicia sesión nuevamente.';
    else if (error.status === 403) message = 'No tienes permisos para acceder.';
    else if (error.status === 409) message = error.error?.message || 'La solicitud no puede ser cancelada.';
    else if (error.error?.message) message = error.error.message;

    console.error('[StudentMyRequestsService] Error:', error);
    return throwError(() => new Error(message));
  }
}
