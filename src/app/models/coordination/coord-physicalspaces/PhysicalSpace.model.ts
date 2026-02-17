/**
 * Modelo para representar un Espacio Físico
 * RF - Gestión de Espacios Físicos
 */
export interface PhysicalSpace {
  id?: number;
  codigo: string;
  nombre: string;
  tipo: SpaceType;
  edificioId: number;
  edificioNombre?: string;
  piso: number;
  capacidad: number;
  estado: 'disponible' | 'ocupado' | 'mantenimiento' | 'inactivo';
  recursos: SpaceResource[];
  horarioDisponible?: ScheduleAvailability;
  descripcion?: string;
  imagen?: string;
}

/**
 * Tipos de espacio disponibles
 */
export type SpaceType =
  | 'aula'
  | 'laboratorio'
  | 'auditorio'
  | 'sala_reuniones'
  | 'biblioteca'
  | 'cancha'
  | 'oficina'
  | 'otro';

/**
 * Recursos disponibles en un espacio
 */
export interface SpaceResource {
  id?: number;
  nombre: string;
  cantidad: number;
  estado: 'funcionando' | 'dañado' | 'en_reparacion';
}

/**
 * Disponibilidad de horario
 */
export interface ScheduleAvailability {
  lunes: TimeSlot[];
  martes: TimeSlot[];
  miercoles: TimeSlot[];
  jueves: TimeSlot[];
  viernes: TimeSlot[];
  sabado: TimeSlot[];
  domingo: TimeSlot[];
}

export interface TimeSlot {
  inicio: string; // "08:00"
  fin: string;    // "10:00"
  disponible: boolean;
}

/**
 * DTO para crear/editar un espacio físico
 */
export interface PhysicalSpaceDTO {
  codigo: string;
  nombre: string;
  tipo: SpaceType;
  edificioId: number;
  piso: number;
  capacidad: number;
  recursos?: SpaceResource[];
  descripcion?: string;
}

/**
 * Filtros para búsqueda de espacios
 */
export interface SpaceSearchFilters {
  tipo?: SpaceType;
  edificioId?: number;
  capacidadMinima?: number;
  estado?: string;
  fecha?: Date;
  horaInicio?: string;
  horaFin?: string;
}
