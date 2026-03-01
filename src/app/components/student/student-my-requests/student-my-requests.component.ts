import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, AfterViewInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import {
  StudentMyRequestsService,
  StudentMyRequestsPageDTO,
  MyRequestRowDTO
} from '../../../services/student/student-my-requests.service';
import { StudentNewRequestService } from '../../../services/student/student-new-request.service';
import { StudentInvitationsService } from '../../../services/student/student-invitations.service';
import { InvitationItem } from '../../../models/student/invitation.model';

type Option = { value: number | null; label: string };
type TabType = 'requests' | 'invitations';

@Component({
  selector: 'app-student-my-requests',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  template: `
    <div class="container-fluid">

      <div class="d-flex justify-content-between align-items-start flex-wrap gap-2 mb-3">
        <div>
          <h3 class="mb-1">Mis Solicitudes</h3>
          <p class="text-muted mb-0">Gestiona y realiza seguimiento a tus solicitudes de refuerzo académico.</p>
        </div>

        <a class="btn btn-success" routerLink="/student/new-request">
          <i class="bi bi-plus-lg me-2"></i> Nueva Solicitud
        </a>
      </div>

      <!-- Tabs -->
      <ul class="nav nav-tabs mb-3">
        <li class="nav-item">
          <button class="nav-link" [class.active]="activeTab === 'requests'" [class.text-success]="activeTab !== 'requests'" (click)="switchTab('requests')">
            <i class="bi bi-card-list me-2"></i>Mis Solicitudes
          </button>
        </li>
        <li class="nav-item">
          <button class="nav-link" [class.active]="activeTab === 'invitations'" [class.text-success]="activeTab !== 'invitations'" (click)="switchTab('invitations')">
            <i class="bi bi-people me-2"></i>Invitaciones Grupales
            @if (invitations.length > 0) {
              <span class="badge bg-danger ms-1">{{ invitations.length }}</span>
            }
          </button>
        </li>
      </ul>

      @if (errorMessage) {
        <div class="alert alert-danger alert-dismissible fade show" role="alert">
          <i class="bi bi-exclamation-triangle-fill me-2"></i>
          {{ errorMessage }}
          <button type="button" class="btn-close" (click)="errorMessage = null"></button>
        </div>
      }

      @if (successMessage) {
        <div class="alert alert-success alert-dismissible fade show" role="alert">
          <i class="bi bi-check-circle-fill me-2"></i>
          {{ successMessage }}
          <button type="button" class="btn-close" (click)="successMessage = null"></button>
        </div>
      }

      <!-- Tab: Mis Solicitudes -->
      @if (activeTab === 'requests') {

      <!-- Modal Ver Detalle -->
      @if (showDetailModal && selectedRequest) {
        <div class="modal fade show d-block" tabindex="-1" style="background: rgba(0,0,0,0.5);">
          <div class="modal-dialog modal-dialog-centered">
            <div class="modal-content">
              <div class="modal-header">
                <h5 class="modal-title">Detalle de Solicitud #{{ selectedRequest.requestId }}</h5>
                <button type="button" class="btn-close" (click)="closeDetailModal()"></button>
              </div>
              <div class="modal-body">
                <div class="row g-3">
                  <div class="col-6">
                    <label class="form-label text-muted small mb-0">Fecha</label>
                    <div class="fw-semibold">{{ formatDate(selectedRequest.requestDateTime) }}</div>
                  </div>
                  <div class="col-6">
                    <label class="form-label text-muted small mb-0">Hora</label>
                    <div class="fw-semibold">{{ formatTime(selectedRequest.requestDateTime) }}</div>
                  </div>
                  <div class="col-12">
                    <label class="form-label text-muted small mb-0">Asignatura</label>
                    <div class="fw-semibold">{{ selectedRequest.subjectName }}</div>
                    <small class="text-muted">{{ selectedRequest.subjectCode }}</small>
                  </div>
                  <div class="col-12">
                    <label class="form-label text-muted small mb-0">Motivo</label>
                    <div class="fw-semibold">{{ selectedRequest.topic }}</div>
                  </div>
                  <div class="col-6">
                    <label class="form-label text-muted small mb-0">Docente</label>
                    <div class="fw-semibold">{{ selectedRequest.teacherName }}</div>
                  </div>
                  <div class="col-6">
                    <label class="form-label text-muted small mb-0">Tipo</label>
                    <div class="fw-semibold">{{ selectedRequest.sessionType }}</div>
                  </div>
                  <div class="col-12">
                    <label class="form-label text-muted small mb-0">Estado</label>
                    <div>
                      <span class="badge rounded-pill"
                            [class.bg-warning]="isPending(selectedRequest.status)"
                            [class.text-dark]="isPending(selectedRequest.status)"
                            [class.bg-success]="isAccepted(selectedRequest.status)"
                            [class.bg-danger]="isRejected(selectedRequest.status)"
                            [class.bg-secondary]="isCancelled(selectedRequest.status)"
                            [class.bg-dark]="isFinished(selectedRequest.status)">
                        {{ selectedRequest.status }}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              <div class="modal-footer">
                <button type="button" class="btn btn-secondary" (click)="closeDetailModal()">Cerrar</button>
              </div>
            </div>
          </div>
        </div>
      }

      <!-- Modal Confirmar Cancelación -->
      @if (showCancelModal && selectedRequest) {
        <div class="modal fade show d-block" tabindex="-1" style="background: rgba(0,0,0,0.5);">
          <div class="modal-dialog modal-dialog-centered">
            <div class="modal-content">
              <div class="modal-header">
                <h5 class="modal-title">Confirmar Cancelación</h5>
                <button type="button" class="btn-close" (click)="closeCancelModal()" [disabled]="cancelling"></button>
              </div>
              <div class="modal-body">
                <p>¿Estás seguro de que deseas cancelar la solicitud <strong>#{{ selectedRequest.requestId }}</strong>?</p>
                <p class="text-muted small mb-0">Esta acción no se puede deshacer.</p>
              </div>
              <div class="modal-footer">
                <button type="button" class="btn btn-secondary" (click)="closeCancelModal()" [disabled]="cancelling">
                  No, volver
                </button>
                <button type="button" class="btn btn-danger" (click)="doCancelRequest()" [disabled]="cancelling">
                  @if (cancelling) {
                    <span class="spinner-border spinner-border-sm me-2"></span>
                    Cancelando...
                  } @else {
                    Sí, cancelar
                  }
                </button>
              </div>
            </div>
          </div>
        </div>
      }

      <!-- Filtros -->
      <div class="card border-0 shadow-sm mb-3">
        <div class="card-body">
          <div class="row g-2 align-items-end">

            <div class="col-12 col-lg-4">
              <label class="form-label mb-1">Buscar</label>
              <input class="form-control"
                     [(ngModel)]="filters.search"
                     placeholder="Buscar por motivo o asignatura"
                     (keyup.enter)="applyFilters()"/>
            </div>

            <div class="col-6 col-lg-2">
              <label class="form-label mb-1">Estado</label>
              <select class="form-select" [(ngModel)]="filters.statusId" (change)="applyFilters()">
                @for (o of statusOptions; track o.label) {
                  <option [ngValue]="o.value">{{ o.label }}</option>
                }
              </select>
            </div>

            <div class="col-6 col-lg-2">
              <label class="form-label mb-1">Tipo</label>
              <select class="form-select" [(ngModel)]="filters.sessionTypeId" (change)="applyFilters()">
                @for (o of sessionTypeOptions; track o.label) {
                  <option [ngValue]="o.value">{{ o.label }}</option>
                }
              </select>
            </div>

            <div class="col-6 col-lg-2">
              <label class="form-label mb-1">Asignatura</label>
              <select class="form-select" [(ngModel)]="filters.subjectId" (change)="applyFilters()">
                @for (o of subjectOptions; track o.label) {
                  <option [ngValue]="o.value">{{ o.label }}</option>
                }
              </select>
            </div>

            <div class="col-6 col-lg-2 d-flex gap-2">
              <button class="btn btn-outline-secondary w-100" (click)="clearFilters()">
                Limpiar
              </button>
            </div>

          </div>
        </div>
      </div>

      <!-- Chips resumen (se alimenta de /summary) -->
      <div class="row g-2 mb-3">
        @for (chip of summaryChips; track chip.label) {
          <div class="col-6 col-lg-3">
            <div class="chip-box p-3 bg-white shadow-sm border rounded-3 d-flex justify-content-between">
              <div>
                <div class="text-muted small">{{ chip.label }}</div>
                <div class="fw-bold fs-4">{{ chip.value }}</div>
              </div>
              <i class="bi bi-dot fs-1 text-success opacity-50"></i>
            </div>
          </div>
        }
      </div>

      <!-- Tabla -->
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
                <th class="text-end">ACCIONES</th>
              </tr>
              </thead>

              <tbody>
                @if (rows.length === 0) {
                  <tr>
                    <td colspan="7" class="text-center py-5 text-muted">
                      Sin solicitudes para mostrar.
                    </td>
                  </tr>
                } @else {
                  @for (r of rows; track r.requestId) {
                    <tr>
                      <td class="fw-semibold">
                        {{ formatDate(r.requestDateTime) }}
                        <div class="text-muted small">{{ formatTime(r.requestDateTime) }}</div>
                      </td>

                      <td>
                        <div class="fw-semibold">{{ r.subjectName }}</div>
                        <div class="text-muted small">{{ r.subjectCode }}</div>
                      </td>

                      <td>{{ r.topic }}</td>
                      <td>{{ r.teacherName }}</td>

                      <td>
                      <span class="badge rounded-pill bg-light text-dark border">
                        {{ r.sessionType }}
                      </span>
                      </td>

                      <td>
                      <span class="badge rounded-pill"
                            [class.bg-warning]="isPending(r.status)"
                            [class.text-dark]="isPending(r.status)"
                            [class.bg-success]="isAccepted(r.status)"
                            [class.bg-danger]="isRejected(r.status)"
                            [class.bg-secondary]="isCancelled(r.status)"
                            [class.bg-dark]="isFinished(r.status)">
                        {{ r.status }}
                      </span>
                      </td>

                      <td class="text-end">
                        <div class="dropdown">
                          <button class="btn btn-sm btn-outline-secondary" type="button"
                                  data-bs-toggle="dropdown" aria-expanded="false">
                            <i class="bi bi-three-dots"></i>
                          </button>
                          <ul class="dropdown-menu dropdown-menu-end">
                            <li>
                              <button class="dropdown-item" type="button" (click)="viewDetail(r)">
                                <i class="bi bi-eye me-2"></i>Ver detalle
                              </button>
                            </li>
                            @if (canCancel(r.status)) {
                              <li><hr class="dropdown-divider"></li>
                              <li>
                                <button class="dropdown-item text-danger" type="button" (click)="confirmCancel(r)">
                                  <i class="bi bi-x-circle me-2"></i>Cancelar solicitud
                                </button>
                              </li>
                            }
                          </ul>
                        </div>
                      </td>
                    </tr>
                  }
                }
              </tbody>
            </table>
          </div>

          <!-- Footer paginación -->
          <div class="d-flex justify-content-between align-items-center mt-3 flex-wrap gap-2">
            <div class="text-muted small">
              Página {{ page }} de {{ totalPages }} · Total: {{ totalCount }}
            </div>

            <div class="d-flex gap-2">
              <button class="btn btn-outline-secondary btn-sm"
                      [disabled]="page <= 1 || loading"
                      (click)="goTo(page - 1)">
                Anterior
              </button>
              <button class="btn btn-outline-secondary btn-sm"
                      [disabled]="page >= totalPages || loading"
                      (click)="goTo(page + 1)">
                Siguiente
              </button>
            </div>
          </div>

        </div>
      </div>

      } <!-- fin tab requests -->

      <!-- Tab: Invitaciones Grupales -->
      @if (activeTab === 'invitations') {
        <div class="card border-0 shadow-sm">
          <div class="card-header bg-white border-0 py-3 d-flex justify-content-between align-items-center">
            <h5 class="mb-0">
              <i class="bi bi-people me-2 text-success"></i>
              Invitaciones a Tutorías Grupales
            </h5>
            <button class="btn btn-outline-secondary btn-sm" (click)="loadInvitations()" [disabled]="loadingInvitations">
              <i class="bi bi-arrow-clockwise me-1"></i> Actualizar
            </button>
          </div>
          <div class="card-body">

            @if (loadingInvitations) {
              <div class="text-center py-5">
                <div class="spinner-border text-success mb-3" role="status"></div>
                <p class="text-muted mb-0">Cargando invitaciones...</p>
              </div>
            } @else if (invitations.length === 0) {
              <div class="text-center py-5 text-muted">
                <i class="bi bi-inbox display-4 mb-3 d-block opacity-50"></i>
                <p class="mb-0">No tienes invitaciones pendientes.</p>
                <small>Cuando un compañero te invite a una tutoría grupal, aparecerá aquí.</small>
              </div>
            } @else {
              @for (inv of invitations; track inv.participantId) {
                <div class="card mb-3 border">
                  <div class="card-body">
                    <div class="row g-3">
                      <div class="col-12 col-md-8">
                        <h6 class="fw-bold mb-1">{{ inv.subjectName }}</h6>
                        <small class="text-muted">Semestre {{ inv.semester }}</small>

                        <div class="mt-2">
                          <div class="mb-1">
                            <i class="bi bi-person-fill me-1 text-muted"></i>
                            <strong>Solicitante:</strong> {{ inv.requesterName }}
                            <small class="text-muted">({{ inv.requesterEmail }})</small>
                          </div>
                          <div class="mb-1">
                            <i class="bi bi-mortarboard me-1 text-muted"></i>
                            <strong>Docente:</strong> {{ inv.teacherName }}
                          </div>
                          <div class="mb-1">
                            <i class="bi bi-chat-text me-1 text-muted"></i>
                            <strong>Motivo:</strong> {{ inv.reason }}
                          </div>
                          <div class="mb-1">
                            <i class="bi bi-calendar me-1 text-muted"></i>
                            <strong>Fecha:</strong> {{ formatDate(inv.requestDate) }}
                          </div>
                        </div>

                        <div class="mt-2">
                          <span class="badge bg-light text-dark border me-2">
                            <i class="bi bi-people me-1"></i> {{ inv.totalAccepted }}/{{ inv.totalInvited }} aceptaron
                          </span>
                          <span class="badge bg-success text-white">
                            {{ inv.sessionType }}
                          </span>
                        </div>
                      </div>

                      <div class="col-12 col-md-4 d-flex flex-column justify-content-center gap-2">
                        <button class="btn btn-success"
                                (click)="respondInvitation(inv.participantId, true)"
                                [disabled]="respondingInvId === inv.participantId">
                          @if (respondingInvId === inv.participantId && respondingAccept) {
                            <span class="spinner-border spinner-border-sm me-1"></span>
                          } @else {
                            <i class="bi bi-check-lg me-1"></i>
                          }
                          Aceptar
                        </button>
                        <button class="btn btn-outline-danger"
                                (click)="respondInvitation(inv.participantId, false)"
                                [disabled]="respondingInvId === inv.participantId">
                          @if (respondingInvId === inv.participantId && !respondingAccept) {
                            <span class="spinner-border spinner-border-sm me-1"></span>
                          } @else {
                            <i class="bi bi-x-lg me-1"></i>
                          }
                          Rechazar
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              }
            }

          </div>
        </div>
      } <!-- fin tab invitations -->

    </div>
  `,
  styles: [`
    .chip-box { min-height: 72px; }
    th { white-space: nowrap; font-size: .85rem; letter-spacing: .02em; }
    td { vertical-align: middle; }
    .nav-link { cursor: pointer; }
  `]
})
export class StudentMyRequestsComponent implements AfterViewInit {
  private svc = inject(StudentMyRequestsService);
  private catalogSvc = inject(StudentNewRequestService);
  private invitationsSvc = inject(StudentInvitationsService);
  private cdr = inject(ChangeDetectorRef);

  activeTab: TabType = 'requests';
  loading = false;
  errorMessage: string | null = null;

  rows: MyRequestRowDTO[] = [];
  totalCount = 0;

  page = 1;
  size = 10;
  totalPages = 1;

  // filtros reales del controller
  filters: {
    periodId?: number | null;
    statusId?: number | null;
    sessionTypeId?: number | null;
    subjectId?: number | null;
    search?: string;
  } = {
    periodId: null,
    statusId: null,
    sessionTypeId: null,
    subjectId: null,
    search: ''
  };

  // ✅ Estados reales de tu BD:
  // 1 Pendiente, 2 Aceptada, 3 Rechazada, 4 Cancelada, 5 Finalizada
  statusOptions: Option[] = [
    { value: null, label: 'Todos' },
    { value: 1, label: 'Pendiente' },
    { value: 2, label: 'Aceptada' },
    { value: 3, label: 'Rechazada' },
    { value: 4, label: 'Cancelada' },
    { value: 5, label: 'Finalizada' },
  ];

  sessionTypeOptions: Option[] = [
    { value: null, label: 'Todos' },
    { value: 1, label: 'Individual' },
    { value: 2, label: 'Grupal' },
  ];

  subjectOptions: Option[] = [
    { value: null, label: 'Todas' },
  ];

  // ✅ Chips alineados a tu BD (sin "Programadas/Completadas")
  summaryChips: { label: string; value: number }[] = [
    { label: 'Pendientes', value: 0 },
    { label: 'Aceptadas', value: 0 },
    { label: 'Canceladas', value: 0 },
    { label: 'Finalizadas', value: 0 },
  ];

  ngAfterViewInit(): void {
    // Use microtask to ensure view is fully rendered before loading data
    Promise.resolve().then(() => {
      this.loadSubjects();
      this.load();
      this.loadSummary();
      this.loadInvitations();
    });
  }

  switchTab(tab: TabType): void {
    this.activeTab = tab;
    if (tab === 'invitations' && this.invitations.length === 0 && !this.loadingInvitations) {
      this.loadInvitations();
    }
  }

  applyFilters(): void {
    this.page = 1;
    this.load();
    this.loadSummary();
  }

  clearFilters(): void {
    this.filters = { periodId: null, statusId: null, sessionTypeId: null, subjectId: null, search: '' };
    this.applyFilters();
  }

  goTo(p: number): void {
    this.page = p;
    this.load();
  }

  loadSubjects(): void {
    this.catalogSvc.getSubjects().subscribe({
      next: (subjects) => {
        this.subjectOptions = [
          { value: null, label: 'Todas' },
          ...subjects.map(s => ({ value: s.subjectId, label: s.subjectName }))
        ];
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error loading subjects:', err);
      }
    });
  }

  load(): void {
    this.loading = true;
    this.errorMessage = null;

    this.svc.getMyRequests({
      periodId: this.filters.periodId ?? undefined,
      statusId: this.filters.statusId ?? undefined,
      sessionTypeId: this.filters.sessionTypeId ?? undefined,
      subjectId: this.filters.subjectId ?? undefined,
      search: (this.filters.search ?? '').trim() || undefined,
      page: this.page,
      size: this.size,
    }).subscribe({
      next: (res: StudentMyRequestsPageDTO) => {
        this.rows = res.items ?? [];
        this.totalCount = res.totalCount ?? 0;
        this.page = res.page ?? this.page;
        this.size = res.size ?? this.size;
        this.totalPages = Math.max(1, Math.ceil(this.totalCount / this.size));
        this.loading = false;

        // ✅ evita que “se pinte” solo al tocar hamburguesa
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.errorMessage = err?.message || 'Error al cargar solicitudes';
        this.rows = [];
        this.totalCount = 0;
        this.totalPages = 1;
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

  loadSummary(): void {
    this.svc.getMyRequestsSummary(this.filters.periodId ?? undefined).subscribe({
      next: (data) => {
        const map = new Map<number, number>();
        for (const s of data ?? []) map.set(Number(s.statusId), Number(s.total ?? 0));

        this.summaryChips = [
          { label: 'Pendientes',  value: map.get(1) ?? 0 },
          { label: 'Aceptadas',   value: map.get(2) ?? 0 },
          { label: 'Canceladas',  value: map.get(4) ?? 0 },
          { label: 'Finalizadas', value: map.get(5) ?? 0 },
        ];

        this.cdr.detectChanges();
      },
      error: () => {
        // silencio, no bloquea UI
      }
    });
  }

  // Modal states
  showDetailModal = false;
  showCancelModal = false;
  selectedRequest: MyRequestRowDTO | null = null;
  cancelling = false;
  successMessage: string | null = null;

  viewDetail(row: MyRequestRowDTO): void {
    this.selectedRequest = row;
    this.showDetailModal = true;
  }

  closeDetailModal(): void {
    this.showDetailModal = false;
    this.selectedRequest = null;
  }

  confirmCancel(row: MyRequestRowDTO): void {
    this.selectedRequest = row;
    this.showCancelModal = true;
  }

  closeCancelModal(): void {
    this.showCancelModal = false;
    this.selectedRequest = null;
  }

  canCancel(status: string): boolean {
    const s = this.norm(status);
    return s.includes('pend') || s.includes('acept');
  }

  doCancelRequest(): void {
    if (!this.selectedRequest) return;

    this.cancelling = true;
    this.errorMessage = null;

    this.svc.cancelRequest(this.selectedRequest.requestId).subscribe({
      next: (response) => {
        this.cancelling = false;
        this.closeCancelModal();
        this.successMessage = response.message || 'Solicitud cancelada exitosamente';
        this.load();
        this.loadSummary();
        this.cdr.detectChanges();

        // Auto-hide success message after 5 seconds
        setTimeout(() => {
          this.successMessage = null;
          this.cdr.detectChanges();
        }, 5000);
      },
      error: (err) => {
        this.cancelling = false;
        this.closeCancelModal();
        this.errorMessage = err?.message || 'Error al cancelar la solicitud';
        this.cdr.detectChanges();
      }
    });
  }

  formatDate(dt: string): string {
    const d = new Date(dt);
    return isNaN(d.getTime()) ? dt : d.toLocaleDateString();
  }

  formatTime(dt: string): string {
    const d = new Date(dt);
    return isNaN(d.getTime()) ? '' : d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }

  // badges por estado (tu BD real)
  private norm(s: string): string { return (s || '').toLowerCase(); }

  isPending(status: string): boolean { return this.norm(status).includes('pend'); }
  isAccepted(status: string): boolean { return this.norm(status).includes('acept'); }
  isRejected(status: string): boolean { return this.norm(status).includes('rech'); }
  isCancelled(status: string): boolean { return this.norm(status).includes('cancel'); }
  isFinished(status: string): boolean { return this.norm(status).includes('final'); }

  // ==================== INVITACIONES GRUPALES ====================
  invitations: InvitationItem[] = [];
  loadingInvitations = false;
  respondingInvId: number | null = null;
  respondingAccept = false;

  loadInvitations(): void {
    this.loadingInvitations = true;
    this.invitationsSvc.getMyInvitations().subscribe({
      next: (data) => {
        this.invitations = data ?? [];
        this.loadingInvitations = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.invitations = [];
        this.loadingInvitations = false;
        this.errorMessage = err?.message || 'Error al cargar invitaciones';
        this.cdr.detectChanges();
      }
    });
  }

  respondInvitation(participantId: number, accept: boolean): void {
    this.respondingInvId = participantId;
    this.respondingAccept = accept;
    this.errorMessage = null;

    this.invitationsSvc.respondInvitation(participantId, accept).subscribe({
      next: (response) => {
        this.respondingInvId = null;
        this.successMessage = response.message || (accept ? 'Invitación aceptada' : 'Invitación rechazada');
        this.loadInvitations();
        this.cdr.detectChanges();

        setTimeout(() => {
          this.successMessage = null;
          this.cdr.detectChanges();
        }, 5000);
      },
      error: (err) => {
        this.respondingInvId = null;
        this.errorMessage = err?.message || 'Error al responder la invitación';
        this.cdr.detectChanges();
      }
    });
  }
}
