import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import {
  SubjectItem,
  SessionTypeItem,
  StudentSubjectTeacher,
  ActivePeriod,
  ClassmateItem
} from '../../models/student/catalog.model';
import {
  CreateRequestPayload,
  CreateRequestResponse
} from '../../models/student/request.model';

/**
 * StudentNewRequestService
 * Servicio simplificado para crear solicitudes de refuerzo.
 * El estudiante solo elige: asignatura, tipo de sesión, motivo y archivos.
 */
@Injectable({
  providedIn: 'root'
})
export class StudentNewRequestService {
  private readonly baseUrl = environment.apiUrl;
  private readonly httpOptions = { withCredentials: true };

  constructor(private http: HttpClient) {}

  // ==================== CATÁLOGOS ====================

  /** Obtiene las asignaturas en las que el estudiante está matriculado (periodo activo) */
  getSubjects(): Observable<SubjectItem[]> {
    return this.http.get<SubjectItem[]>(
      `${this.baseUrl}/student/catalogs/subjects`,
      this.httpOptions
    ).pipe(catchError(this.handleError));
  }

  /** Obtiene el docente asignado al paralelo del estudiante para una asignatura */
  getTeacherBySubject(subjectId: number): Observable<StudentSubjectTeacher> {
    return this.http.get<StudentSubjectTeacher>(
      `${this.baseUrl}/student/catalogs/subjects/${subjectId}/teacher`,
      this.httpOptions
    ).pipe(catchError(this.handleError));
  }

  /** Lista los tipos de sesión (Individual, Grupal) */
  getSessionTypes(): Observable<SessionTypeItem[]> {
    return this.http.get<SessionTypeItem[]>(
      `${this.baseUrl}/student/catalogs/sessionTypes`,
      this.httpOptions
    ).pipe(catchError(this.handleError));
  }

  /** Obtiene el periodo académico activo */
  getActivePeriod(): Observable<ActivePeriod> {
    return this.http.get<ActivePeriod>(
      `${this.baseUrl}/student/catalogs/active-period`,
      this.httpOptions
    ).pipe(catchError(this.handleError));
  }

  /** Obtiene los compañeros matriculados en la misma asignatura */
  getClassmatesBySubject(subjectId: number): Observable<ClassmateItem[]> {
    return this.http.get<ClassmateItem[]>(
      `${this.baseUrl}/student/catalogs/subjects/${subjectId}/classmates`,
      this.httpOptions
    ).pipe(catchError(this.handleError));
  }

  // ==================== CREAR SOLICITUD ====================

  /**
   * Crea una nueva solicitud de refuerzo.
   * Envía los datos como multipart/form-data (JSON + archivos).
   *
   * @param payload Datos de la solicitud (subjectId, sessionTypeId, reason, participantIds)
   * @param files   Archivos opcionales a adjuntar
   */
  createRequest(payload: CreateRequestPayload, files: File[] = []): Observable<CreateRequestResponse> {
    const formData = new FormData();

    // Agregar el JSON como parte "request"
    formData.append('request', new Blob([JSON.stringify(payload)], { type: 'application/json' }));

    // Agregar archivos
    for (const file of files) {
      formData.append('files', file);
    }

    return this.http.post<CreateRequestResponse>(
      `${this.baseUrl}/student/requests`,
      formData,
      { withCredentials: true }
    ).pipe(catchError(this.handleError));
  }

  // ==================== MANEJO DE ERRORES ====================

  private handleError(error: HttpErrorResponse): Observable<never> {
    let message = 'Ha ocurrido un error inesperado';

    if (error.status === 0) {
      message = 'No se pudo conectar con el servidor.';
    } else if (error.status === 401) {
      message = 'Sesión expirada. Por favor, inicia sesión nuevamente.';
    } else if (error.status === 400) {
      message = error.error?.message || 'Datos inválidos.';
    } else if (error.status >= 500) {
      message = 'Error en el servidor. Intenta más tarde.';
    } else if (error.error?.message) {
      message = error.error.message;
    }

    console.error('[StudentNewRequestService] Error:', error);
    return throwError(() => new Error(message));
  }
}

