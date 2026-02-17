export interface AuditLog {
  id: number;
  action: string;
  user: string;
  timeAgo: string;
  status: 'Aprobado' | 'Completado' | 'En revision';
}
