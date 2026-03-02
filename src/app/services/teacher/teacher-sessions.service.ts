import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import {
  VirtualLinkBodyDTO,
  RegisterAttendanceBodyDTO,
  ApiActionResponseDTO,
  TeacherHistoryPageDTO,
} from '../../models/teacher/teacher-request.model';

@Injectable({ providedIn: 'root' })
export class TeacherSessionsService {
  private readonly baseUrl = environment.apiUrl;
  private readonly opts = { withCredentials: true };

  constructor(private http: HttpClient) {}

  /** RF13 – Register or update virtual meeting link */
  setVirtualLink(scheduledId: number, body: VirtualLinkBodyDTO): Observable<ApiActionResponseDTO> {
    return this.http.put<ApiActionResponseDTO>(
      `${this.baseUrl}/teacher/sessions/${scheduledId}/virtual-link`,
      body,
      this.opts
    ).pipe(catchError(this.handleError));
  }

  /** RF16 – Mark attendance for session participants */
  registerAttendance(scheduledId: number, body: RegisterAttendanceBodyDTO): Observable<ApiActionResponseDTO> {
    return this.http.post<ApiActionResponseDTO>(
      `${this.baseUrl}/teacher/sessions/${scheduledId}/attendance`,
      body,
      this.opts
    ).pipe(catchError(this.handleError));
  }

  /** RF17 – Register session result and optionally attach resource files */
  registerPerformed(scheduledId: number, observation: string, duration: string, files: File[]): Observable<ApiActionResponseDTO> {
    const form = new FormData();
    form.append('observation', observation);
    form.append('duration', duration);
    files.forEach(f => form.append('files[]', f, f.name));
    return this.http.post<ApiActionResponseDTO>(
      `${this.baseUrl}/teacher/sessions/${scheduledId}/performed`,
      form,
      { withCredentials: true }
    ).pipe(catchError(this.handleError));
  }

  /** RF18 – Paginated session history */
  getHistory(page = 1, size = 10): Observable<TeacherHistoryPageDTO> {
    const params = new HttpParams()
      .set('page', String(page))
      .set('size', String(size));
    return this.http.get<TeacherHistoryPageDTO>(
      `${this.baseUrl}/teacher/history/sessions`,
      { ...this.opts, params }
    ).pipe(catchError(this.handleError));
  }

  private handleError = (error: HttpErrorResponse): Observable<never> => {
    let message = 'Error al procesar la sesión';
    if (error.status === 0) message = 'No se pudo conectar con el servidor.';
    else if (error.status === 401) message = 'Sesión expirada. Inicia sesión nuevamente.';
    else if (error.status === 403) message = 'No tienes permisos para esta acción.';
    else if (error.status === 400) message = error.error?.message || 'Datos inválidos.';
    else if (error.status === 409) message = error.error?.message || 'Conflicto de estado.';
    else if (error.error?.message) message = error.error.message;
    console.error('[TeacherSessionsService]', error);
    return throwError(() => new Error(message));
  };
}
