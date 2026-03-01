/**
 * Student Invitation Models
 * DTOs para las invitaciones a tutorías grupales del estudiante.
 */

export interface InvitationItem {
  participantId: number;
  requestId: number;
  subjectName: string;
  semester: number;
  requesterName: string;
  requesterEmail: string;
  teacherName: string;
  sessionType: string;
  reason: string;
  requestDate: string;
  totalInvited: number;
  totalAccepted: number;
}

export interface InvitationResponse {
  success: boolean;
  message: string;
}

