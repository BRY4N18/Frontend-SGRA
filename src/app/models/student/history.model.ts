/**
 * Student History Models
 * DTOs for history endpoints
 */

export interface HistoryFilter {
  periodId?: number | null;
  stateId?: number | null;
  page?: number;
  size?: number;
}

export interface HistoryRequestItem {
  requestId: number;
  createdAt: string;
  subjectName: string;
  syllabusName: string;
  unit: number;
  teacherName: string;
  sessionType: string;
  statusId: number;
  statusName: string;
  reason: string;
  requestedDay: number;
}

export interface HistoryRequestsPage {
  items: HistoryRequestItem[];
  totalCount: number;
  page: number;
  size: number;
}

export interface SessionsFilter {
  page?: number;
  size?: number;
  onlyAttended?: boolean;
}

export interface HistorySessionItem {
  completedSessionId: number;
  attended: boolean;
  duration: string;
  notes: string;
  requestId: number;
  requestDateTime: string;
  subjectName: string;
  syllabusName: string;
  unit: number;
  teacherName: string;
  sessionType: string;
}

export interface HistorySessionsPage {
  items: HistorySessionItem[];
  totalCount: number;
  page: number;
  size: number;
}

