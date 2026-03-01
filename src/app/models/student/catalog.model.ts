/**
 * Student Catalog Models
 * DTOs para los endpoints de catálogo del módulo estudiante (simplificado)
 */

export interface SubjectItem {
  subjectId: number;
  subjectName: string;
  semester: number;
}

/**
 * Docente asignado al paralelo del estudiante para una asignatura.
 * Retornado por GET /api/student/catalogs/subjects/{subjectId}/teacher
 */
export interface StudentSubjectTeacher {
  teacherId: number;
  fullName: string;
  email: string;
}

export interface SessionTypeItem {
  sessionTypeId: number;
  sessionTypeName: string;
}

/**
 * Periodo académico activo.
 * Retornado por GET /api/student/catalogs/active-period
 */
export interface ActivePeriod {
  periodId: number;
  periodName: string;
}

/**
 * Compañero matriculado en la misma asignatura.
 * Retornado por GET /api/student/catalogs/subjects/{subjectId}/classmates
 */
export interface ClassmateItem {
  studentId: number;
  fullName: string;
  email: string;
}

