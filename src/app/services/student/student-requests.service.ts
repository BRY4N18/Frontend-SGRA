import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { buildHttpParams } from './http-params.helper';
import { RequestChipsDTO } from '../../models/student/request-chips.model';
import { PageResponse, StudentMyRequestRowDTO } from '../../models/student/student-my-requests.model';

@Injectable({ providedIn: 'root' })
export class StudentRequestsService {
  private readonly baseUrl = environment.apiUrl;
  private readonly httpOptions = { withCredentials: true };

  constructor(private http: HttpClient) {}

  getMyRequestsChips(periodId?: number): Observable<RequestChipsDTO> {
    const params = buildHttpParams({ periodId });
    return this.http
      .get<RequestChipsDTO>(`${this.baseUrl}/student/requests/chips`, { ...this.httpOptions, params })
      .pipe(catchError(this.handleError));
  }

  getMyRequests(paramsIn: {
    periodId?: number;
    statusId?: number;
    typeId?: number;
    subjectId?: number;
    search?: string;
    page: number;
    size: number;
  }): Observable<PageResponse<StudentMyRequestRowDTO>> {
    const params = buildHttpParams({
      periodId: paramsIn.periodId,
      statusId: paramsIn.statusId,
      typeId: paramsIn.typeId,
      subjectId: paramsIn.subjectId,
      search: paramsIn.search,
      page: paramsIn.page,
      size: paramsIn.size
    });

    return this.http
      .get<PageResponse<StudentMyRequestRowDTO>>(`${this.baseUrl}/student/requests`, { ...this.httpOptions, params })
      .pipe(catchError(this.handleError));
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    let message = 'Error al cargar información';
    if (error.status === 0) message = 'No se pudo conectar con el servidor.';
    else if (error.status === 401) message = 'Sesión expirada. Inicia sesión nuevamente.';
    else if (error.status === 403) message = 'No tienes permisos para acceder.';
    else if (error.error?.message) message = error.error.message;
    return throwError(() => new Error(message));
  }
}
