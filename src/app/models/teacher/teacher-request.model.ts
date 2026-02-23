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
