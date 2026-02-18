/**
 * Request Chips DTO
 * Counts of requests by status for dashboard display
 */
export interface RequestChipsDTO {
  pending: number;
  accepted: number;
  scheduled: number;
  completed: number;
}

