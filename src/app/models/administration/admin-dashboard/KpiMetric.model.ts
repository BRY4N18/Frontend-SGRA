export interface KpiMetric {
  userActive: number;
  userIncative: number;
  rolesActive: number;
  rolesInactive: number;
}

export interface KpiCard {
  id: string;
  value: number;
  label: string;
  icon: string;
  theme: string;
}
