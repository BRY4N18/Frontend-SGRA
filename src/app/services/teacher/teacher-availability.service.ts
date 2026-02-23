import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { SaveAvailabilityPayload, SaveAvailabilityResponse, TeacherAvailabilityItem } from '../../models/teacher';

@Injectable({ providedIn: 'root' })
export class TeacherAvailabilityService {
    private readonly baseUrl = environment.apiUrl;
    private readonly httpOptions = { withCredentials: true };

    constructor(private http: HttpClient) { }

    /**
     * GET /api/reinforcement/teacher-availabilities/by-user/{userId}
     * Returns all saved availability slots for a given teacher.
     */
    getAvailabilityByUser(userId: number): Observable<TeacherAvailabilityItem[]> {
        return this.http.get<TeacherAvailabilityItem[]>(
            `${this.baseUrl}/reinforcement/teacher-availabilities/by-user/${userId}`,
            this.httpOptions
        ).pipe(catchError(this.handleError));
    }

    /**
     * POST /api/reinforcement/teacher-availabilities/batch
     * Saves all selected availability slots for a teacher in a given period.
     */
    saveAvailability(payload: SaveAvailabilityPayload): Observable<SaveAvailabilityResponse> {
        return this.http.post<SaveAvailabilityResponse>(
            `${this.baseUrl}/reinforcement/teacher-availabilities/batch`,
            payload,
            this.httpOptions
        ).pipe(catchError(this.handleError));
    }

    private handleError(error: HttpErrorResponse): Observable<never> {
        let message = 'Error al guardar disponibilidad';

        if (error.status === 0) message = 'No se pudo conectar con el servidor.';
        else if (error.status === 401) message = 'Sesión expirada. Inicia sesión nuevamente.';
        else if (error.status === 400) message = error.error?.message || 'Datos inválidos.';
        else if (error.error?.message) message = error.error.message;

        console.error('[TeacherAvailabilityService] Error:', error);
        return throwError(() => new Error(message));
    }
}
