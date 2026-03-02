export interface GEmailConfig {
  pidconfiguracioncorreo: number;
  pcorreoemisor: string;
  pfechahoracreacion: Date;
  pestadop: string;
}

export interface GEmailConfigCUD {
  pidconfiguracioncorreo?: number;
  idusuario: number;
  pcorreoemisor: string;
  paplicacionsontrasena: string;
}

export interface GEmailConfigDetail {
  idCorreo: number;
  correo: string;
  contrasenaApp: string;
  estado: string;
}
