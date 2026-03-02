import { Component, OnInit, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Chart, registerables } from 'chart.js';
import { CoordDashboardService } from '../../../services/coordination/coord-dashboard/coord-dashboard.service';
import {
  DashboardStats,
  QuickSummaryWidget,
  RecentActivity,
  Notification,
} from '../../../models/coordination/coord-dashboard';

Chart.register(...registerables);

@Component({
  selector: 'app-coord-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './coord-dashboard.component.html',
  styleUrl: './coord-dashboard.component.css',
})
export class CoordDashboardComponent implements OnInit, AfterViewInit {
  @ViewChild('barChartCanvas') barChartRef!: ElementRef<HTMLCanvasElement>;
  @ViewChild('donutChartCanvas') donutChartRef!: ElementRef<HTMLCanvasElement>;

  stats: DashboardStats | null = null;
  widgets: QuickSummaryWidget[] = [];
  recentActivities: RecentActivity[] = [];
  notifications: Notification[] = [];
  unreadCount = 0;

  constructor(private dashboardService: CoordDashboardService) {}

  ngOnInit(): void {
    this.loadDashboardData();
  }

  ngAfterViewInit(): void {
    this.initBarChart();
    this.initDonutChart();
  }

  private loadDashboardData(): void {
    this.dashboardService.getDashboardStats().subscribe(stats => (this.stats = stats));
    this.dashboardService.getQuickSummaryWidgets().subscribe(w => (this.widgets = w));
    this.dashboardService.getRecentActivity(5).subscribe(a => (this.recentActivities = a));
    this.dashboardService.getNotifications().subscribe(n => (this.notifications = n));
    this.dashboardService.getUnreadNotificationsCount().subscribe(c => (this.unreadCount = c));
  }

  private initBarChart(): void {
    const ctx = this.barChartRef?.nativeElement.getContext('2d');
    if (!ctx) return;

    new Chart(ctx, {
      type: 'bar',
      data: {
        labels: ['Matemáticas', 'Física', 'Química', 'Programación', 'Inglés', 'Estadística'],
        datasets: [
          {
            label: 'Gestionadas',
            data: [42, 35, 28, 55, 20, 18],
            backgroundColor: '#198754',
            borderRadius: 4,
            borderSkipped: false,
          },
          {
            label: 'Pendientes',
            data: [8, 5, 12, 10, 3, 7],
            backgroundColor: '#f59e0b',
            borderRadius: 4,
            borderSkipped: false,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'top',
            labels: { font: { size: 12 }, usePointStyle: true, pointStyleWidth: 10 },
          },
          tooltip: { mode: 'index' },
        },
        scales: {
          x: { stacked: true, grid: { display: false } },
          y: { stacked: true, grid: { color: '#f0f0f0' }, ticks: { stepSize: 10 } },
        },
      },
    });
  }

  private initDonutChart(): void {
    const ctx = this.donutChartRef?.nativeElement.getContext('2d');
    if (!ctx) return;

    new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: ['Presencial', 'Virtual'],
        datasets: [
          {
            data: [65, 35],
            backgroundColor: ['#198754', '#3b82f6'],
            borderWidth: 0,
            hoverOffset: 8,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        cutout: '70%',
        plugins: {
          legend: {
            position: 'bottom',
            labels: {
              font: { size: 12 },
              usePointStyle: true,
              pointStyleWidth: 10,
              padding: 16,
            },
          },
        },
      },
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
