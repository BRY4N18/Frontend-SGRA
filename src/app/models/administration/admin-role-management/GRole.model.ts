export interface GRole {
  idg: number;
  nombreg: string;
  descripciong: string;
  permisosg: number;
  estadog: 'activo' | 'inactivo';
  fechacreaciong: Date;
}
