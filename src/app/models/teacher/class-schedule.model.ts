/**
 * Teacher Class Schedule Models
 * DTOs for teacher class schedule detail
 */

/** Represents a detailed class schedule entry for a teacher */
export interface ClassScheduleDetail {
  // Horario de clase
  idClassSchedule: number;
  day: number;
  active: boolean;

  // Franja horaria
  timeSlotId: number;
  startTime: string;   // HH:mm
  endTime: string;      // HH:mm

  // Clase asignada
  classId: number;

  // Docente
  teachingId: number;
  teacherFirstName: string;
  teacherLastName: string;
  teacherIdentification: string;

  // Asignatura
  subjectId: number;
  subjectName: string;
  semester: number;

  // Paralelo
  parallelId: number;
  section: string;

  // Periodo
  periodId: number;
  period: string;
  periodStartDate: string;  // yyyy-MM-dd
  periodEndDate: string;    // yyyy-MM-dd
}
