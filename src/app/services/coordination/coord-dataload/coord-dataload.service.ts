import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import {
  Student,
  StudentUploadResponse,
  Teacher,
  TeacherUploadResponse,
  UploadResult,
  UploadStats
} from '../../../models/coordination/coord-dataload';

/**
 * Servicio para la carga de información base (RF26)
 * Gestiona la carga  desde archivos Excel
 */
@Injectable({
  providedIn: 'root'
})
export class CoordDataloadService {
  uploadClassSchedules(selectedFile: File): Observable<string[]> {
    const formData = new FormData();
    formData.append('file', selectedFile);
    const url = `${environment.apiUrl}/academic/coordinations/upload-class-schedules`;
    return this.http.post<string[]>(url, formData).pipe(
      catchError((error: HttpErrorResponse) => {
        return of([error.message || 'Error al subir horarios']);
      })
    );
  }
  uploadRegistrations(selectedFile: File): Observable<string[]> {
    const formData = new FormData();
    formData.append('file', selectedFile);
    const url = `${environment.apiUrl}/academic/coordinations/upload-registrations`;
    return this.http.post<string[]>(url, formData).pipe(
      catchError((error: HttpErrorResponse) => {
        return of([error.message || 'Error al subir matrículas']);
      })
    );
  }
  uploadSyllabi(selectedFile: File): Observable<string[]> {
    const formData = new FormData();
    formData.append('file', selectedFile);
    const url = `${environment.apiUrl}/academic/coordinations/upload-syllabi`;
    return this.http.post<string[]>(url, formData).pipe(
      catchError((error: HttpErrorResponse) => {
        return of([error.message || 'Error al subir temarios']);
      })
    );
  }
  uploadSubjects(selectedFile: File): Observable<string[]> {
    const formData = new FormData();
    formData.append('file', selectedFile);
    const url = `${environment.apiUrl}/academic/coordinations/upload-subjects`;
    return this.http.post<string[]>(url, formData).pipe(
      catchError((error: HttpErrorResponse) => {
        return of([error.message || 'Error al subir asignaturas']);
      })
    );
  }
  uploadCareers(selectedFile: File): Observable<string[]> {
    const formData = new FormData();
    formData.append('file', selectedFile);
    const url = `${environment.apiUrl}/academic/coordinations/upload-careers`;
    return this.http.post<string[]>(url, formData).pipe(
      catchError((error: HttpErrorResponse) => {
        return of([error.message || 'Error al subir carreras']);
      })
    );
  }
  uploadPeriods(selectedFile: File): Observable<string[]> {
    const formData = new FormData();
    formData.append('file', selectedFile);
    const url = `${environment.apiUrl}/academic/coordinations/upload-periods`;
    return this.http.post<string[]>(url, formData).pipe(
      catchError((error: HttpErrorResponse) => {
        return of([error.message || 'Error al subir periodos']);
      })
    );
  }

  constructor(private http: HttpClient) {}
  private readonly apiUrl = environment.apiUrl;

  // ============================================
  // MÉTODOS PARA ESTUDIANTES
  // ============================================

  /**
   * Carga un archivo Excel de estudiantes al servidor
   * @param file Archivo Excel a cargar
   * @returns Observable con el reporte de la carga (string[])
   */
  uploadStudentsFile(file: File): Observable<string[]> {
    const formData = new FormData();
    formData.append('file', file, file.name);

    return this.http.post<string[]>(`${this.apiUrl}/academic/coordinations/upload-students`, formData, {
      withCredentials: true
    }).pipe(
      catchError((error: HttpErrorResponse) => {
        console.error('Error al cargar estudiantes:', error);
        const errorMessage = typeof error.error === 'string'
          ? error.error
          : 'Error al procesar el archivo';
        return of([errorMessage]);
      })
    );
  }

  /**
   * Carga un archivo Excel de docentes al servidor
   * @param file Archivo Excel a cargar
   * @returns Observable con el reporte de la carga (string[])
   */
  uploadTeachersFile(file: File): Observable<string[]> {
    const formData = new FormData();
    formData.append('file', file, file.name);

    return this.http.post<string[]>(`${this.apiUrl}/academic/coordinations/upload-teachers`, formData, {
      withCredentials: true
    }).pipe(
      catchError((error: HttpErrorResponse) => {
        console.error('Error al cargar docentes:', error);
        const errorMessage = typeof error.error === 'string'
          ? error.error
          : 'Error al procesar el archivo';
        return of([errorMessage]);
      })
    );
  }

  /**
   * Obtiene la lista de estudiantes cargados
   */
  getStudents(): Observable<Student[]> {
    return this.http.get<Student[]>(`${this.apiUrl}/academic/coordinations/students`, {
      withCredentials: true
    }).pipe(
      catchError(() => of([]))
    );
  }

  /**
   * Obtiene un estudiante por su código
   */
  getStudentByCodigo(codigo: string): Observable<Student | null> {
    return this.http.get<Student>(`${this.apiUrl}/academic/coordinations/students/${codigo}`, {
      withCredentials: true
    }).pipe(
      catchError(() => of(null))
    );
  }

  /**
   * Obtiene la lista de docentes cargados
   */
  getTeachers(): Observable<Teacher[]> {
    return this.http.get<Teacher[]>(`${this.apiUrl}/academic/coordinations/teachers`, {
      withCredentials: true
    }).pipe(
      catchError(() => of([]))
    );
  }

  /**
   * Obtiene un docente por su código
   */
  getTeacherByCodigo(codigo: string): Observable<Teacher | null> {
    return this.http.get<Teacher>(`${this.apiUrl}/academic/coordinations/teachers/${codigo}`, {
      withCredentials: true
    }).pipe(
      catchError(() => of(null))
    );
  }

  // ============================================
  // MÉTODOS PARA CARRERAS, ASIGNATURAS, TEMARIOS, PERIODOS, MATRÍCULAS Y HORARIOS
  // ============================================

  /**
   * Carga un archivo Excel de carreras al servidor
   */
  uploadCareersFile(file: File): Observable<string[]> {
    const formData = new FormData();
    formData.append('file', file, file.name);
    return this.http.post<string[]>(`${this.apiUrl}/academic/coordinations/upload-careers`, formData, {
      withCredentials: true
    }).pipe(
      catchError((error: HttpErrorResponse) => {
        console.error('Error al cargar carreras:', error);
        const errorMessage = typeof error.error === 'string'
          ? error.error
          : 'Error al procesar el archivo';
        return of([errorMessage]);
      })
    );
  }

  /**
   * Carga un archivo Excel de asignaturas al servidor
   */
  uploadSubjectsFile(file: File): Observable<string[]> {
    const formData = new FormData();
    formData.append('file', file, file.name);
    return this.http.post<string[]>(`${this.apiUrl}/academic/coordinations/upload-subjects`, formData, {
      withCredentials: true
    }).pipe(
      catchError((error: HttpErrorResponse) => {
        console.error('Error al cargar asignaturas:', error);
        const errorMessage = typeof error.error === 'string'
          ? error.error
          : 'Error al procesar el archivo';
        return of([errorMessage]);
      })
    );
  }

  /**
   * Carga un archivo Excel de temarios al servidor
   */
  uploadSyllabiFile(file: File): Observable<string[]> {
    const formData = new FormData();
    formData.append('file', file, file.name);
    return this.http.post<string[]>(`${this.apiUrl}/academic/coordinations/upload-syllabi`, formData, {
      withCredentials: true
    }).pipe(
      catchError((error: HttpErrorResponse) => {
        console.error('Error al cargar temarios:', error);
        const errorMessage = typeof error.error === 'string'
          ? error.error
          : 'Error al procesar el archivo';
        return of([errorMessage]);
      })
    );
  }

  /**
   * Carga un archivo Excel de periodos al servidor
   */
  uploadPeriodsFile(file: File): Observable<string[]> {
    const formData = new FormData();
    formData.append('file', file, file.name);
    return this.http.post<string[]>(`${this.apiUrl}/academic/coordinations/upload-periods`, formData, {
      withCredentials: true
    }).pipe(
      catchError((error: HttpErrorResponse) => {
        console.error('Error al cargar periodos:', error);
        const errorMessage = typeof error.error === 'string'
          ? error.error
          : 'Error al procesar el archivo';
        return of([errorMessage]);
      })
    );
  }

  /**
   * Carga un archivo Excel de matrículas al servidor
   */
  uploadRegistrationsFile(file: File): Observable<string[]> {
    const formData = new FormData();
    formData.append('file', file, file.name);
    return this.http.post<string[]>(`${this.apiUrl}/academic/coordinations/upload-registrations`, formData, {
      withCredentials: true
    }).pipe(
      catchError((error: HttpErrorResponse) => {
        console.error('Error al cargar matrículas:', error);
        const errorMessage = typeof error.error === 'string'
          ? error.error
          : 'Error al procesar el archivo';
        return of([errorMessage]);
      })
    );
  }

  /**
   * Carga un archivo Excel de horarios al servidor
   */
  uploadSchedulesFile(file: File): Observable<string[]> {
    const formData = new FormData();
    formData.append('file', file, file.name);
    return this.http.post<string[]>(`${this.apiUrl}/academic/coordinations/upload-class-schedules`, formData, {
      withCredentials: true
    }).pipe(
      catchError((error: HttpErrorResponse) => {
        console.error('Error al cargar horarios:', error);
        const errorMessage = typeof error.error === 'string'
          ? error.error
          : 'Error al procesar el archivo';
        return of([errorMessage]);
      })
    );
  }

  /**
   * Obtiene la lista de carreras cargadas
   */
  getCareers(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/academic/coordinations/careers`, {
      withCredentials: true
    }).pipe(
      catchError(() => of([]))
    );
  }

  /**
   * Obtiene la lista de asignaturas cargadas
   */
  getSubjects(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/academic/coordinations/subjects`, {
      withCredentials: true
    }).pipe(
      catchError(() => of([]))
    );
  }

  /**
   * Obtiene la lista de temarios cargados
   */
  getSyllabi(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/academic/coordinations/syllabi`, {
      withCredentials: true
    }).pipe(
      catchError(() => of([]))
    );
  }

  /**
   * Obtiene la lista de periodos cargados
   */
  getPeriods(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/academic/coordinations/periods`, {
      withCredentials: true
    }).pipe(
      catchError(() => of([]))
    );
  }

  /**
   * Obtiene la lista de matrículas cargadas
   */
  getRegistrations(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/academic/coordinations/registrations`, {
      withCredentials: true
    }).pipe(
      catchError(() => of([]))
    );
  }

  /**
   * Obtiene la lista de horarios cargados
   */
  getSchedules(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/academic/coordinations/class-schedules`, {
      withCredentials: true
    }).pipe(
      catchError(() => of([]))
    );
  }

  // ============================================
  // MÉTODOS GENERALES
  // ============================================

  /**
   * Obtiene estadísticas de las cargas realizadas
   */
  getUploadStats(): Observable<UploadStats> {
    return this.http.get<UploadStats>(`${this.apiUrl}/stats`, {
      withCredentials: true
    }).pipe(
      catchError(() => of({
        totalArchivos: 0,
        totalRegistros: 0,
        exitosos: 0,
        errores: 0
      }))
    );
  }

  /**
   * Obtiene el historial de resultados de carga
   */
  getUploadHistory(): Observable<UploadResult[]> {
    return this.http.get<UploadResult[]>(`${this.apiUrl}/history`, {
      withCredentials: true
    }).pipe(
      catchError(() => of([]))
    );
  }

  /**
   * Valida el formato de un archivo antes de cargarlo
   */
  validateFile(file: File): { valid: boolean; message: string } {
    const maxSize = 10 * 1024 * 1024; // 10 MB
    const allowedExtensions = ['.xls', '.xlsx'];

    // Validar tamaño
    if (file.size > maxSize) {
      return { valid: false, message: 'El archivo excede el tamaño máximo de 10 MB.' };
    }

    // Validar extensión
    const extension = '.' + file.name.split('.').pop()?.toLowerCase();
    if (!allowedExtensions.includes(extension)) {
      return { valid: false, message: 'Formato no válido. Use archivos .xls o .xlsx' };
    }

    return { valid: true, message: 'Archivo válido' };
  }
}


