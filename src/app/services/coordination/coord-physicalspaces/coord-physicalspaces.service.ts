import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { environment } from '../../../environments/environment';
import {
  PhysicalSpace,
  PhysicalSpaceDTO,
  SpaceType,
  SpaceSearchFilters,
  SpaceResource
} from '../../../models/coordination/coord-physicalspaces/PhysicalSpace.model';
import {
  Building,
  BuildingDTO,
  BuildingSelect
} from '../../../models/coordination/coord-physicalspaces/Building.model';

/**
 * Servicio para la gestión de Espacios Físicos
 * Proporciona CRUD de espacios, edificios y consulta de disponibilidad
 */
@Injectable({
  providedIn: 'root'
})
export class CoordPhysicalspacesService {
  private readonly apiUrl = `${environment.apiUrl}/coordination/physicalspaces`;

  constructor(/* private http: HttpClient */) {
    // HttpClient se inyectará cuando se integre con el backend
  }

  // ============================================
  // MÉTODOS PARA ESPACIOS FÍSICOS
  // ============================================

  /**
   * Obtiene todos los espacios físicos
   */
  getSpaces(): Observable<PhysicalSpace[]> {
    // TODO: Implementar llamada real al backend
    // return this.http.get<PhysicalSpace[]>(`${this.apiUrl}/spaces`);

    return of(this.getMockSpaces());
  }

  /**
   * Obtiene un espacio por su ID
   */
  getSpaceById(id: number): Observable<PhysicalSpace | null> {
    // TODO: Implementar llamada real al backend
    // return this.http.get<PhysicalSpace>(`${this.apiUrl}/spaces/${id}`);

    const spaces = this.getMockSpaces();
    const space = spaces.find(s => s.id === id);
    return of(space || null);
  }

  /**
   * Busca espacios con filtros
   */
  searchSpaces(filters: SpaceSearchFilters): Observable<PhysicalSpace[]> {
    // TODO: Implementar llamada real al backend
    // return this.http.post<PhysicalSpace[]>(`${this.apiUrl}/spaces/search`, filters);

    let spaces = this.getMockSpaces();

    if (filters.tipo) {
      spaces = spaces.filter(s => s.tipo === filters.tipo);
    }
    if (filters.edificioId) {
      spaces = spaces.filter(s => s.edificioId === filters.edificioId);
    }
    if (filters.capacidadMinima) {
      spaces = spaces.filter(s => s.capacidad >= filters.capacidadMinima!);
    }
    if (filters.estado) {
      spaces = spaces.filter(s => s.estado === filters.estado);
    }

    return of(spaces);
  }

  /**
   * Crea un nuevo espacio físico
   */
  createSpace(spaceData: PhysicalSpaceDTO): Observable<PhysicalSpace> {
    // TODO: Implementar llamada real al backend
    // return this.http.post<PhysicalSpace>(`${this.apiUrl}/spaces`, spaceData);

    console.log('Creando espacio:', spaceData);
    const newSpace: PhysicalSpace = {
      id: Date.now(),
      ...spaceData,
      estado: 'disponible',
      recursos: spaceData.recursos || []
    };
    return of(newSpace);
  }

  /**
   * Actualiza un espacio físico existente
   */
  updateSpace(id: number, spaceData: Partial<PhysicalSpaceDTO>): Observable<PhysicalSpace> {
    // TODO: Implementar llamada real al backend
    // return this.http.put<PhysicalSpace>(`${this.apiUrl}/spaces/${id}`, spaceData);

    console.log('Actualizando espacio:', id, spaceData);
    const space = this.getMockSpaces().find(s => s.id === id);
    return of({ ...space!, ...spaceData });
  }

  /**
   * Elimina un espacio físico
   */
  deleteSpace(id: number): Observable<boolean> {
    // TODO: Implementar llamada real al backend
    // return this.http.delete<boolean>(`${this.apiUrl}/spaces/${id}`);

    console.log('Eliminando espacio:', id);
    return of(true);
  }

  /**
   * Cambia el estado de un espacio
   */
  changeSpaceStatus(id: number, estado: PhysicalSpace['estado']): Observable<boolean> {
    // TODO: Implementar llamada real al backend
    // return this.http.patch<boolean>(`${this.apiUrl}/spaces/${id}/status`, { estado });

    console.log('Cambiando estado del espacio:', id, 'a', estado);
    return of(true);
  }

  /**
   * Obtiene los tipos de espacio disponibles
   */
  getSpaceTypes(): Observable<{ value: SpaceType; label: string }[]> {
    return of([
      { value: 'aula', label: 'Aula' },
      { value: 'laboratorio', label: 'Laboratorio' },
      { value: 'auditorio', label: 'Auditorio' },
      { value: 'sala_reuniones', label: 'Sala de Reuniones' },
      { value: 'biblioteca', label: 'Biblioteca' },
      { value: 'cancha', label: 'Cancha' },
      { value: 'oficina', label: 'Oficina' },
      { value: 'otro', label: 'Otro' }
    ]);
  }

  // ============================================
  // MÉTODOS PARA EDIFICIOS
  // ============================================

  /**
   * Obtiene todos los edificios
   */
  getBuildings(): Observable<Building[]> {
    // TODO: Implementar llamada real al backend
    // return this.http.get<Building[]>(`${this.apiUrl}/buildings`);

    return of(this.getMockBuildings());
  }

  /**
   * Obtiene edificios para select/dropdown
   */
  getBuildingsForSelect(): Observable<BuildingSelect[]> {
    // TODO: Implementar llamada real al backend
    // return this.http.get<BuildingSelect[]>(`${this.apiUrl}/buildings/select`);

    return of([
      { id: 1, nombre: 'Edificio Principal', codigo: 'EP' },
      { id: 2, nombre: 'Edificio de Ciencias', codigo: 'EC' },
      { id: 3, nombre: 'Edificio de Ingenierías', codigo: 'EI' },
      { id: 4, nombre: 'Centro de Convenciones', codigo: 'CC' }
    ]);
  }

  /**
   * Obtiene un edificio por su ID
   */
  getBuildingById(id: number): Observable<Building | null> {
    // TODO: Implementar llamada real al backend
    // return this.http.get<Building>(`${this.apiUrl}/buildings/${id}`);

    const buildings = this.getMockBuildings();
    const building = buildings.find(b => b.id === id);
    return of(building || null);
  }

  /**
   * Crea un nuevo edificio
   */
  createBuilding(buildingData: BuildingDTO): Observable<Building> {
    // TODO: Implementar llamada real al backend
    // return this.http.post<Building>(`${this.apiUrl}/buildings`, buildingData);

    console.log('Creando edificio:', buildingData);
    const newBuilding: Building = {
      id: Date.now(),
      ...buildingData,
      totalEspacios: 0,
      estado: 'activo'
    };
    return of(newBuilding);
  }

  /**
   * Actualiza un edificio existente
   */
  updateBuilding(id: number, buildingData: Partial<BuildingDTO>): Observable<Building> {
    // TODO: Implementar llamada real al backend
    // return this.http.put<Building>(`${this.apiUrl}/buildings/${id}`, buildingData);

    console.log('Actualizando edificio:', id, buildingData);
    const building = this.getMockBuildings().find(b => b.id === id);
    return of({ ...building!, ...buildingData });
  }

  /**
   * Elimina un edificio
   */
  deleteBuilding(id: number): Observable<boolean> {
    // TODO: Implementar llamada real al backend
    // return this.http.delete<boolean>(`${this.apiUrl}/buildings/${id}`);

    console.log('Eliminando edificio:', id);
    return of(true);
  }

  // ============================================
  // DISPONIBILIDAD
  // ============================================

  /**
   * Verifica la disponibilidad de un espacio en una fecha y hora
   */
  checkAvailability(spaceId: number, fecha: Date, horaInicio: string, horaFin: string): Observable<boolean> {
    // TODO: Implementar llamada real al backend
    // return this.http.get<boolean>(`${this.apiUrl}/spaces/${spaceId}/availability`, {
    //   params: { fecha: fecha.toISOString(), horaInicio, horaFin }
    // });

    // Mock: 80% de probabilidad de estar disponible
    return of(Math.random() > 0.2);
  }

  /**
   * Obtiene espacios disponibles en un rango de tiempo
   */
  getAvailableSpaces(fecha: Date, horaInicio: string, horaFin: string, tipo?: SpaceType): Observable<PhysicalSpace[]> {
    // TODO: Implementar llamada real al backend
    // return this.http.get<PhysicalSpace[]>(`${this.apiUrl}/spaces/available`, {
    //   params: { fecha: fecha.toISOString(), horaInicio, horaFin, tipo: tipo || '' }
    // });

    let spaces = this.getMockSpaces().filter(s => s.estado === 'disponible');
    if (tipo) {
      spaces = spaces.filter(s => s.tipo === tipo);
    }
    return of(spaces);
  }

  // ============================================
  // DATOS MOCK PARA DESARROLLO
  // ============================================

  private getMockSpaces(): PhysicalSpace[] {
    return [
      {
        id: 1,
        codigo: 'A101',
        nombre: 'Aula 101',
        tipo: 'aula',
        edificioId: 1,
        edificioNombre: 'Edificio Principal',
        piso: 1,
        capacidad: 40,
        estado: 'disponible',
        recursos: [
          { id: 1, nombre: 'Proyector', cantidad: 1, estado: 'funcionando' },
          { id: 2, nombre: 'Pizarra', cantidad: 1, estado: 'funcionando' }
        ],
        descripcion: 'Aula estándar con proyector'
      },
      {
        id: 2,
        codigo: 'LAB-A',
        nombre: 'Laboratorio de Computación A',
        tipo: 'laboratorio',
        edificioId: 2,
        edificioNombre: 'Edificio de Ciencias',
        piso: 2,
        capacidad: 30,
        estado: 'disponible',
        recursos: [
          { id: 3, nombre: 'Computador', cantidad: 30, estado: 'funcionando' },
          { id: 4, nombre: 'Proyector', cantidad: 1, estado: 'funcionando' }
        ],
        descripcion: 'Laboratorio con 30 equipos de cómputo'
      },
      {
        id: 3,
        codigo: 'AUD-01',
        nombre: 'Auditorio Principal',
        tipo: 'auditorio',
        edificioId: 4,
        edificioNombre: 'Centro de Convenciones',
        piso: 1,
        capacidad: 200,
        estado: 'disponible',
        recursos: [
          { id: 5, nombre: 'Sistema de Sonido', cantidad: 1, estado: 'funcionando' },
          { id: 6, nombre: 'Pantalla LED', cantidad: 1, estado: 'funcionando' }
        ],
        descripcion: 'Auditorio para eventos grandes'
      },
      {
        id: 4,
        codigo: 'SR-201',
        nombre: 'Sala de Reuniones 201',
        tipo: 'sala_reuniones',
        edificioId: 1,
        edificioNombre: 'Edificio Principal',
        piso: 2,
        capacidad: 12,
        estado: 'ocupado',
        recursos: [
          { id: 7, nombre: 'TV Smart', cantidad: 1, estado: 'funcionando' },
          { id: 8, nombre: 'Videoconferencia', cantidad: 1, estado: 'funcionando' }
        ],
        descripcion: 'Sala para reuniones ejecutivas'
      },
      {
        id: 5,
        codigo: 'A302',
        nombre: 'Aula 302',
        tipo: 'aula',
        edificioId: 3,
        edificioNombre: 'Edificio de Ingenierías',
        piso: 3,
        capacidad: 35,
        estado: 'mantenimiento',
        recursos: [
          { id: 9, nombre: 'Proyector', cantidad: 1, estado: 'en_reparacion' }
        ],
        descripcion: 'Aula en mantenimiento'
      }
    ];
  }

  private getMockBuildings(): Building[] {
    return [
      { id: 1, codigo: 'EP', nombre: 'Edificio Principal', direccion: 'Campus Central', numeroPisos: 4, totalEspacios: 25, estado: 'activo' },
      { id: 2, codigo: 'EC', nombre: 'Edificio de Ciencias', direccion: 'Campus Norte', numeroPisos: 3, totalEspacios: 18, estado: 'activo' },
      { id: 3, codigo: 'EI', nombre: 'Edificio de Ingenierías', direccion: 'Campus Este', numeroPisos: 5, totalEspacios: 30, estado: 'activo' },
      { id: 4, codigo: 'CC', nombre: 'Centro de Convenciones', direccion: 'Campus Central', numeroPisos: 2, totalEspacios: 8, estado: 'activo' }
    ];
  }
}
