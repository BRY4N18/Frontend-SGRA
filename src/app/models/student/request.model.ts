/**
 * Student Request Models
 * DTOs para creación de solicitudes de refuerzo (simplificado)
 */

// Create Request (simplificado - docente y periodo se resuelven en backend)
export interface CreateRequestPayload {
  subjectId: number;
  sessionTypeId: number;
  reason: string;
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

