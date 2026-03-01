export interface GRoleServer {
  pidgrol: number;
  pgrol: string;
  pgdescripcion: string;
  prelacion: boolean;
}

export interface GRoleApp{
  pidrol: number;
  prol: string;
  grolesconection: GRoleServer[];
}

export interface GRolesAppServerCUD{
  roleAppGId: number;
  serverRoleIds: number[];
}
