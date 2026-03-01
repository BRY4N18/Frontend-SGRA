import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { InvitationItem, InvitationResponse } from '../../models/student/invitation.model';

/**
 * StudentInvitationsService
 * Servicio para gestionar las invitaciones a tutorías grupales del estudiante.
 */
@Injectable({
  providedIn: 'root'
})
export class StudentInvitationsService {
  private readonly baseUrl = environment.apiUrl;
  private readonly httpOptions = { withCredentials: true };

  constructor(private http: HttpClient) {}

  /**
   * Obtiene las invitaciones a tutorías grupales pendientes de respuesta.
   */
  getMyInvitations(): Observable<InvitationItem[]> {
    return this.http.get<InvitationItem[]>(
      `${this.baseUrl}/student/invitations`,
      this.httpOptions
    ).pipe(catchError(this.handleError));
  }

  /**
   * Acepta o rechaza una invitación a tutoría grupal.
   * @param participantId ID del registro de participación
   * @param accept true = acepta, false = rechaza
   */
  respondInvitation(participantId: number, accept: boolean): Observable<InvitationResponse> {
    return this.http.put<InvitationResponse>(
      `${this.baseUrl}/student/invitations/${participantId}`,
      { accept },
      this.httpOptions
    ).pipe(catchError(this.handleError));
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    let message = 'Error al procesar la invitación';

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

    console.error('[StudentInvitationsService] Error:', error);
    return throwError(() => new Error(message));
  }
}

