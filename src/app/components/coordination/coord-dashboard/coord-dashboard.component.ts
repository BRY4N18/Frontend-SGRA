import { Component, OnInit, AfterViewInit, ViewChild, ElementRef, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Chart, registerables } from 'chart.js';
import { CoordDashboardService } from '../../../services/coordination/coord-dashboard/coord-dashboard.service';
import { CoordinationDashboard } from '../../../models/coordination/coord-dashboard';

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

  dashboard: CoordinationDashboard | null = null;
  isLoading = true;

  private viewInitialized = false;

  constructor(
    private dashboardService: CoordDashboardService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadDashboard();
  }

  ngAfterViewInit(): void {
    this.viewInitialized = true;
    if (this.dashboard) {
      this.initCharts();
    }
  }

  private loadDashboard(): void {
    this.dashboardService.getDashboard().subscribe(data => {
      this.dashboard = data;
      this.isLoading = false;
      this.cdr.detectChanges();
      if (this.viewInitialized) {
        this.initCharts();
      }
    });
  }

  private initCharts(): void {
    if (!this.dashboard) return;
    this.initBarChart();
    this.initDonutChart();
  }

  private initBarChart(): void {
    const ctx = this.barChartRef?.nativeElement.getContext('2d');
    if (!ctx || !this.dashboard) return;

    const labels = this.dashboard.solicitudesPorMateria.map(s => s.asignatura);
    const gestionadas = this.dashboard.solicitudesPorMateria.map(s => s.gestionadas);
    const pendientes = this.dashboard.solicitudesPorMateria.map(s => s.pendientes);

    new Chart(ctx, {
      type: 'bar',
      data: {
        labels,
        datasets: [
          {
            label: 'Gestionadas',
            data: gestionadas,
            backgroundColor: '#198754',
            borderRadius: 4,
            borderSkipped: false,
          },
          {
            label: 'Pendientes',
            data: pendientes,
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
    if (!ctx || !this.dashboard) return;

    const labels = this.dashboard.modalidades.map(m => m.modalidad);
    const data = this.dashboard.modalidades.map(m => Number(m.total));
    const colors = ['#198754', '#3b82f6', '#f59e0b', '#e74c3c'];

    new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels,
        datasets: [
          {
            data,
            backgroundColor: colors.slice(0, labels.length),
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
}
