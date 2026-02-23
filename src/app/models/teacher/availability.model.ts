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

/** Response from the API with teacher's current availability */
export interface TeacherAvailabilityResponse {
  days: DayOfWeek[];
  timeBlocks: TimeBlock[];
  slots: AvailabilitySlot[];
}

/** Payload to save/update teacher availability */
export interface SaveAvailabilityPayload {
  slots: { dayId: number; timeBlockId: number }[];
}

/** Generic API response */
export interface SaveAvailabilityResponse {
  message: string;
}
