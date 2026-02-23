import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, AfterViewInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import {
    TeacherRequestsService
} from '../../../services/teacher/teacher-requests.service';
import {
    TeacherRequestRowDTO,
    TeacherRequestsPageDTO
} from '../../../models/teacher/teacher-request.model';

type Option = { value: number | null; label: string };

@Component({
    selector: 'app-teacher-requests',
    standalone: true,
    imports: [CommonModule, FormsModule, RouterModule],
    template: `
    <div class="container-fluid">

      <!-- Header -->
      <div class="mb-4">
        <div class="d-flex align-items-center gap-3">
          <div class="header-icon">
            <i class="bi bi-inbox"></i>
          </div>
          <div>
            <h3 class="fw-bold text-dark mb-0">Solicitudes de Refuerzo</h3>
            <p class="text-muted mb-0">Revisa y gestiona las solicitudes de refuerzo académico recibidas</p>
          </div>
        </div>
      </div>

      @if (errorMessage) {
        <div class="alert alert-danger alert-dismissible fade show border" role="alert">
          <i class="bi bi-exclamation-triangle-fill me-2"></i>
          {{ errorMessage }}
          <button type="button" class="btn-close" (click)="errorMessage = null"></button>
        </div>
      }

      @if (successMessage) {
        <div class="alert alert-success alert-dismissible fade show border" role="alert">
          <i class="bi bi-check-circle-fill me-2"></i>
          {{ successMessage }}
          <button type="button" class="btn-close" (click)="successMessage = null"></button>
        </div>
      }

      <!-- Detail Modal -->
      @if (showDetailModal && selectedRequest) {
        <div class="modal fade show d-block" tabindex="-1" style="background: rgba(0,0,0,0.5);">
          <div class="modal-dialog modal-dialog-centered">
            <div class="modal-content border">
              <div class="modal-header border-bottom">
                <h5 class="modal-title fw-bold">
                  <i class="bi bi-file-earmark-text me-2"></i>Detalle de Solicitud #{{ selectedRequest.requestId }}
                </h5>
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
                    <label class="form-label text-muted small mb-0">Estudiante</label>
                    <div class="fw-semibold">{{ selectedRequest.studentName }}</div>
                  </div>
                  <div class="col-12">
                    <label class="form-label text-muted small mb-0">Asignatura</label>
                    <div class="fw-semibold">{{ selectedRequest.subjectName }}</div>
                    <small class="text-muted">{{ selectedRequest.subjectCode }}</small>
                  </div>
                  <div class="col-12">
                    <label class="form-label text-muted small mb-0">Tema</label>
                    <div class="fw-semibold">{{ selectedRequest.topic }}</div>
                  </div>
                  <div class="col-6">
                    <label class="form-label text-muted small mb-0">Tipo de Sesión</label>
                    <div class="fw-semibold">{{ selectedRequest.sessionType }}</div>
                  </div>
                  <div class="col-6">
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
              <div class="modal-footer border-top">
                @if (canRespond(selectedRequest.status)) {
                  <button type="button" class="btn btn-outline-danger" (click)="closeDetailModal(); confirmReject(selectedRequest)">
                    <i class="bi bi-x-circle me-1"></i> Rechazar
                  </button>
                  <button type="button" class="btn btn-success" (click)="closeDetailModal(); confirmAccept(selectedRequest)">
                    <i class="bi bi-check-circle me-1"></i> Aceptar
                  </button>
                } @else {
                  <button type="button" class="btn btn-secondary" (click)="closeDetailModal()">Cerrar</button>
                }
              </div>
            </div>
          </div>
        </div>
      }

      <!-- Accept Confirmation Modal -->
      @if (showAcceptModal && selectedRequest) {
        <div class="modal fade show d-block" tabindex="-1" style="background: rgba(0,0,0,0.5);">
          <div class="modal-dialog modal-dialog-centered">
            <div class="modal-content border">
              <div class="modal-header border-bottom">
                <div class="d-flex align-items-center gap-3">
                  <div class="rounded-circle bg-success-subtle text-success d-flex align-items-center justify-content-center"
                       style="width: 48px; height: 48px; font-size: 1.3rem;">
                    <i class="bi bi-check-circle"></i>
                  </div>
                  <h5 class="modal-title fw-bold">Confirmar Aceptación</h5>
                </div>
                <button type="button" class="btn-close" (click)="closeAcceptModal()" [disabled]="updating"></button>
              </div>
              <div class="modal-body">
                <p class="text-muted mb-0">
                  ¿Estás seguro de que deseas <strong>aceptar</strong> la solicitud de refuerzo
                  <strong>#{{ selectedRequest.requestId }}</strong> del estudiante
                  <strong>{{ selectedRequest.studentName }}</strong>?
                </p>
              </div>
              <div class="modal-footer border-top">
                <button type="button" class="btn btn-outline-secondary" (click)="closeAcceptModal()" [disabled]="updating">Cancelar</button>
                <button type="button" class="btn btn-success" (click)="doUpdateStatus(2)" [disabled]="updating">
                  @if (updating) {
                    <span class="spinner-border spinner-border-sm me-2"></span> Aceptando...
                  } @else {
                    <i class="bi bi-check-circle me-1"></i> Sí, aceptar
                  }
                </button>
              </div>
            </div>
          </div>
        </div>
      }

      <!-- Reject Confirmation Modal -->
      @if (showRejectModal && selectedRequest) {
        <div class="modal fade show d-block" tabindex="-1" style="background: rgba(0,0,0,0.5);">
          <div class="modal-dialog modal-dialog-centered">
            <div class="modal-content border">
              <div class="modal-header border-bottom">
                <div class="d-flex align-items-center gap-3">
                  <div class="rounded-circle bg-danger-subtle text-danger d-flex align-items-center justify-content-center"
                       style="width: 48px; height: 48px; font-size: 1.3rem;">
                    <i class="bi bi-x-circle"></i>
                  </div>
                  <h5 class="modal-title fw-bold">Confirmar Rechazo</h5>
                </div>
                <button type="button" class="btn-close" (click)="closeRejectModal()" [disabled]="updating"></button>
              </div>
              <div class="modal-body">
                <p class="text-muted mb-0">
                  ¿Estás seguro de que deseas <strong>rechazar</strong> la solicitud de refuerzo
                  <strong>#{{ selectedRequest.requestId }}</strong> del estudiante
                  <strong>{{ selectedRequest.studentName }}</strong>?
                </p>
              </div>
              <div class="modal-footer border-top">
                <button type="button" class="btn btn-outline-secondary" (click)="closeRejectModal()" [disabled]="updating">Cancelar</button>
                <button type="button" class="btn btn-danger" (click)="doUpdateStatus(3)" [disabled]="updating">
                  @if (updating) {
                    <span class="spinner-border spinner-border-sm me-2"></span> Rechazando...
                  } @else {
                    <i class="bi bi-x-circle me-1"></i> Sí, rechazar
                  }
                </button>
              </div>
            </div>
          </div>
        </div>
      }

      <!-- Summary Chips -->
      <div class="row g-2 mb-3">
        @for (chip of summaryChips; track chip.label) {
          <div class="col-6 col-lg-3">
            <div class="chip-box p-3 bg-white shadow-sm border rounded-3 d-flex justify-content-between align-items-center">
              <div>
                <div class="text-muted small">{{ chip.label }}</div>
                <div class="fw-bold fs-4" [style.color]="chip.color">{{ chip.value }}</div>
              </div>
              <div class="chip-icon-wrapper d-flex align-items-center justify-content-center rounded-circle"
                   [style.background-color]="chip.bgColor">
                <i class="bi" [ngClass]="chip.icon" [style.color]="chip.color"></i>
              </div>
            </div>
          </div>
        }
      </div>

      <!-- Filters -->
      <div class="card border shadow-sm mb-3">
        <div class="card-body">
          <div class="row g-2 align-items-end">

            <div class="col-12 col-lg-5">
              <label class="form-label mb-1 small fw-semibold">
                <i class="bi bi-search me-1"></i>Buscar
              </label>
              <input class="form-control border"
                     [(ngModel)]="filters.search"
                     placeholder="Buscar por estudiante, tema o asignatura"
                     (keyup.enter)="applyFilters()"/>
            </div>

            <div class="col-6 col-lg-2">
              <label class="form-label mb-1 small fw-semibold">
                <i class="bi bi-funnel me-1"></i>Estado
              </label>
              <select class="form-select border" [(ngModel)]="filters.statusId" (change)="applyFilters()">
                @for (o of statusOptions; track o.label) {
                  <option [ngValue]="o.value">{{ o.label }}</option>
                }
              </select>
            </div>

            <div class="col-6 col-lg-2">
              <label class="form-label mb-1 small fw-semibold">
                <i class="bi bi-people me-1"></i>Tipo
              </label>
              <select class="form-select border" [(ngModel)]="filters.sessionTypeId" (change)="applyFilters()">
                @for (o of sessionTypeOptions; track o.label) {
                  <option [ngValue]="o.value">{{ o.label }}</option>
                }
              </select>
            </div>

            <div class="col-12 col-lg-3 d-flex gap-2">
              <button class="btn btn-outline-secondary border w-100" (click)="clearFilters()">
                <i class="bi bi-arrow-counterclockwise me-1"></i> Limpiar
              </button>
            </div>

          </div>
        </div>
      </div>

      <!-- Table -->
      <div class="card border shadow-sm">
        <div class="card-body">

          @if (loading) {
            <div class="text-center py-5">
              <div class="spinner-border text-success" role="status">
                <span class="visually-hidden">Cargando...</span>
              </div>
              <p class="text-muted mt-2 mb-0">Cargando solicitudes...</p>
            </div>
          } @else {
            <div class="table-responsive">
              <table class="table align-middle mb-0">
                <thead class="table-light">
                <tr>
                  <th>FECHA</th>
                  <th>ESTUDIANTE</th>
                  <th>ASIGNATURA</th>
                  <th>TEMA</th>
                  <th>TIPO</th>
                  <th>ESTADO</th>
                  <th class="text-end">ACCIONES</th>
                </tr>
                </thead>

                <tbody>
                  @if (rows.length === 0) {
                    <tr>
                      <td colspan="7" class="text-center py-5 text-muted">
                        <i class="bi bi-inbox display-4 d-block mb-2 opacity-25"></i>
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
                          <div class="fw-semibold">{{ r.studentName }}</div>
                        </td>

                        <td>
                          <div class="fw-semibold">{{ r.subjectName }}</div>
                          <div class="text-muted small">{{ r.subjectCode }}</div>
                        </td>

                        <td>{{ r.topic }}</td>

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
                          <div class="d-flex gap-1 justify-content-end">
                            <button class="btn btn-sm btn-outline-secondary border" type="button"
                                    title="Ver detalle" (click)="viewDetail(r)">
                              <i class="bi bi-eye"></i>
                            </button>
                            @if (canRespond(r.status)) {
                              <button class="btn btn-sm btn-outline-success border" type="button"
                                      title="Aceptar" (click)="confirmAccept(r)">
                                <i class="bi bi-check-lg"></i>
                              </button>
                              <button class="btn btn-sm btn-outline-danger border" type="button"
                                      title="Rechazar" (click)="confirmReject(r)">
                                <i class="bi bi-x-lg"></i>
                              </button>
                            }
                          </div>
                        </td>
                      </tr>
                    }
                  }
                </tbody>
              </table>
            </div>

            <!-- Pagination footer -->
            <div class="d-flex justify-content-between align-items-center mt-3 flex-wrap gap-2">
              <div class="text-muted small">
                Página {{ page }} de {{ totalPages }} · Total: {{ totalCount }}
              </div>

              <div class="d-flex gap-2">
                <button class="btn btn-outline-secondary btn-sm border"
                        [disabled]="page <= 1 || loading"
                        (click)="goTo(page - 1)">
                  <i class="bi bi-chevron-left me-1"></i>Anterior
                </button>
                <button class="btn btn-outline-secondary btn-sm border"
                        [disabled]="page >= totalPages || loading"
                        (click)="goTo(page + 1)">
                  Siguiente<i class="bi bi-chevron-right ms-1"></i>
                </button>
              </div>
            </div>
          }

        </div>
      </div>

    </div>
  `,
    styles: [`
    :host {
      font-family: 'Inter', 'Segoe UI', -apple-system, BlinkMacSystemFont, sans-serif;
    }
    .header-icon {
      width: 48px; height: 48px; min-width: 48px;
      border-radius: 14px;
      background-color: #1B7505; color: #fff;
      display: flex; align-items: center; justify-content: center;
      font-size: 1.4rem; border: 1px solid #145904;
    }
    .chip-box { min-height: 72px; border: 1px solid #e0e0e0 !important; }
    .chip-icon-wrapper {
      width: 40px; height: 40px; min-width: 40px;
      font-size: 1.1rem;
    }
    th { white-space: nowrap; font-size: .85rem; letter-spacing: .02em; }
    td { vertical-align: middle; }
    .table { border: 1px solid #e0e0e0; border-radius: 8px; overflow: hidden; }
    .table thead th { border-bottom: 2px solid #e0e0e0; }
    .table tbody tr { border-bottom: 1px solid #f0f0f0; }
    .table tbody tr:hover { background-color: #f8fdf5; }
  `]
})
export class TeacherRequestsComponent implements AfterViewInit {
    private svc = inject(TeacherRequestsService);
    private cdr = inject(ChangeDetectorRef);

    loading = false;
    errorMessage: string | null = null;
    successMessage: string | null = null;

    rows: TeacherRequestRowDTO[] = [];
    totalCount = 0;

    page = 1;
    size = 10;
    totalPages = 1;

    filters: {
        statusId?: number | null;
        sessionTypeId?: number | null;
        search?: string;
    } = {
            statusId: null,
            sessionTypeId: null,
            search: ''
        };

    // Status IDs: 1=Pendiente, 2=Aceptada, 3=Rechazada, 4=Cancelada, 5=Finalizada
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

    summaryChips: { label: string; value: number; icon: string; color: string; bgColor: string }[] = [
        { label: 'Pendientes', value: 0, icon: 'bi-clock-history', color: '#ed6c02', bgColor: '#fff3e0' },
        { label: 'Aceptadas', value: 0, icon: 'bi-check-circle', color: '#1B7505', bgColor: '#e8f5e9' },
        { label: 'Rechazadas', value: 0, icon: 'bi-x-circle', color: '#d32f2f', bgColor: '#ffebee' },
        { label: 'Finalizadas', value: 0, icon: 'bi-flag', color: '#424242', bgColor: '#f5f5f5' },
    ];

    // Modal states
    showDetailModal = false;
    showAcceptModal = false;
    showRejectModal = false;
    selectedRequest: TeacherRequestRowDTO | null = null;
    updating = false;

    ngAfterViewInit(): void {
        Promise.resolve().then(() => {
            this.load();
            this.loadSummary();
        });
    }

    applyFilters(): void {
        this.page = 1;
        this.load();
        this.loadSummary();
    }

    clearFilters(): void {
        this.filters = { statusId: null, sessionTypeId: null, search: '' };
        this.applyFilters();
    }

    goTo(p: number): void {
        this.page = p;
        this.load();
    }

    load(): void {
        this.loading = true;
        this.errorMessage = null;

        this.svc.getRequests({
            statusId: this.filters.statusId ?? undefined,
            sessionTypeId: this.filters.sessionTypeId ?? undefined,
            search: (this.filters.search ?? '').trim() || undefined,
            page: this.page,
            size: this.size,
        }).subscribe({
            next: (res: TeacherRequestsPageDTO) => {
                this.rows = res.items ?? [];
                this.totalCount = res.totalCount ?? 0;
                this.page = res.page ?? this.page;
                this.size = res.size ?? this.size;
                this.totalPages = Math.max(1, Math.ceil(this.totalCount / this.size));
                this.loading = false;
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
        this.svc.getRequestsSummary().subscribe({
            next: (data) => {
                const map = new Map<number, number>();
                for (const s of data ?? []) map.set(Number(s.statusId), Number(s.total ?? 0));

                this.summaryChips = [
                    { label: 'Pendientes', value: map.get(1) ?? 0, icon: 'bi-clock-history', color: '#ed6c02', bgColor: '#fff3e0' },
                    { label: 'Aceptadas', value: map.get(2) ?? 0, icon: 'bi-check-circle', color: '#1B7505', bgColor: '#e8f5e9' },
                    { label: 'Rechazadas', value: map.get(3) ?? 0, icon: 'bi-x-circle', color: '#d32f2f', bgColor: '#ffebee' },
                    { label: 'Finalizadas', value: map.get(5) ?? 0, icon: 'bi-flag', color: '#424242', bgColor: '#f5f5f5' },
                ];

                this.cdr.detectChanges();
            },
            error: () => { /* silent */ }
        });
    }

    // --- Modal actions ---

    viewDetail(row: TeacherRequestRowDTO): void {
        this.selectedRequest = row;
        this.showDetailModal = true;
    }

    closeDetailModal(): void {
        this.showDetailModal = false;
        this.selectedRequest = null;
    }

    confirmAccept(row: TeacherRequestRowDTO): void {
        this.selectedRequest = row;
        this.showAcceptModal = true;
    }

    closeAcceptModal(): void {
        this.showAcceptModal = false;
        this.selectedRequest = null;
    }

    confirmReject(row: TeacherRequestRowDTO): void {
        this.selectedRequest = row;
        this.showRejectModal = true;
    }

    closeRejectModal(): void {
        this.showRejectModal = false;
        this.selectedRequest = null;
    }

    doUpdateStatus(statusId: number): void {
        if (!this.selectedRequest) return;

        this.updating = true;
        this.errorMessage = null;

        this.svc.updateRequestStatus(this.selectedRequest.requestId, statusId).subscribe({
            next: (response) => {
                this.updating = false;
                const action = statusId === 2 ? 'aceptada' : 'rechazada';
                this.successMessage = response.message || `Solicitud ${action} exitosamente`;
                this.closeAcceptModal();
                this.closeRejectModal();
                this.load();
                this.loadSummary();
                this.cdr.detectChanges();

                setTimeout(() => {
                    this.successMessage = null;
                    this.cdr.detectChanges();
                }, 5000);
            },
            error: (err) => {
                this.updating = false;
                this.closeAcceptModal();
                this.closeRejectModal();
                this.errorMessage = err?.message || 'Error al actualizar el estado';
                this.cdr.detectChanges();
            }
        });
    }

    canRespond(status: string): boolean {
        return this.isPending(status);
    }

    // --- Helpers ---

    formatDate(dt: string): string {
        const d = new Date(dt);
        return isNaN(d.getTime()) ? dt : d.toLocaleDateString();
    }

    formatTime(dt: string): string {
        const d = new Date(dt);
        return isNaN(d.getTime()) ? '' : d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }

    private norm(s: string): string { return (s || '').toLowerCase(); }

    isPending(status: string): boolean { return this.norm(status).includes('pend'); }
    isAccepted(status: string): boolean { return this.norm(status).includes('acept'); }
    isRejected(status: string): boolean { return this.norm(status).includes('rech'); }
    isCancelled(status: string): boolean { return this.norm(status).includes('cancel'); }
    isFinished(status: string): boolean { return this.norm(status).includes('final'); }
}
