import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../environments/environment';

// DTOs matching backend exactly
export interface NotificationChannelDTO {
  channelId: number;
  channelName: string;
}

export interface StudentPreferenceDTO {
  preferenceId: number;
  userId: number;
  channelId: number;
  channelName: string;
  reminderAnticipation: number;
}

export interface StudentPreferenceUpsertRequestDTO {
  channelId: number;
  reminderAnticipation: number;
}

export interface StudentPreferenceUpsertResponseDTO {
  message: string;
}

@Injectable({ providedIn: 'root' })
export class StudentPreferencesService {
  private readonly baseUrl = environment.apiUrl;
  private readonly httpOptions = { withCredentials: true };

  constructor(private http: HttpClient) {}

  /**
   * GET /api/student/preferences/channels
   * Returns list of available notification channels
   */
  getActiveChannels(): Observable<NotificationChannelDTO[]> {
    return this.http.get<NotificationChannelDTO[]>(
      `${this.baseUrl}/student/preferences/channels`,
      this.httpOptions
    ).pipe(catchError(this.handleError));
  }

  /**
   * GET /api/student/preferences/me
   * Returns current user's preference (or null if not set)
   */
  getMyPreference(): Observable<StudentPreferenceDTO | null> {
    return this.http.get<StudentPreferenceDTO | null>(
      `${this.baseUrl}/student/preferences/me`,
      this.httpOptions
    ).pipe(catchError(this.handleError));
  }

  /**
   * PUT /api/student/preferences/me
   * Save/update user's preference
   */
  saveMyPreference(req: StudentPreferenceUpsertRequestDTO): Observable<StudentPreferenceUpsertResponseDTO> {
    return this.http.put<StudentPreferenceUpsertResponseDTO>(
      `${this.baseUrl}/student/preferences/me`,
      req,
      this.httpOptions
    ).pipe(catchError(this.handleError));
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    let message = 'Error al procesar preferencias';

    if (error.status === 0) message = 'No se pudo conectar con el servidor.';
    else if (error.status === 401) message = 'Sesión expirada. Inicia sesión nuevamente.';
    else if (error.status === 400) message = error.error?.message || 'Datos inválidos.';
    else if (error.error?.message) message = error.error.message;

    console.error('[StudentPreferencesService] Error:', error);
    return throwError(() => new Error(message));
  }
}

