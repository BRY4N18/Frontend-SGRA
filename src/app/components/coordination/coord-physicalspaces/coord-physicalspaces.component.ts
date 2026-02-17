import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CoordPhysicalspacesService } from '../../../services/coordination/coord-physicalspaces/coord-physicalspaces.service';
import { PhysicalSpace, SpaceType, SpaceSearchFilters } from '../../../models/coordination/coord-physicalspaces';
import { BuildingSelect } from '../../../models/coordination/coord-physicalspaces/Building.model';

@Component({
  selector: 'app-coord-physicalspaces',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './coord-physicalspaces.component.html',
  styleUrl: './coord-physicalspaces.component.css',
})
export class CoordPhysicalspacesComponent implements OnInit {
  // Lista de espacios
  spaces: PhysicalSpace[] = [];
  filteredSpaces: PhysicalSpace[] = [];

  // Opciones para filtros
  buildings: BuildingSelect[] = [];
  spaceTypes: { value: SpaceType; label: string }[] = [];

  // Filtros activos
  filters: SpaceSearchFilters = {};
  searchTerm = '';

  // Estado de carga
  isLoading = false;

  constructor(private spacesService: CoordPhysicalspacesService) {}

  ngOnInit(): void {
    this.loadInitialData();
  }

  private loadInitialData(): void {
    this.isLoading = true;

    // Cargar espacios
    this.spacesService.getSpaces().subscribe(spaces => {
      this.spaces = spaces;
      this.filteredSpaces = spaces;
      this.isLoading = false;
    });

    // Cargar edificios para select
    this.spacesService.getBuildingsForSelect().subscribe(buildings => {
      this.buildings = buildings;
    });

    // Cargar tipos de espacio
    this.spacesService.getSpaceTypes().subscribe(types => {
      this.spaceTypes = types;
    });
  }

  applyFilters(): void {
    this.spacesService.searchSpaces(this.filters).subscribe(spaces => {
      this.filteredSpaces = spaces.filter(space =>
        space.nombre.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        space.codigo.toLowerCase().includes(this.searchTerm.toLowerCase())
      );
    });
  }

  clearFilters(): void {
    this.filters = {};
    this.searchTerm = '';
    this.filteredSpaces = this.spaces;
  }

  changeStatus(spaceId: number, newStatus: PhysicalSpace['estado']): void {
    this.spacesService.changeSpaceStatus(spaceId, newStatus).subscribe(() => {
      const space = this.spaces.find(s => s.id === spaceId);
      if (space) {
        space.estado = newStatus;
      }
    });
  }

  getStatusBadgeClass(estado: string): string {
    const classes: Record<string, string> = {
      disponible: 'bg-success',
      ocupado: 'bg-danger',
      mantenimiento: 'bg-warning',
      inactivo: 'bg-secondary'
    };
    return classes[estado] || 'bg-secondary';
  }
}
