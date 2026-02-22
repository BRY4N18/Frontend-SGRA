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
  roles: number[];
  state: boolean;
}

export interface GUserDetail {
  idgu: number;
  usuariogu: string;
  contrasena: string;
  estadogu: string;
  roles: number[];
  rolesasignadosgu?: string;
}
