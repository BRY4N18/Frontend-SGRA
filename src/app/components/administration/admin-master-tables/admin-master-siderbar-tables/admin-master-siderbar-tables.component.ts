import { Component ,Input, Output, EventEmitter} from '@angular/core';
import { CommonModule } from '@angular/common';
import { GCatalog } from '../../../../models/administration/admin-master-tables/GCatalog';

@Component({
  selector: 'app-admin-master-siderbar-tables',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './admin-master-siderbar-tables.component.html',
  styleUrl: './admin-master-siderbar-tables.component.css',
})
export class AdminMasterSiderbarTablesComponent {
  @Input() catalogs: GCatalog[] = [];
  @Input() selectedCatalogSchema: string | null = null;
  @Input() isLoading: boolean = false;

  @Output() catalogSelected = new EventEmitter<string>();

  selectCatalog(schema: string): void {
    this.catalogSelected.emit(schema);
  }
}
