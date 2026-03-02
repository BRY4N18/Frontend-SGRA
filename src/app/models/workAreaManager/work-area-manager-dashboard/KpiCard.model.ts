export interface WamKpiMetric {
  registeredSpaces: number;
  pendingRequests: number;
  approvedRequests: number;
  rejectedRequests: number;
}

export interface WamKpiCard {
  id: number;
  icon: string;
  theme: string;
  value: number;
  label: string;
  subtitle: string;
}
