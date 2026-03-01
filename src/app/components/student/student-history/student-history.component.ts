import { Component, AfterViewInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  StudentHistoryService,
  HistoryRequestItemDTO,
  HistorySessionItemDTO
} from '../../../services/student/student-history.service';

type TabType = 'requests' | 'sessions';

@Component({
  selector: 'app-student-history',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="container-fluid">
      <!-- Header -->
      <div class="mb-4">
        <h3 class="mb-1">Historial</h3>
        <p class="text-muted mb-0">Consulta tus solicitudes pasadas y sesiones completadas</p>
      </div>

      @if (errorMessage) {
        <div class="alert alert-danger alert-dismissible fade show" role="alert">
          <i class="bi bi-exclamation-triangle-fill me-2"></i>
          {{ errorMessage }}
          <button type="button" class="btn-close" (click)="errorMessage = null"></button>
        </div>
      }

      <!-- Tabs -->
      <ul class="nav nav-tabs mb-3">
        <li class="nav-item">
          <button class="nav-link" [class.active]="activeTab === 'requests'" (click)="switchTab('requests')">
            <i class="bi bi-file-text me-2"></i>Solicitudes
          </button>
        </li>
        <li class="nav-item">
          <button class="nav-link" [class.active]="activeTab === 'sessions'" (click)="switchTab('sessions')">
            <i class="bi bi-calendar-check me-2"></i>Sesiones Completadas
          </button>
        </li>
      </ul>

      <!-- Requests Tab -->
      @if (activeTab === 'requests') {
        <!-- Filters -->
        <div class="card border-0 shadow-sm mb-3">
          <div class="card-body py-2">
            <div class="row g-2 align-items-center">
              <div class="col-auto">
                <label class="form-label mb-0 small">Estado:</label>
              </div>
              <div class="col-auto">
                <select class="form-select form-select-sm" [(ngModel)]="requestFilters.statusId" (change)="loadRequests()">
                  <option [ngValue]="null">Todos</option>
                  <option [ngValue]="1">Pendiente</option>
                  <option [ngValue]="2">Aceptada</option>
                  <option [ngValue]="3">Rechazada</option>
                  <option [ngValue]="4">Cancelada</option>
                  <option [ngValue]="5">Finalizada</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        <!-- Requests Table -->
        <div class="card border-0 shadow-sm">
          <div class="card-body">
            <div class="table-responsive">
              <table class="table align-middle mb-0">
                <thead class="table-light">
                  <tr>
                    <th>FECHA</th>
                    <th>ASIGNATURA</th>
                    <th>MOTIVO</th>
                    <th>DOCENTE</th>
                    <th>TIPO</th>
                    <th>ESTADO</th>
                  </tr>
                </thead>
                <tbody>
                  @if (loadingRequests) {
                    <tr>
                      <td colspan="6" class="text-center py-4">
                        <div class="spinner-border spinner-border-sm text-success me-2"></div>
                        Cargando...
                      </td>
                    </tr>
                  } @else if (requests.length === 0) {
                    <tr>
                      <td colspan="6" class="text-center py-5 text-muted">
                        No hay solicitudes en el historial.
                      </td>
                    </tr>
                  } @else {
                    @for (r of requests; track r.requestId) {
                      <tr>
                        <td>
                          <div class="fw-semibold">{{ formatDate(r.createdAt) }}</div>
                          <small class="text-muted">{{ formatTime(r.createdAt) }}</small>
                        </td>
                        <td>{{ r.subjectName }}</td>
                        <td>
                          <div>{{ r.reason }}</div>
                          <small class="text-muted">Semestre {{ r.unit }}</small>
                        </td>
                        <td>{{ r.teacherName }}</td>
                        <td><span class="badge bg-light text-dark border">{{ r.sessionType }}</span></td>
                        <td>
                          <span class="badge rounded-pill" [ngClass]="getStatusClass(r.statusId)">
                            {{ r.statusName }}
                          </span>
                        </td>
                      </tr>
                    }
                  }
                </tbody>
              </table>
            </div>

            <!-- Pagination -->
            <div class="d-flex justify-content-between align-items-center mt-3">
              <small class="text-muted">
                Página {{ requestPage }} de {{ requestTotalPages }} · Total: {{ requestTotalCount }}
              </small>
              <div class="btn-group btn-group-sm">
                <button class="btn btn-outline-secondary" [disabled]="requestPage <= 1" (click)="goToRequestPage(requestPage - 1)">
                  Anterior
                </button>
                <button class="btn btn-outline-secondary" [disabled]="requestPage >= requestTotalPages" (click)="goToRequestPage(requestPage + 1)">
                  Siguiente
                </button>
              </div>
            </div>
          </div>
        </div>
      }

      <!-- Sessions Tab -->
      @if (activeTab === 'sessions') {
        <!-- Filters -->
        <div class="card border-0 shadow-sm mb-3">
          <div class="card-body py-2">
            <div class="form-check">
              <input class="form-check-input" type="checkbox" id="onlyAttended"
                     [(ngModel)]="sessionFilters.onlyAttended" (change)="loadSessions()">
              <label class="form-check-label" for="onlyAttended">
                Solo sesiones a las que asistí
              </label>
            </div>
          </div>
        </div>

        <!-- Sessions Table -->
        <div class="card border-0 shadow-sm">
          <div class="card-body">
            <div class="table-responsive">
              <table class="table align-middle mb-0">
                <thead class="table-light">
                  <tr>
                    <th>FECHA</th>
                    <th>ASIGNATURA</th>
                    <th>MOTIVO</th>
                    <th>DOCENTE</th>
                    <th>DURACIÓN</th>
                    <th>ASISTENCIA</th>
                    <th>NOTAS</th>
                  </tr>
                </thead>
                <tbody>
                  @if (loadingSessions) {
                    <tr>
                      <td colspan="7" class="text-center py-4">
                        <div class="spinner-border spinner-border-sm text-success me-2"></div>
                        Cargando...
                      </td>
                    </tr>
                  } @else if (sessions.length === 0) {
                    <tr>
                      <td colspan="7" class="text-center py-5 text-muted">
                        No hay sesiones completadas.
                      </td>
                    </tr>
                  } @else {
                    @for (s of sessions; track s.completedSessionId) {
                      <tr>
                        <td>
                          <div class="fw-semibold">{{ formatDate(s.requestDateTime) }}</div>
                          <small class="text-muted">{{ formatTime(s.requestDateTime) }}</small>
                        </td>
                        <td>{{ s.subjectName }}</td>
                        <td>
                          <div>{{ s.syllabusName }}</div>
                          <small class="text-muted">Semestre {{ s.unit }}</small>
                        </td>
                        <td>{{ s.teacherName }}</td>
                        <td>{{ s.duration || '-' }}</td>
                        <td>
                          @if (s.attended) {
                            <span class="badge bg-success">Asistió</span>
                          } @else {
                            <span class="badge bg-secondary">No asistió</span>
                          }
                        </td>
                        <td>
                          <small class="text-muted">{{ s.notes || '-' }}</small>
                        </td>
                      </tr>
                    }
                  }
                </tbody>
              </table>
            </div>

            <!-- Pagination -->
            <div class="d-flex justify-content-between align-items-center mt-3">
              <small class="text-muted">
                Página {{ sessionPage }} de {{ sessionTotalPages }} · Total: {{ sessionTotalCount }}
              </small>
              <div class="btn-group btn-group-sm">
                <button class="btn btn-outline-secondary" [disabled]="sessionPage <= 1" (click)="goToSessionPage(sessionPage - 1)">
                  Anterior
                </button>
                <button class="btn btn-outline-secondary" [disabled]="sessionPage >= sessionTotalPages" (click)="goToSessionPage(sessionPage + 1)">
                  Siguiente
                </button>
              </div>
            </div>
          </div>
        </div>
      }
    </div>
  `,
  styles: [`
    .nav-link { cursor: pointer; }
    th { white-space: nowrap; font-size: .85rem; }
  `]
})
export class StudentHistoryComponent implements AfterViewInit {
  private svc = inject(StudentHistoryService);
  private cdr = inject(ChangeDetectorRef);

  activeTab: TabType = 'requests';
  errorMessage: string | null = null;

  // Requests
  requests: HistoryRequestItemDTO[] = [];
  loadingRequests = false;
  requestPage = 1;
  requestSize = 10;
  requestTotalCount = 0;
  requestTotalPages = 1;
  requestFilters: { periodId?: number; statusId?: number | null } = { statusId: null };

  // Sessions
  sessions: HistorySessionItemDTO[] = [];
  loadingSessions = false;
  sessionPage = 1;
  sessionSize = 10;
  sessionTotalCount = 0;
  sessionTotalPages = 1;
  sessionFilters: { onlyAttended: boolean } = { onlyAttended: false };

  ngAfterViewInit(): void {
    Promise.resolve().then(() => {
      this.loadRequests();
    });
  }

  switchTab(tab: TabType): void {
    this.activeTab = tab;
    if (tab === 'requests' && this.requests.length === 0) {
      this.loadRequests();
    } else if (tab === 'sessions' && this.sessions.length === 0) {
      this.loadSessions();
    }
  }

  loadRequests(): void {
    this.loadingRequests = true;
    this.errorMessage = null;

    this.svc.getHistoryRequests({
      statusId: this.requestFilters.statusId ?? undefined,
      page: this.requestPage,
      size: this.requestSize
    }).subscribe({
      next: (res) => {
        this.requests = res.items || [];
        this.requestTotalCount = res.totalCount || 0;
        this.requestTotalPages = Math.max(1, Math.ceil(this.requestTotalCount / this.requestSize));
        this.loadingRequests = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.errorMessage = err?.message || 'Error al cargar historial';
        this.loadingRequests = false;
        this.cdr.detectChanges();
      }
    });
  }

  loadSessions(): void {
    this.loadingSessions = true;
    this.errorMessage = null;

    this.svc.getHistorySessions({
      onlyAttended: this.sessionFilters.onlyAttended,
      page: this.sessionPage,
      size: this.sessionSize
    }).subscribe({
      next: (res) => {
        this.sessions = res.items || [];
        this.sessionTotalCount = res.totalCount || 0;
        this.sessionTotalPages = Math.max(1, Math.ceil(this.sessionTotalCount / this.sessionSize));
        this.loadingSessions = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.errorMessage = err?.message || 'Error al cargar sesiones';
        this.loadingSessions = false;
        this.cdr.detectChanges();
      }
    });
  }

  goToRequestPage(page: number): void {
    this.requestPage = page;
    this.loadRequests();
  }

  goToSessionPage(page: number): void {
    this.sessionPage = page;
    this.loadSessions();
  }

  formatDate(dt: string): string {
    const d = new Date(dt);
    return isNaN(d.getTime()) ? dt : d.toLocaleDateString();
  }

  formatTime(dt: string): string {
    const d = new Date(dt);
    return isNaN(d.getTime()) ? '' : d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }

  getStatusClass(statusId: number): string {
    switch (statusId) {
      case 1: return 'bg-warning text-dark';  // Pendiente
      case 2: return 'bg-success';            // Aceptada
      case 3: return 'bg-danger';             // Rechazada
      case 4: return 'bg-secondary';          // Cancelada
      case 5: return 'bg-dark';               // Finalizada
      default: return 'bg-light text-dark';
    }
  }
}
