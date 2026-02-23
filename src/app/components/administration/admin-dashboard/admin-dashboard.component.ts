import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AdminDashboardService } from '../../../services/administration/admin-dashboard/admin-dashboard.service';
import { KpiCard, KpiMetric } from '../../../models/administration/admin-dashboard/KpiMetric.model';
import { AuditLog } from '../../../models/administration/admin-dashboard/AuditLog.model';
import { QuickAction } from '../../../models/administration/admin-dashboard/QuickAction.model';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './admin-dashboard.component.html',
  styleUrl: './admin-dashboard.component.css',
})
export class AdminDashboardComponent implements OnInit{

  kpiCard: KpiCard[] = [];
  logs: AuditLog[] = [];
  quickActions: QuickAction[] = [];

  private dashboardService = inject(AdminDashboardService);
  private cdr = inject(ChangeDetectorRef);

  ngOnInit(): void {
    this.quickActions = this.dashboardService.getQuickActions();
    this.loadDashboardData();
  }

  private loadDashboardData(): void{
    this.dashboardService.getKpis().subscribe({
      next: (data) => {
        this.kpiCard = data;
        this.cdr.detectChanges();
      },
      error: (err) => console.error("Error cargando KPI's: " + err)
  });
    this.dashboardService.getRecentLogs().subscribe(data => this.logs = data);
  }
}
