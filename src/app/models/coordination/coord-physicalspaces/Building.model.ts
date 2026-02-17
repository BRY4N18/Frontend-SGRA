/**
 * Modelo para representar un Edificio
 */
export interface Building {
  id?: number;
  codigo: string;
  nombre: string;
  direccion?: string;
  numeroPisos: number;
  totalEspacios: number;
  estado: 'activo' | 'inactivo' | 'mantenimiento';
  imagen?: string;
  coordenadas?: {
    latitud: number;
    longitud: number;
  };
}

/**
 * DTO para crear/editar un edificio
 */
export interface BuildingDTO {
  codigo: string;
  nombre: string;
  direccion?: string;
  numeroPisos: number;
}

/**
 * Resumen de edificio para selects
 */
export interface BuildingSelect {
  id: number;
  nombre: string;
  codigo: string;
}
