/**
 * Modelo para representar un Estudiante cargado desde Excel
 * RF26 - Carga de Información Base
 */
export interface Student {
  id?: number;
  codigo: string;
  nombres: string;
  apellidos: string;
  email: string;
  carrera: string;
  semestre: number;
  estado: 'activo' | 'inactivo';
  fechaIngreso?: Date;
}

/**
 * DTO para enviar datos de estudiante al backend
 */
export interface StudentCreateDTO {
  codigo: string;
  nombres: string;
  apellidos: string;
  email: string;
  carrera: string;
  semestre: number;
}

/**
 * Respuesta del backend al cargar estudiantes
 */
export interface StudentUploadResponse {
  totalProcesados: number;
  exitosos: number;
  errores: number;
  detalles: StudentUploadDetail[];
}

export interface StudentUploadDetail {
  fila: number;
  codigo: string;
  estado: 'success' | 'error';
  mensaje: string;
}
