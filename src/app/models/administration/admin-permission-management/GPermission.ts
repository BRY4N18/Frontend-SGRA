export interface GTablePermission {
  tableName: string;
  description: string;
  canRead: boolean;
  canCreate: boolean;
  canUpdate: boolean;
  canDelete: boolean;
}
