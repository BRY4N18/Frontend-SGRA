/**
 * Student Catalog Models
 * DTOs for catalog endpoints in the student module
 */

export interface SubjectItem {
  subjectId: number;
  subjectName: string;
  semester: number;
}

export interface SyllabusItem {
  syllabusId: number;
  syllabusName: string;
  unit: number;
}

export interface TeacherItem {
  teacherId: number;
  fullName: string;      // Backend uses fullName, not teacherName
  email: string;         // Backend uses email, not teacherEmail
  modalityId?: number;
}

export interface ModalityItem {
  modalityId: number;
  modalityName: string;
}

export interface SessionTypeItem {
  sessionTypeId: number;
  sessionTypeName: string;
}

export interface TimeSlotItem {
  timeSlotId: number;
  label: string;          // Backend uses label, not timeSlotLabel
  timeSlotJson: string;
}

