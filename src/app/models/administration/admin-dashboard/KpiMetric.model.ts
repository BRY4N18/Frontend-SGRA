export interface KpiMetric {
  id: string;
  label: string;
  value: number;
  icon: string;
  theme: 'blue' | 'purple' | 'green' | 'orange';
}
