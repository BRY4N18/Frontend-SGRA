export interface GRole {
  idg: number;
  nombreg: string;
  descripciong: string;
  permisosg: number;
  estadog: 'activo' | 'inactivo';
  fechacreaciong: Date;
}

export interface GRoleCUD {
  roleGId?: number;
  roleG: string;
  description: string;
  state: boolean;
}
