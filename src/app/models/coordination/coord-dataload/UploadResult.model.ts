/**
 * Modelo para mostrar resultados de carga en la tabla de reporte
 * RF26 - Carga de Información Base
 */
export interface UploadResult {
  id?: number;
  tipo: 'Estudiantes' | 'Docentes';
  status: 'success' | 'error';
  message: string;
  fila?: number;
  codigo?: string;
  timestamp?: Date;
}

/**
 * Estadísticas generales de carga
 */
export interface UploadStats {
  totalArchivos: number;
  totalRegistros: number;
  exitosos: number;
  errores: number;
  ultimaCarga?: Date;
}

/**
 * Configuración de archivo para validación
 */
export interface FileValidationConfig {
  maxSizeMB: number;
  allowedExtensions: string[];
  maxRows?: number;
}

/**
 * Estado de progreso de carga
 */
export interface UploadProgress {
  percentage: number;
  currentStep: string;
  isComplete: boolean;
  hasError: boolean;
  errorMessage?: string;
}
