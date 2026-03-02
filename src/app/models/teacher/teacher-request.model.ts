/**
 * Teacher Reinforcement Request & Session Models
 * Aligned to /api/teacher endpoints
 */

// ─── Requests List ────────────────────────────────────────────────────────────

export interface TeacherRequestItemDTO {
  requestId: number;
  studentName: string;
  subjectName: string;
  sessionType: string;
  reason: string;
  statusName: string;
  statusId: number;
  createdAt: string;
  isGroupal: boolean;
  participantCount: number;
}

export interface TeacherRequestsPageDTO {
  items: TeacherRequestItemDTO[];
  totalCount: number;
  page: number;
  size: number;
  totalPages: number;
}

// ─── Accept / Reschedule body ─────────────────────────────────────────────────

export interface AcceptRescheduleBodyDTO {
  scheduledDate: string;        // YYYY-MM-DD
  timeSlotId: number;
  modalityId: number;
  estimatedDuration: string;    // HH:mm
  reason?: string;
  workAreaId?: number;          // required when modalityId = 2 (presencial)
}

// ─── Reject / Cancel body ─────────────────────────────────────────────────────

export interface ReasonBodyDTO {
  reason?: string;
}

// ─── Generic API response ────────────────────────────────────────────────────

export interface ApiActionResponseDTO {
  id: number;
  status: string;
  message: string;
}

// ─── Sessions ────────────────────────────────────────────────────────────────

export interface VirtualLinkBodyDTO {
  url: string;
}

export interface AttendanceEntryDTO {
  participantId: number;
  attended: boolean;
}

export interface RegisterAttendanceBodyDTO {
  performedId: number;
  attendances: AttendanceEntryDTO[];
}

// ─── History ─────────────────────────────────────────────────────────────────

export interface TeacherHistoryItemDTO {
  scheduledId: number;
  subjectName: string;
  scheduledDate: string;
  modality: string;
  estimatedDuration: string;
  timeSlot: string;
  statusName: string;
  sessionType: string;
  studentCount: number;
}

export interface TeacherHistoryPageDTO {
  items: TeacherHistoryItemDTO[];
  totalCount: number;
  page: number;
  size: number;
  totalPages: number;
}

// ─── Legacy / kept for auth-service compatibility ────────────────────────────

/** @deprecated Use TeacherRequestItemDTO */
export interface TeacherRequestRowDTO {
  requestId: number;
  requestDateTime: string;
  studentName: string;
  subjectCode: string;
  subjectName: string;
  topic: string;
  sessionType: string;
  status: string;
  totalCount: number;
}

export interface StatusSummaryDTO {
  statusId: number;
  status: any;
  total: number;
}

export interface UpdateStatusResponseDTO {
  requestId: number;
  status: string;
  message: string;
}

export interface ReinforcementRequestStatusDTO {
  idReinforcementRequestStatus: number;
  nameState: string;
  state: boolean;
}

/** @deprecated Use TeacherRequestItemDTO */
export interface ReinforcementRequestDTO {
  reinforcementRequestId: number;
  requestedDay: number;
  reason: string;
  fileUrl: string;
  createdAt: string;
  studentId: number;
  teacherId: number;
  topicId: number;
  timeSlotId: number;
  modalityId: number;
  sessionTypeId: number;
  requestStatusId: number;
  periodId: number;
}
