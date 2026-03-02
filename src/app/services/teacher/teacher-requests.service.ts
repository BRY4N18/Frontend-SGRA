import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import {
    TeacherRequestsPageDTO,
    AcceptRescheduleBodyDTO,
    ReasonBodyDTO,
    ApiActionResponseDTO,
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
    private readonly opts = { withCredentials: true };

    constructor(private http: HttpClient) { }

    /** RF10 – List incoming requests with optional status filter */
    getRequests(filters: {
        statusId?: number | null;
        page?: number;
        size?: number;
    }): Observable<TeacherRequestsPageDTO> {
        const params = buildHttpParams({
            statusId: filters.statusId ?? undefined,
            page: filters.page ?? 1,
            size: filters.size ?? 10,
        });
        return this.http.get<TeacherRequestsPageDTO>(
            `${this.baseUrl}/teacher/requests`,
            { ...this.opts, params }
        ).pipe(catchError(this.handleError));
    }

    /** RF10+RF11 – Accept a pending request and schedule the session */
    acceptRequest(requestId: number, body: AcceptRescheduleBodyDTO): Observable<ApiActionResponseDTO> {
        return this.http.put<ApiActionResponseDTO>(
            `${this.baseUrl}/teacher/requests/${requestId}/accept`,
            body,
            this.opts
        ).pipe(catchError(this.handleError));
    }

    /** RF10 – Reject a pending request with optional reason */
    rejectRequest(requestId: number, body: ReasonBodyDTO): Observable<ApiActionResponseDTO> {
        return this.http.put<ApiActionResponseDTO>(
            `${this.baseUrl}/teacher/requests/${requestId}/reject`,
            body,
            this.opts
        ).pipe(catchError(this.handleError));
    }

    /** RF11 – Reschedule an already-accepted session */
    rescheduleRequest(requestId: number, body: AcceptRescheduleBodyDTO): Observable<ApiActionResponseDTO> {
        return this.http.put<ApiActionResponseDTO>(
            `${this.baseUrl}/teacher/requests/${requestId}/reschedule`,
            body,
            this.opts
        ).pipe(catchError(this.handleError));
    }

    /** RF15 – Cancel an accepted session with optional reason */
    cancelRequest(scheduledId: number, body: ReasonBodyDTO): Observable<ApiActionResponseDTO> {
        return this.http.put<ApiActionResponseDTO>(
            `${this.baseUrl}/teacher/requests/${scheduledId}/cancel`,
            body,
            this.opts
        ).pipe(catchError(this.handleError));
    }

    private handleError = (error: HttpErrorResponse): Observable<never> => {
        let message = 'Error al procesar la solicitud';
        if (error.status === 0) message = 'No se pudo conectar con el servidor. Verifica tu conexión.';
        else if (error.status === 401) message = 'Sesión expirada. Inicia sesión nuevamente.';
        else if (error.status === 403) message = 'No tienes permisos para esta acción.';
        else if (error.status === 400) message = error.error?.message || 'Datos inválidos.';
        else if (error.status === 409) message = error.error?.message || 'Conflicto de estado.';
        else if (error.status === 500) message = 'Error interno del servidor. Contacta al administrador.';
        else if (error.error?.message) message = error.error.message;
        console.error('[TeacherRequestsService]', error);
        return throwError(() => new Error(message));
    };
}
