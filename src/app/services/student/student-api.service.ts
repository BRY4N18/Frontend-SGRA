import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { buildHttpParams } from './http-params.helper';

// Models
import {
  SubjectItem,
  SyllabusItem,
  TeacherItem,
  ModalityItem,
  SessionTypeItem,
  TimeSlotItem,
  RequestPreviewPayload,
  RequestPreviewResponse,
  CreateRequestPayload,
  CreateRequestResponse,
  MyRequestsChips,
  MyRequestsFilter,
  MyRequestsPage,
  HistoryFilter,
  HistoryRequestsPage,
  SessionsFilter,
  HistorySessionsPage,
  NotificationChannel,
  StudentPreference,
  SavePreferencePayload,
  SavePreferenceResponse
} from '../../models/student';

/**
 * StudentApiService
 * HTTP client for all student module endpoints.
 * Uses session-based authentication (JSESSIONID cookie).
 *
 * @example
 * // Get dashboard chips
 * this.studentApi.getMyRequestsChips(periodId).subscribe(chips => {
 *   console.log('Pending:', chips.pending);
 * });
 *
 * @example
 * // Get paginated requests
 * this.studentApi.getMyRequests({ periodId: 1, page: 1, size: 10 }).subscribe(page => {
 *   console.log('Total:', page.totalCount);
 *   console.log('Items:', page.items);
 * });
 */
@Injectable({
  providedIn: 'root'
})
export class StudentApiService {
  private readonly baseUrl = environment.apiUrl;
  private readonly httpOptions = { withCredentials: true };

  constructor(private http: HttpClient) {}

  // ==================== CATALOGS ====================

  /**
   * Get all subjects catalog
   */
  getSubjects(): Observable<SubjectItem[]> {
    return this.http.get<SubjectItem[]>(
      `${this.baseUrl}/student/catalogs/subjects`,
      this.httpOptions
    ).pipe(catchError(this.handleError));
  }

  /**
   * Get syllabi for a specific subject
   * @param subjectId Subject ID
   */
  getSyllabiBySubject(subjectId: number): Observable<SyllabusItem[]> {
    return this.http.get<SyllabusItem[]>(
      `${this.baseUrl}/student/catalogs/subjects/${subjectId}/syllabi`,
      this.httpOptions
    ).pipe(catchError(this.handleError));
  }

  /**
   * Get teachers catalog, optionally filtered by modality
   * @param modalityId Optional modality filter
   */
  getTeachers(modalityId?: number | null): Observable<TeacherItem[]> {
    const params = buildHttpParams({ modalityId });
    return this.http.get<TeacherItem[]>(
      `${this.baseUrl}/student/catalogs/teachers`,
      { ...this.httpOptions, params }
    ).pipe(catchError(this.handleError));
  }

  /**
   * Get all modalities catalog
   */
  getModalities(): Observable<ModalityItem[]> {
    return this.http.get<ModalityItem[]>(
      `${this.baseUrl}/student/catalogs/modalities`,
      this.httpOptions
    ).pipe(catchError(this.handleError));
  }

  /**
   * Get all session types catalog
   */
  getSessionTypes(): Observable<SessionTypeItem[]> {
    return this.http.get<SessionTypeItem[]>(
      `${this.baseUrl}/student/catalogs/sessionTypes`,
      this.httpOptions
    ).pipe(catchError(this.handleError));
  }

  /**
   * Get all time slots catalog
   */
  getTimeSlots(): Observable<TimeSlotItem[]> {
    return this.http.get<TimeSlotItem[]>(
      `${this.baseUrl}/student/catalogs/timeSlots`,
      this.httpOptions
    ).pipe(catchError(this.handleError));
  }

  // ==================== REQUESTS ====================

  /**
   * Preview a request before creating it
   * @param payload Preview request payload
   */
  previewRequest(payload: RequestPreviewPayload): Observable<RequestPreviewResponse> {
    return this.http.post<RequestPreviewResponse>(
      `${this.baseUrl}/student/requests/preview`,
      payload,
      this.httpOptions
    ).pipe(catchError(this.handleError));
  }

  /**
   * Create a new reinforcement request
   * @param payload Create request payload
   */
  createRequest(payload: CreateRequestPayload): Observable<CreateRequestResponse> {
    return this.http.post<CreateRequestResponse>(
      `${this.baseUrl}/student/requests`,
      payload,
      this.httpOptions
    ).pipe(catchError(this.handleError));
  }

  // ==================== MY REQUESTS ====================

  /**
   * Get request status chips (counts by status)
   * @param periodId Optional period filter
   *
   * @example
   * this.studentApi.getMyRequestsChips(1).subscribe(chips => {
   *   this.pending = chips.pending;
   *   this.accepted = chips.accepted;
   * });
   */
  getMyRequestsChips(periodId?: number | null): Observable<MyRequestsChips> {
    const params = buildHttpParams({ periodId });
    return this.http.get<MyRequestsChips>(
      `${this.baseUrl}/student/requests/chips`,
      { ...this.httpOptions, params }
    ).pipe(catchError(this.handleError));
  }

  /**
   * Get paginated list of student's requests
   * @param filter Filter and pagination options
   *
   * @example
   * this.studentApi.getMyRequests({
   *   periodId: 1,
   *   stateId: 2,
   *   page: 1,
   *   size: 10
   * }).subscribe(page => {
   *   this.requests = page.items;
   *   this.total = page.totalCount;
   * });
   */
  getMyRequests(filter: MyRequestsFilter = {}): Observable<MyRequestsPage> {
    const params = buildHttpParams({
      periodId: filter.periodId,
      stateId: filter.stateId,
      typeId: filter.typeId,
      subjectId: filter.subjectId,
      search: filter.search,
      page: filter.page ?? 1,
      size: filter.size ?? 10
    });
    return this.http.get<MyRequestsPage>(
      `${this.baseUrl}/student/my-requests`,
      { ...this.httpOptions, params }
    ).pipe(catchError(this.handleError));
  }

  // ==================== HISTORY ====================

  /**
   * Get paginated request history
   * @param filter Filter and pagination options
   */
  getRequestHistory(filter: HistoryFilter = {}): Observable<HistoryRequestsPage> {
    const params = buildHttpParams({
      periodId: filter.periodId,
      stateId: filter.stateId,
      page: filter.page ?? 1,
      size: filter.size ?? 10
    });
    return this.http.get<HistoryRequestsPage>(
      `${this.baseUrl}/student/history`,
      { ...this.httpOptions, params }
    ).pipe(catchError(this.handleError));
  }

  /**
   * Get paginated previous sessions
   * @param filter Filter and pagination options
   */
  getSessionHistory(filter: SessionsFilter = {}): Observable<HistorySessionsPage> {
    const params = buildHttpParams({
      page: filter.page ?? 1,
      size: filter.size ?? 10,
      onlyAttended: filter.onlyAttended
    });
    return this.http.get<HistorySessionsPage>(
      `${this.baseUrl}/student/history/sessions`,
      { ...this.httpOptions, params }
    ).pipe(catchError(this.handleError));
  }

  // ==================== PREFERENCES ====================

  /**
   * Get available notification channels
   */
  getNotificationChannels(): Observable<NotificationChannel[]> {
    return this.http.get<NotificationChannel[]>(
      `${this.baseUrl}/student/preferences/channels`,
      this.httpOptions
    ).pipe(catchError(this.handleError));
  }

  /**
   * Get current user preference
   */
  getCurrentPreference(): Observable<StudentPreference | null> {
    return this.http.get<StudentPreference | null>(
      `${this.baseUrl}/student/preferences/current`,
      this.httpOptions
    ).pipe(catchError(this.handleError));
  }

  /**
   * Save notification preference
   * @param payload Preference data
   */
  savePreference(payload: SavePreferencePayload): Observable<SavePreferenceResponse> {
    return this.http.post<SavePreferenceResponse>(
      `${this.baseUrl}/student/preferences`,
      payload,
      this.httpOptions
    ).pipe(catchError(this.handleError));
  }

  // ==================== ERROR HANDLING ====================

  /**
   * Centralized error handler
   * @param error HttpErrorResponse
   */
  private handleError(error: HttpErrorResponse): Observable<never> {
    let message = 'Ha ocurrido un error inesperado';

    if (error.status === 0) {
      message = 'No se pudo conectar con el servidor. Verifica tu conexión.';
    } else if (error.status === 401) {
      message = 'Sesión expirada. Por favor, inicia sesión nuevamente.';
    } else if (error.status === 403) {
      message = 'No tienes permisos para realizar esta acción.';
    } else if (error.status === 404) {
      message = 'Recurso no encontrado.';
    } else if (error.status === 400) {
      message = error.error?.message || 'Datos inválidos. Revisa la información ingresada.';
    } else if (error.status >= 500) {
      message = 'Error en el servidor. Intenta más tarde.';
    } else if (error.error?.message) {
      message = error.error.message;
    }

    console.error('[StudentApiService] Error:', error);
    return throwError(() => new Error(message));
  }
}

