import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

interface KpiCard {
  id: number;
  icon: string;
  theme: string;
  value: string | number;
  label: string;
}

interface QuickAction {
  id: number;
  icon: string;
  title: string;
  route: string;
}

@Component({
  selector: 'app-work-area-manager-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './work-area-manager-dashboard.component.html',
  styleUrl: './work-area-manager-dashboard.component.css',
})
export class WorkAreaManagerDashboardComponent {

  kpiCards: KpiCard[] = [
    { id: 1, icon: 'bi-building', theme: 'success',  value: 0, label: 'Espacios Registrados' },
    { id: 2, icon: 'bi-clock-history', theme: 'warning', value: 0, label: 'Solicitudes Pendientes' },
    { id: 3, icon: 'bi-check-circle', theme: 'primary',  value: 0, label: 'Solicitudes Aprobadas' },
    { id: 4, icon: 'bi-x-circle',     theme: 'danger',   value: 0, label: 'Solicitudes Rechazadas' },
  ];

  quickActions: QuickAction[] = [
    { id: 1, icon: 'bi-clipboard-check', title: 'Gestionar Solicitudes', route: '/workAreaManagement/management-requests' },
  ];
}
