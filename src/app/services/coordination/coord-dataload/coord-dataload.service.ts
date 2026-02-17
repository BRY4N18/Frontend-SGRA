import { Injectable } from '@angular/core';
import { HttpClient, HttpEvent, HttpEventType } from '@angular/common/http';
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
 * Gestiona la carga masiva de estudiantes y docentes desde archivos Excel
 */
@Injectable({
  providedIn: 'root'
})
export class CoordDataloadService {
  private readonly apiUrl = `${environment.apiUrl}/coordination/dataload`;

  constructor(/* private http: HttpClient */) {
    // HttpClient se inyectará cuando se integre con el backend
  }

  // ============================================
  // MÉTODOS PARA ESTUDIANTES
  // ============================================

  /**
   * Carga un archivo Excel de estudiantes al servidor
   * @param file Archivo Excel a cargar
   * @returns Observable con el progreso y resultado de la carga
   */
  uploadStudentsFile(file: File): Observable<StudentUploadResponse> {
    // TODO: Implementar llamada real al backend
    // const formData = new FormData();
    // formData.append('file', file);
    // return this.http.post<StudentUploadResponse>(`${this.apiUrl}/students/upload`, formData);

    // Mock temporal para desarrollo
    return of(this.getMockStudentUploadResponse());
  }

  /**
   * Obtiene la lista de estudiantes cargados
   */
  getStudents(): Observable<Student[]> {
    // TODO: Implementar llamada real al backend
    // return this.http.get<Student[]>(`${this.apiUrl}/students`);

    return of(this.getMockStudents());
  }

  /**
   * Obtiene un estudiante por su código
   */
  getStudentByCodigo(codigo: string): Observable<Student | null> {
    // TODO: Implementar llamada real al backend
    // return this.http.get<Student>(`${this.apiUrl}/students/${codigo}`);

    const students = this.getMockStudents();
    const student = students.find(s => s.codigo === codigo);
    return of(student || null);
  }

  // ============================================
  // MÉTODOS PARA DOCENTES
  // ============================================

  /**
   * Carga un archivo Excel de docentes al servidor
   * @param file Archivo Excel a cargar
   * @returns Observable con el progreso y resultado de la carga
   */
  uploadTeachersFile(file: File): Observable<TeacherUploadResponse> {
    // TODO: Implementar llamada real al backend
    // const formData = new FormData();
    // formData.append('file', file);
    // return this.http.post<TeacherUploadResponse>(`${this.apiUrl}/teachers/upload`, formData);

    return of(this.getMockTeacherUploadResponse());
  }

  /**
   * Obtiene la lista de docentes cargados
   */
  getTeachers(): Observable<Teacher[]> {
    // TODO: Implementar llamada real al backend
    // return this.http.get<Teacher[]>(`${this.apiUrl}/teachers`);

    return of(this.getMockTeachers());
  }

  /**
   * Obtiene un docente por su código
   */
  getTeacherByCodigo(codigo: string): Observable<Teacher | null> {
    // TODO: Implementar llamada real al backend
    // return this.http.get<Teacher>(`${this.apiUrl}/teachers/${codigo}`);

    const teachers = this.getMockTeachers();
    const teacher = teachers.find(t => t.codigo === codigo);
    return of(teacher || null);
  }

  // ============================================
  // MÉTODOS GENERALES
  // ============================================

  /**
   * Obtiene estadísticas de las cargas realizadas
   */
  getUploadStats(): Observable<UploadStats> {
    // TODO: Implementar llamada real al backend
    // return this.http.get<UploadStats>(`${this.apiUrl}/stats`);

    return of({
      totalArchivos: 5,
      totalRegistros: 150,
      exitosos: 142,
      errores: 8,
      ultimaCarga: new Date()
    });
  }

  /**
   * Obtiene el historial de resultados de carga
   */
  getUploadHistory(): Observable<UploadResult[]> {
    // TODO: Implementar llamada real al backend
    // return this.http.get<UploadResult[]>(`${this.apiUrl}/history`);

    return of(this.getMockUploadResults());
  }

  /**
   * Valida el formato de un archivo antes de cargarlo
   */
  validateFile(file: File): { valid: boolean; message: string } {
    const maxSize = 10 * 1024 * 1024; // 10 MB
    const allowedTypes = [
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'text/csv'
    ];
    const allowedExtensions = ['.xls', '.xlsx', '.csv'];

    // Validar tamaño
    if (file.size > maxSize) {
      return { valid: false, message: 'El archivo excede el tamaño máximo de 10 MB.' };
    }

    // Validar extensión
    const extension = '.' + file.name.split('.').pop()?.toLowerCase();
    if (!allowedExtensions.includes(extension)) {
      return { valid: false, message: 'Formato no válido. Use archivos .xls, .xlsx o .csv' };
    }

    return { valid: true, message: 'Archivo válido' };
  }

  // ============================================
  // DATOS MOCK PARA DESARROLLO
  // ============================================

  private getMockStudents(): Student[] {
    return [
      { id: 1, codigo: 'EST001', nombres: 'Juan Carlos', apellidos: 'Pérez García', email: 'jperez@uni.edu', carrera: 'Ingeniería de Sistemas', semestre: 5, estado: 'activo' },
      { id: 2, codigo: 'EST002', nombres: 'María Fernanda', apellidos: 'López Ruiz', email: 'mlopez@uni.edu', carrera: 'Ingeniería Industrial', semestre: 3, estado: 'activo' },
      { id: 3, codigo: 'EST003', nombres: 'Carlos Andrés', apellidos: 'Gómez Torres', email: 'cgomez@uni.edu', carrera: 'Administración', semestre: 7, estado: 'activo' },
    ];
  }

  private getMockTeachers(): Teacher[] {
    return [
      { id: 1, codigo: 'DOC001', nombres: 'Roberto', apellidos: 'Martínez Silva', email: 'rmartinez@uni.edu', departamento: 'Sistemas', especialidad: 'Bases de Datos', tipoContrato: 'tiempo_completo', estado: 'activo' },
      { id: 2, codigo: 'DOC002', nombres: 'Ana María', apellidos: 'Rodríguez Vega', email: 'arodriguez@uni.edu', departamento: 'Industrial', especialidad: 'Logística', tipoContrato: 'tiempo_completo', estado: 'activo' },
    ];
  }

  private getMockStudentUploadResponse(): StudentUploadResponse {
    return {
      totalProcesados: 10,
      exitosos: 8,
      errores: 2,
      detalles: [
        { fila: 1, codigo: 'EST001', estado: 'success', mensaje: 'Estudiante registrado correctamente' },
        { fila: 2, codigo: 'EST002', estado: 'success', mensaje: 'Estudiante registrado correctamente' },
        { fila: 3, codigo: 'EST003', estado: 'error', mensaje: 'Email duplicado en el sistema' },
      ]
    };
  }

  private getMockTeacherUploadResponse(): TeacherUploadResponse {
    return {
      totalProcesados: 5,
      exitosos: 4,
      errores: 1,
      detalles: [
        { fila: 1, codigo: 'DOC001', estado: 'success', mensaje: 'Docente registrado correctamente' },
        { fila: 2, codigo: 'DOC002', estado: 'error', mensaje: 'Código ya existe en el sistema' },
      ]
    };
  }

  private getMockUploadResults(): UploadResult[] {
    return [
      { id: 1, tipo: 'Estudiantes', status: 'success', message: 'Juan Pérez registrado correctamente', timestamp: new Date() },
      { id: 2, tipo: 'Estudiantes', status: 'success', message: 'María López registrada correctamente', timestamp: new Date() },
      { id: 3, tipo: 'Estudiantes', status: 'error', message: 'Error: Email duplicado para Carlos Gómez', timestamp: new Date() },
      { id: 4, tipo: 'Docentes', status: 'success', message: 'Roberto Martínez registrado correctamente', timestamp: new Date() },
      { id: 5, tipo: 'Docentes', status: 'error', message: 'Error: Código DOC002 ya existe', timestamp: new Date() },
    ];
  }
}
