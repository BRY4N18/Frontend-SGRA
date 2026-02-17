import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CoordDashboardService } from '../../../services/coordination/coord-dashboard/coord-dashboard.service';
import { DashboardStats, QuickSummaryWidget, RecentActivity, Notification } from '../../../models/coordination/coord-dashboard';

@Component({
  selector: 'app-coord-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './coord-dashboard.component.html',
  styleUrl: './coord-dashboard.component.css',
})
export class CoordDashboardComponent implements OnInit {
  // Estadísticas del dashboard
  stats: DashboardStats | null = null;
  widgets: QuickSummaryWidget[] = [];
  recentActivities: RecentActivity[] = [];
  notifications: Notification[] = [];
  unreadCount = 0;

  constructor(private dashboardService: CoordDashboardService) {}

  ngOnInit(): void {
    this.loadDashboardData();
  }

  private loadDashboardData(): void {
    // Cargar estadísticas
    this.dashboardService.getDashboardStats().subscribe(stats => {
      this.stats = stats;
    });

    // Cargar widgets
    this.dashboardService.getQuickSummaryWidgets().subscribe(widgets => {
      this.widgets = widgets;
    });

    // Cargar actividad reciente
    this.dashboardService.getRecentActivity(5).subscribe(activities => {
      this.recentActivities = activities;
    });

    // Cargar notificaciones
    this.dashboardService.getNotifications().subscribe(notifications => {
      this.notifications = notifications;
    });

    // Contar no leídas
    this.dashboardService.getUnreadNotificationsCount().subscribe(count => {
      this.unreadCount = count;
    });
  }

  markAsRead(notificationId: number): void {
    this.dashboardService.markNotificationAsRead(notificationId).subscribe(() => {
      const notification = this.notifications.find(n => n.id === notificationId);
      if (notification) {
        notification.leida = true;
        this.unreadCount = Math.max(0, this.unreadCount - 1);
      }
    });
  }
}
