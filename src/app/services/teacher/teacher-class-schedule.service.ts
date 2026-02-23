import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { ClassScheduleDetail } from '../../models/teacher';

@Injectable({ providedIn: 'root' })
export class TeacherClassScheduleService {
  private readonly baseUrl = environment.apiUrl;
  private readonly httpOptions = { withCredentials: true };

  constructor(private http: HttpClient) {}

  /**
   * GET /api/academic/class-schedules?teacherId={id}
   * Returns all class schedules for a given teacher
   */
  getSchedulesByTeacherId(id: number): Observable<ClassScheduleDetail[]> {
    return this.http.get<ClassScheduleDetail[]>(
      `${this.baseUrl}/academic/class-schedules/detail/${id}`,
      { ...this.httpOptions }
    ).pipe(catchError(this.handleError));
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    let message = 'Error al obtener horarios de clase';

    if (error.status === 0) message = 'No se pudo conectar con el servidor.';
    else if (error.status === 401) message = 'Sesión expirada. Inicia sesión nuevamente.';
    else if (error.status === 400) message = error.error?.message || 'Datos inválidos.';
    else if (error.error?.message) message = error.error.message;

    console.error('[TeacherClassScheduleService] Error:', error);
    return throwError(() => new Error(message));
  }
}
