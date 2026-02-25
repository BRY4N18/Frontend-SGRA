import { Component, inject, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GCatalog } from '../../../models/administration/admin-master-tables/GCatalog';
import { GCatalogRecord } from '../../../models/administration/admin-master-tables/GCatalogRecord';
import { GCatalogMetrics } from './../../../models/administration/admin-master-tables/GCatalogMetrics';
import { AdminMasterTablesService } from '../../../services/administration/admin-master-tables/admin-master-tables.service';
import { AdminMasterKpisComponent } from './admin-master-kpis/admin-master-kpis.component';
import { AdminMasterSiderbarTablesComponent } from './admin-master-siderbar-tables/admin-master-siderbar-tables.component';
import { AdminMasterTableListComponent } from './admin-master-table-list/admin-master-table-list.component';
import { AdminMasterCreateModalComponent } from "./admin-master-create-modal/admin-master-create-modal.component";

declare var bootstrap: any;

@Component({
  selector: 'app-admin-master-tables',
  standalone: true,
  imports: [CommonModule, AdminMasterKpisComponent, AdminMasterSiderbarTablesComponent, AdminMasterTableListComponent, AdminMasterCreateModalComponent],
  templateUrl: './admin-master-tables.component.html',
  styleUrl: './admin-master-tables.component.css',
})
export class AdminMasterTablesComponent implements OnInit{
  selectedRecordToEdit: GCatalogRecord | null = null;
  catalogs: GCatalog[] = [];
  metrics: GCatalogMetrics = { totalCatalogs: 0, activeRecords: 0, totalRecords: 0 };
  currentFilter: string = '';

  currentRecords: GCatalogRecord[] = [];
  selectedCatalogSchema: string | null = null;
  selectedCatalogName: string = 'Seleccione un catálogo';

  isLoadingCatalogs: boolean = true;
  isLoadingRecords: boolean = false;

  private catalogService = inject(AdminMasterTablesService);
  private cdr = inject(ChangeDetectorRef);

  ngOnInit(): void {
    this.loadGlobalMetrics();

    this.catalogService.getCatalogs().subscribe(data => {
      this.catalogs = data;
      this.isLoadingCatalogs = false;
      this.metrics.totalCatalogs = this.catalogs.length;
      this.cdr.detectChanges();

      if (this.catalogs.length > 0) {
        this.onCatalogSelected(this.catalogs[0].pesquematabla);
      }
    });
  }

  onSearch(text: string): void {
    this.currentFilter = text;
    if (this.selectedCatalogSchema) {
      this.loadRecords(this.selectedCatalogSchema, this.currentFilter);
    }
  }

  loadRecords(schema: string, filter: string): void {
    this.isLoadingRecords = true;
    this.catalogService.getRecordsByCatalog(schema, filter).subscribe(data => {
      this.currentRecords = data;
      this.isLoadingRecords = false;
      this.cdr.detectChanges();
    });
  }

  loadGlobalMetrics(): void {
    this.catalogService.getMetrics().subscribe(data => {
      if (data) {
        this.metrics.activeRecords = data.activeRecords;
        this.metrics.totalRecords = data.totalRecords;
        this.cdr.detectChanges();
      }
    });
  }

  onCatalogSelected(pschematable: string): void {
    if (this.selectedCatalogSchema === pschematable) return;

    this.selectedCatalogSchema = pschematable;
    this.currentRecords = [];
    this.currentFilter = '';
    this.isLoadingRecords = true;

    const found = this.catalogs.find(c => c.pesquematabla === pschematable);
    this.selectedCatalogName = found ? found.pnombre : 'Catálogo';

    this.loadRecords(pschematable, '');

    this.catalogService.getRecordsByCatalog(pschematable).subscribe(data => {
      this.currentRecords = data;
      this.isLoadingRecords = false;
      this.cdr.detectChanges();
    });
  }

  prepareCreate() {
    this.selectedRecordToEdit = null;
    this.openModal();
  }

  prepareEdit(record: GCatalogRecord) {
    this.selectedRecordToEdit = { ...record };
    this.openModal();
  }

  openModal(): void {
    const modalElement = document.getElementById('createMasterModal');
    if (modalElement) {
      const modal = new bootstrap.Modal(modalElement);
      modal.show();
    }
  }

  reloadCurrentCatalog(): void {
    if (!this.selectedCatalogSchema) return;
    this.catalogService.getRecordsByCatalog(this.selectedCatalogSchema).subscribe({
      next: (data) => {
        this.currentRecords = data;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error recargando la tabla', err);
      }
    });
    this.loadGlobalMetrics();
  }
}
