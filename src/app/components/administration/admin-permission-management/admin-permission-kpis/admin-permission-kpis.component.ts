import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GPermissionMetrics } from '../../../../models/administration/admin-permission-management/GPermissionMetrics';

@Component({
  selector: 'app-admin-permission-kpis',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './admin-permission-kpis.component.html',
  styleUrl: './admin-permission-kpis.component.css',
})
export class AdminPermissionKpisComponent {
  @Input() metrics: GPermissionMetrics | null = null;
  @Input() isLoading: boolean = false;
}
