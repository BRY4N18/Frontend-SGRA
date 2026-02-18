import { CommonModule } from '@angular/common';
import { Component, AfterViewInit, inject, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { StudentDashboardService } from '../../services/student/student-dashboard.service';
import { SummaryRowDTO } from '../../models/student/request-summary.model';

interface DashboardCard {
  statusId: number;
  title: string;
  subtitle: string;
  icon: string;
  colorClass: string;
}

@Component({
  selector: 'app-student-dashboard',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="container-fluid">
      <!-- Header -->
      <div class="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h3 class="mb-1">Dashboard</h3>
          <p class="text-muted mb-0">Resumen de tus solicitudes de refuerzo académico</p>
        </div>
      </div>

      <!-- Error Alert -->
      @if (errorMessage) {
        <div class="alert alert-danger alert-dismissible fade show" role="alert">
          <i class="bi bi-exclamation-triangle-fill me-2"></i>
          {{ errorMessage }}
          <button type="button" class="btn-close" (click)="errorMessage = null"></button>
        </div>
      }

      <!-- Stats Cards -->
      <div class="row g-3 mb-3">
        @for (card of cards; track card.statusId) {
          <div class="col-12 col-sm-6 col-lg-3">
            <div class="card h-100 border-0 shadow-sm">
              <div class="card-body">
                <div class="d-flex align-items-center mb-3">
                  <div class="icon-wrapper rounded-3 p-2 me-3" [class]="card.colorClass">
                    <i class="bi {{ card.icon }} fs-4 text-white"></i>
                  </div>
                  <div class="flex-grow-1">
                    <h6 class="card-title mb-0 text-muted">{{ card.title }}</h6>
                  </div>
                </div>

                <div class="display-5 fw-bold text-dark">
                  {{ countsByStatusId[card.statusId] ?? 0 }}
                </div>

                <small class="text-muted">{{ card.subtitle }}</small>
              </div>
            </div>
          </div>
        }
      </div>

      <!-- Quick Actions -->
      <div class="mt-3">
        <h5 class="fw-semibold mb-3">Accesos rápidos</h5>
        <div class="row g-3">
          <div class="col-12 col-lg-4">
            <div class="card h-100 border-0 shadow-sm quick-card"
                 (click)="navigateTo('/student/new-request')" role="button">
              <div class="card-body">
                <h5 class="mb-2">Nueva Solicitud</h5>
                <p class="text-muted mb-3">Solicita un refuerzo y selecciona tu horario ideal</p>
                <span class="quick-link">
                  Crear solicitud <i class="bi bi-arrow-right-short"></i>
                </span>
              </div>
            </div>
          </div>

          <div class="col-12 col-lg-4">
            <div class="card h-100 border-0 shadow-sm quick-card"
                 (click)="navigateTo('/student/my-requests')" role="button">
              <div class="card-body">
                <h5 class="mb-2">Mis Solicitudes</h5>
                <p class="text-muted mb-3">Revisa el estado, confirma horarios y realiza seguimiento.</p>
                <span class="quick-link">
                  Ver solicitudes <i class="bi bi-arrow-right-short"></i>
                </span>
              </div>
            </div>
          </div>

          <div class="col-12 col-lg-4">
            <div class="card h-100 border-0 shadow-sm quick-card"
                 (click)="navigateTo('/student/history')" role="button">
              <div class="card-body">
                <h5 class="mb-2">Historial</h5>
                <p class="text-muted mb-3">Consulta sesiones anteriores y retroalimentación.</p>
                <span class="quick-link">
                  Ir al historial <i class="bi bi-arrow-right-short"></i>
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .icon-wrapper {
      width: 48px;
      height: 48px;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .bg-pending { background-color: #f59e0b; }
    .bg-accepted { background-color: #3b82f6; }
    .bg-rejected { background-color: #dc3545; }
    .bg-cancelled { background-color: #6c757d; }
    .bg-finished { background-color: #198754; }

    .quick-card {
      border-radius: 14px;
      cursor: pointer;
      transition: transform .15s ease, box-shadow .15s ease;
    }
    .quick-card:hover {
      transform: translateY(-2px);
    }
    .quick-link {
      color: #198754;
      font-weight: 600;
      user-select: none;
    }
  `]
})
export class StudentDashboardComponent implements AfterViewInit {
  private dashboardService = inject(StudentDashboardService);
  private router = inject(Router);
  private cdr = inject(ChangeDetectorRef);

  errorMessage: string | null = null;

  countsByStatusId: Record<number, number | undefined> = {};
  summaryRows: Array<{ statusId: number; total: number; statusName: string }> = [];

  cards: DashboardCard[] = [
    { statusId: 1, title: 'Pendientes',  subtitle: 'Esperando aprobación', icon: 'bi-hourglass',     colorClass: 'bg-pending' },
    { statusId: 2, title: 'Aceptadas',   subtitle: 'Solicitudes aprobadas', icon: 'bi-check2',       colorClass: 'bg-accepted' },
    { statusId: 3, title: 'Rechazadas',  subtitle: 'No aprobadas',          icon: 'bi-x-lg',         colorClass: 'bg-rejected' },
    { statusId: 4, title: 'Canceladas',  subtitle: 'Solicitudes anuladas',  icon: 'bi-slash-circle', colorClass: 'bg-cancelled' },
    { statusId: 5, title: 'Finalizadas', subtitle: 'Sesión finalizada',     icon: 'bi-flag',         colorClass: 'bg-finished' },
  ];

  ngAfterViewInit(): void {
    // Use microtask to ensure view is fully rendered before loading data
    Promise.resolve().then(() => {
      this.loadSummary();
    });
  }

  private safeStatusName(statusJson: string): string {
    try {
      const obj = JSON.parse(statusJson || '{}');
      return obj?.nombreestado ?? obj?.nombreEstado ?? '';
    } catch {
      return '';
    }
  }

  loadSummary(): void {
    this.errorMessage = null;

    this.dashboardService.getMyRequestsSummary().subscribe({
      next: (rows) => {
        const map: Record<number, number> = {};

        this.summaryRows = (rows ?? []).map((r: SummaryRowDTO) => {
          const statusId = Number(r.statusId);
          const total = Number(r.total ?? 0);
          map[statusId] = total;

          return {
            statusId,
            total,
            statusName: this.safeStatusName(r.statusJson)
          };
        });

        this.countsByStatusId = map;
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.errorMessage = err?.message || 'Error al cargar los datos';
        this.countsByStatusId = {};
        this.summaryRows = [];
        this.cdr.detectChanges();
      }
    });
  }

  navigateTo(path: string): void {
    this.router.navigate([path]);
  }
}
