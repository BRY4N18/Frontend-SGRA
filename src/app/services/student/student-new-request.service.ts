import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import {
  SubjectItem,
  SyllabusItem,
  TeacherItem,
  ModalityItem,
  SessionTypeItem,
  TimeSlotItem,
  AvailableTimeSlotItem,
  ClassmateItem
} from '../../models/student/catalog.model';
import {
  CreateRequestPayload,
  CreateRequestResponse,
  RequestPreviewPayload,
  RequestPreviewResponse
} from '../../models/student/request.model';

/**
 * StudentNewRequestService
 * Service for creating new reinforcement requests
 */
@Injectable({
  providedIn: 'root'
})
export class StudentNewRequestService {
  private readonly baseUrl = environment.apiUrl;
  private readonly httpOptions = { withCredentials: true };

  constructor(private http: HttpClient) {}

  // ==================== CATALOGS ====================

  getSubjects(): Observable<SubjectItem[]> {
    return this.http.get<SubjectItem[]>(
      `${this.baseUrl}/student/catalogs/subjects`,
      this.httpOptions
    ).pipe(catchError(this.handleError));
  }

  getSyllabiBySubject(subjectId: number): Observable<SyllabusItem[]> {
    return this.http.get<SyllabusItem[]>(
      `${this.baseUrl}/student/catalogs/subjects/${subjectId}/syllabi`,
      this.httpOptions
    ).pipe(catchError(this.handleError));
  }

  getTeachers(modalityId?: number): Observable<TeacherItem[]> {
    const url = modalityId
      ? `${this.baseUrl}/student/catalogs/teachers?modalityId=${modalityId}`
      : `${this.baseUrl}/student/catalogs/teachers`;
    return this.http.get<TeacherItem[]>(url, this.httpOptions).pipe(catchError(this.handleError));
  }

  getModalities(): Observable<ModalityItem[]> {
    return this.http.get<ModalityItem[]>(
      `${this.baseUrl}/student/catalogs/modalities`,
      this.httpOptions
    ).pipe(catchError(this.handleError));
  }

  getSessionTypes(): Observable<SessionTypeItem[]> {
    return this.http.get<SessionTypeItem[]>(
      `${this.baseUrl}/student/catalogs/sessionTypes`,
      this.httpOptions
    ).pipe(catchError(this.handleError));
  }

  getTimeSlots(): Observable<TimeSlotItem[]> {
    return this.http.get<TimeSlotItem[]>(
      `${this.baseUrl}/student/catalogs/timeSlots`,
      this.httpOptions
    ).pipe(catchError(this.handleError));
  }

  /**
   * Obtiene las franjas horarias disponibles para un docente específico.
   * Filtra por disponibilidad del docente y excluye franjas ocupadas.
   *
   * @param teacherId ID del docente
   * @param dayOfWeek Día de la semana (1=Lunes, 7=Domingo)
   * @param periodId ID del período académico
   * @returns Observable con lista de franjas disponibles
   */
  getAvailableTimeSlots(teacherId: number, dayOfWeek: number, periodId: number): Observable<AvailableTimeSlotItem[]> {
    const params = `teacherId=${teacherId}&dayOfWeek=${dayOfWeek}&periodId=${periodId}`;
    return this.http.get<AvailableTimeSlotItem[]>(
      `${this.baseUrl}/student/catalogs/timeSlots/available?${params}`,
      this.httpOptions
    ).pipe(catchError(this.handleError));
  }

  // ==================== REQUEST ACTIONS ====================

  /**
   * Obtiene los compañeros matriculados en la misma asignatura.
   * Excluye al estudiante actual.
   *
   * @param subjectId ID de la asignatura
   * @returns Observable con lista de compañeros
   */
  getClassmatesBySubject(subjectId: number): Observable<ClassmateItem[]> {
    return this.http.get<ClassmateItem[]>(
      `${this.baseUrl}/student/catalogs/subjects/${subjectId}/classmates`,
      this.httpOptions
    ).pipe(catchError(this.handleError));
  }

  previewRequest(payload: RequestPreviewPayload): Observable<RequestPreviewResponse> {
    return this.http.post<RequestPreviewResponse>(
      `${this.baseUrl}/student/requests/preview`,
      payload,
      this.httpOptions
    ).pipe(catchError(this.handleError));
  }

  createRequest(payload: CreateRequestPayload): Observable<CreateRequestResponse> {
    return this.http.post<CreateRequestResponse>(
      `${this.baseUrl}/student/requests`,
      payload,
      this.httpOptions
    ).pipe(catchError(this.handleError));
  }

  // ==================== ERROR HANDLING ====================

  private handleError(error: HttpErrorResponse): Observable<never> {
    let message = 'Ha ocurrido un error inesperado';

    if (error.status === 0) {
      message = 'No se pudo conectar con el servidor.';
    } else if (error.status === 401) {
      message = 'Sesión expirada. Por favor, inicia sesión nuevamente.';
    } else if (error.status === 400) {
      message = error.error?.message || 'Datos inválidos.';
    } else if (error.status === 409) {
      // Conflict: La franja horaria no está disponible
      message = error.error?.message || 'La franja horaria seleccionada ya no está disponible.';
    } else if (error.status >= 500) {
      message = 'Error en el servidor. Intenta más tarde.';
    } else if (error.error?.message) {
      message = error.error.message;
    }

    console.error('[StudentNewRequestService] Error:', error);
    return throwError(() => new Error(message));
  }
}

