import { Component, inject, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GCatalog } from '../../../models/administration/admin-master-tables/GCatalog';
import { GCatalogRecord } from '../../../models/administration/admin-master-tables/GCatalogRecord';
import { GCatalogMetrics } from './../../../models/administration/admin-master-tables/GCatalogMetrics';
import { AdminMasterTablesService } from '../../../services/administration/admin-master-tables/admin-master-tables.service';
import { AdminMasterKpisComponent } from './admin-master-kpis/admin-master-kpis.component';
import { AdminMasterSiderbarTablesComponent } from './admin-master-siderbar-tables/admin-master-siderbar-tables.component';
import { AdminMasterTableListComponent } from './admin-master-table-list/admin-master-table-list.component';

@Component({
  selector: 'app-admin-master-tables',
  standalone: true,
  imports: [CommonModule, AdminMasterKpisComponent, AdminMasterSiderbarTablesComponent, AdminMasterTableListComponent],
  templateUrl: './admin-master-tables.component.html',
  styleUrl: './admin-master-tables.component.css',
})
export class AdminMasterTablesComponent implements OnInit{
  catalogs: GCatalog[] = [];
  metrics: GCatalogMetrics | null = null;

  currentRecords: GCatalogRecord[] = [];
  selectedCatalogSchema: string | null = null;
  selectedCatalogName: string = 'Seleccione un catálogo';

  isLoadingCatalogs: boolean = true;
  isLoadingRecords: boolean = false;

  private catalogService = inject(AdminMasterTablesService);
  private cdr = inject(ChangeDetectorRef);

  ngOnInit(): void {
    this.catalogService.getMetrics().subscribe(data => this.metrics = data);

    this.catalogService.getCatalogs().subscribe(data => {
      this.catalogs = data;
      this.isLoadingCatalogs = false;
      this.cdr.detectChanges();

      if (this.catalogs.length > 0) {
        this.onCatalogSelected(this.catalogs[0].pesquematabla);
      }
    });
  }

  onCatalogSelected(pschematable: string): void {
    if (this.selectedCatalogSchema === pschematable) return;

    this.selectedCatalogSchema = pschematable;

    this.currentRecords = [];
    this.isLoadingRecords = true;

    const found = this.catalogs.find(c => c.pesquematabla === pschematable);
    this.selectedCatalogName = found ? found.pnombre : 'Catálogo';

    this.catalogService.getRecordsByCatalog(pschematable).subscribe(data => {
      this.currentRecords = data;
      this.isLoadingRecords = false;
      this.cdr.detectChanges();
    });
  }
}
