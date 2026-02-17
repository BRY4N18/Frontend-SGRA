export interface GUser {
  id: number;
  username: string;
  role: string;
  status: 'activo' | 'inactivo';
  createdAt: Date;
}
