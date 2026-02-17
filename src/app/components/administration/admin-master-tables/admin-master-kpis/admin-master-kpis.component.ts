import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GCatalogMetrics } from '../../../../models/administration/admin-master-tables/GCatalogMetrics';

@Component({
  selector: 'app-admin-master-kpis',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './admin-master-kpis.component.html',
  styleUrl: './admin-master-kpis.component.css',
})
export class AdminMasterKpisComponent {
  @Input() metrics: GCatalogMetrics | null = null;
  @Input() isLoading: boolean = false;
}
