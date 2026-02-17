/**
 * Modelo para representar un Docente cargado desde Excel
 * RF26 - Carga de Información Base
 */
export interface Teacher {
  id?: number;
  codigo: string;
  nombres: string;
  apellidos: string;
  email: string;
  departamento: string;
  especialidad: string;
  tipoContrato: 'tiempo_completo' | 'medio_tiempo' | 'hora_catedra';
  estado: 'activo' | 'inactivo';
  fechaIngreso?: Date;
}

/**
 * DTO para enviar datos de docente al backend
 */
export interface TeacherCreateDTO {
  codigo: string;
  nombres: string;
  apellidos: string;
  email: string;
  departamento: string;
  especialidad: string;
  tipoContrato: 'tiempo_completo' | 'medio_tiempo' | 'hora_catedra';
}

/**
 * Respuesta del backend al cargar docentes
 */
export interface TeacherUploadResponse {
  totalProcesados: number;
  exitosos: number;
  errores: number;
  detalles: TeacherUploadDetail[];
}

export interface TeacherUploadDetail {
  fila: number;
  codigo: string;
  estado: 'success' | 'error';
  mensaje: string;
}
