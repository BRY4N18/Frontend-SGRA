/**
 * Teacher Availability Models
 * DTOs for teacher availability/schedule grid
 */

/** Represents a single time slot in the availability grid */
export interface TimeBlock {
  timeBlockId: number;
  startTime: string;   // e.g. "07:30"
  endTime: string;     // e.g. "08:30"
  section: ScheduleSection; // matutina | vespertina | nocturna
}

/** Schedule section type */
export type ScheduleSection = 'matutina' | 'vespertina' | 'nocturna';

/** Section metadata for display */
export interface SectionInfo {
  key: ScheduleSection;
  label: string;
  icon: string;
  range: string;
  colorClass: string;
}

/** Represents a day of the week */
export interface DayOfWeek {
  dayId: number;
  dayName: string;     // e.g. "Lun", "Mar"
  dayFullName: string; // e.g. "Lunes", "Martes"
}

/** Status of a slot in the grid */
export type SlotStatus = 'available' | 'conflict' | 'empty' | 'scheduled';

/** A single cell in the availability grid */
export interface AvailabilitySlot {
  dayId: number;
  timeBlockId: number;
  status: SlotStatus;
}

/** Single saved availability slot from the API */
export interface TeacherAvailabilityItem {
  dayOfWeek: number;
  timeSlotId: number;
}

/** Payload to save/update teacher availability */
export interface SaveAvailabilityPayload {
  userId: number;
  periodId: number;
  slots: { dayOfWeek: number; timeSlotId: number }[];
}

/** Generic API response */
export interface SaveAvailabilityResponse {
  message: string;
}
