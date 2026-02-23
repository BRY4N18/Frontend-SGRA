/**
 * Teacher Reinforcement Request Models
 * DTOs for request listing, summary, and status updates
 */

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

export interface TeacherRequestsPageDTO {
    items: TeacherRequestRowDTO[];
    totalCount: number;
    page: number;
    size: number;
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
