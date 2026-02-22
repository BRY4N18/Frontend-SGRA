import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GCatalogRecord } from '../../../../models/administration/admin-master-tables/GCatalogRecord';

@Component({
  selector: 'app-admin-master-table-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './admin-master-table-list.component.html',
  styleUrl: './admin-master-table-list.component.css',
})
export class AdminMasterTableListComponent {
  @Input() records: GCatalogRecord[] = [];
  @Input() catalogName: string = 'Seleccione un catálogo';
  @Input() isLoading: boolean = false;

  @Output() editRecord = new EventEmitter<GCatalogRecord>();
  @Output() createRecord = new EventEmitter<void>();

  onEditClick(record: GCatalogRecord) {
    this.editRecord.emit(record);
  }

  onCreateClick() {
    this.createRecord.emit();
  }
}
