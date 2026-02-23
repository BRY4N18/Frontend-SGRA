import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import {
    TeacherRequestsPageDTO,
    StatusSummaryDTO,
    UpdateStatusResponseDTO
} from '../../models/teacher/teacher-request.model';

function buildHttpParams(params: Record<string, unknown>): HttpParams {
    let httpParams = new HttpParams();
    for (const key of Object.keys(params)) {
        const value = params[key];
        if (value !== null && value !== undefined && value !== '') {
            httpParams = httpParams.set(key, String(value));
        }
    }
    return httpParams;
}

@Injectable({ providedIn: 'root' })
export class TeacherRequestsService {
    private readonly baseUrl = environment.apiUrl;
    private readonly httpOptions = { withCredentials: true };

    constructor(private http: HttpClient) { }

    getRequests(filters: {
        statusId?: number;
        sessionTypeId?: number;
        subjectId?: number;
        search?: string;
        page?: number;
        size?: number;
    }): Observable<TeacherRequestsPageDTO> {
        const params = buildHttpParams({
            statusId: filters.statusId,
            sessionTypeId: filters.sessionTypeId,
            subjectId: filters.subjectId,
            search: filters.search,
            page: filters.page ?? 1,
            size: filters.size ?? 10,
        });

        return this.http.get<TeacherRequestsPageDTO>(
            `${this.baseUrl}/teacher/requests`,
            { ...this.httpOptions, params }
        ).pipe(catchError(this.handleError));
    }

    getRequestsSummary(): Observable<StatusSummaryDTO[]> {
        return this.http.get<StatusSummaryDTO[]>(
            `${this.baseUrl}/teacher/requests/summary`,
            this.httpOptions
        ).pipe(catchError(this.handleError));
    }

    updateRequestStatus(requestId: number, statusId: number): Observable<UpdateStatusResponseDTO> {
        return this.http.put<UpdateStatusResponseDTO>(
            `${this.baseUrl}/teacher/requests/${requestId}/status`,
            { statusId },
            this.httpOptions
        ).pipe(catchError(this.handleError));
    }

    private handleError(error: HttpErrorResponse): Observable<never> {
        let message = 'Error al cargar la información';

        if (error.status === 0) message = 'No se pudo conectar con el servidor.';
        else if (error.status === 401) message = 'Sesión expirada. Inicia sesión nuevamente.';
        else if (error.status === 403) message = 'No tienes permisos para acceder.';
        else if (error.status === 409) message = error.error?.message || 'No se puede actualizar el estado.';
        else if (error.error?.message) message = error.error.message;

        console.error('[TeacherRequestsService] Error:', error);
        return throwError(() => new Error(message));
    }
}
