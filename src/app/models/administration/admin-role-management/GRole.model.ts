export interface GRole {
  id: number;
  name: string;
  description: string;
  permissionsCount: number;
  status: 'activo' | 'inactivo';
  createdAt: Date;
}
