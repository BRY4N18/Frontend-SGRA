export interface GUser {
  idgu: number;
  usuariogu: string;
  rolesasignadosgu: number;
  estadogu: string;
  fechacreaciongu: Date;
}

export interface GUserCUD{
  userGId?: number;
  user: string;
  password?: string;
  state: boolean;
}
