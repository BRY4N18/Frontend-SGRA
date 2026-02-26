/**
 * Student Request Models
 * DTOs for request creation and preview endpoints
 */

// Preview Request
export interface RequestPreviewPayload {
  syllabusId: number;
  teacherId: number;
  timeSlotId: number;
  modalityId: number;
  sessionTypeId: number;
}

export interface RequestPreviewResponse {
  subjectId: number;
  subjectName: string;
  syllabusId: number;
  syllabusName: string;
  unit: number;
  teacherId: number;
  teacherName: string;
  teacherEmail: string;
  modalityId: number;
  modalityName: string;
  sessionTypeId: number;
  sessionTypeName: string;
  timeSlotId: number;
  timeSlotLabel: string;
  timeSlotJson: string;
}

// Create Request
export interface CreateRequestPayload {
  syllabusId: number;
  teacherId: number;
  timeSlotId: number;
  modalityId: number;
  sessionTypeId: number;
  reason: string;
  requestedDay: number;
  fileUrl?: string | null;
  periodId: number;
  participantIds?: number[];  // IDs de compañeros para sesiones grupales
}

export interface CreateRequestResponse {
  requestId: number;
}

// My Requests
export interface MyRequestsChips {
  pending: number;
  accepted: number;
  scheduled: number;
  completed: number;
}

export interface MyRequestsFilter {
  periodId?: number | null;
  stateId?: number | null;
  typeId?: number | null;
  subjectId?: number | null;
  search?: string | null;
  page?: number;
  size?: number;
}

export interface MyRequestItem {
  requestId: number;
  requestDateTime: string;
  subjectCode: string;
  subjectName: string;
  topic: string;
  teacherName: string;
  sessionType: string;
  status: string;
}

export interface MyRequestsPage {
  items: MyRequestItem[];
  totalCount: number;
  page: number;
  size: number;
}

