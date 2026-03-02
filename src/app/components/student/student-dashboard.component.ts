import { CommonModule } from '@angular/common';
import { Component, AfterViewInit, inject, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { StudentDashboardService, StudentDashboardData } from '../../services/student/student-dashboard.service';

interface DashboardCard {
  key: keyof StudentDashboardData;
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
        @for (card of cards; track card.key) {
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
                  {{ dashboardData[card.key] }}
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
    .bg-upcoming { background-color: #8b5cf6; }
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

  dashboardData: StudentDashboardData = { pending: 0, accepted: 0, upcoming: 0, completed: 0 };

  cards: DashboardCard[] = [
    { key: 'pending',   title: 'Pendientes',   subtitle: 'Esperando aprobación',   icon: 'bi-hourglass',     colorClass: 'bg-pending' },
    { key: 'accepted',  title: 'Aceptadas',    subtitle: 'Solicitudes aprobadas',  icon: 'bi-check2',        colorClass: 'bg-accepted' },
    { key: 'upcoming',  title: 'Próximas',     subtitle: 'Sesiones programadas',   icon: 'bi-calendar-event', colorClass: 'bg-upcoming' },
    { key: 'completed', title: 'Realizadas',   subtitle: 'Sesiones completadas',   icon: 'bi-flag',          colorClass: 'bg-finished' },
  ];

  ngAfterViewInit(): void {
    Promise.resolve().then(() => {
      this.loadDashboard();
    });
  }

  loadDashboard(): void {
    this.errorMessage = null;

    this.dashboardService.getDashboard().subscribe({
      next: (data) => {
        this.dashboardData = data ?? { pending: 0, accepted: 0, upcoming: 0, completed: 0 };
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.errorMessage = err?.message || 'Error al cargar los datos';
        this.dashboardData = { pending: 0, accepted: 0, upcoming: 0, completed: 0 };
        this.cdr.detectChanges();
      }
    });
  }

  navigateTo(path: string): void {
    this.router.navigate([path]);
  }
}
