import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { WamKpiCard, WamQuickAction } from '../../../models/workAreaManager/work-area-manager-dashboard';
import { WamDashboardService } from '../../../services/workAreaManager/work-area-manager-dashboard/wam-dashboard.service';

@Component({
  selector: 'app-work-area-manager-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './work-area-manager-dashboard.component.html',
  styleUrl: './work-area-manager-dashboard.component.css',
})
export class WorkAreaManagerDashboardComponent implements OnInit {
  private router = inject(Router);
  private dashboardService = inject(WamDashboardService);
  private cdr = inject(ChangeDetectorRef);

  kpiCards: WamKpiCard[] = [];
  quickActions: WamQuickAction[] = [];

  ngOnInit(): void {
    this.quickActions = this.dashboardService.getQuickActions();
    this.loadKpis();
  }

  private loadKpis(): void {
    this.dashboardService.getKpis().subscribe({
      next: (data) => {
        this.kpiCards = data;
        this.cdr.detectChanges();
      },
      error: (err) => console.error('Error al cargar KPIs:', err),
    });
  }

  navigateTo(path: string): void {
    this.router.navigate([path]);
  }
}
