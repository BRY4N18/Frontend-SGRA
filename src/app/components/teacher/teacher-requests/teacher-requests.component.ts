import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, AfterViewInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { TeacherRequestsService } from '../../../services/teacher/teacher-requests.service';
import {
  ReinforcementRequestDTO,
  ReinforcementRequestStatusDTO
} from '../../../models/teacher/teacher-request.model';
import { forkJoin } from 'rxjs';

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
                  <i class="bi bi-file-earmark-text me-2"></i>Solicitud #{{ selectedRequest.reinforcementRequestId }}
                </h5>
                <button type="button" class="btn-close" (click)="closeDetailModal()"></button>
              </div>
              <div class="modal-body">
                <div class="row g-3">
                  <div class="col-6">
                    <label class="form-label text-muted small mb-0">Fecha</label>
                    <div class="fw-semibold">{{ formatDate(selectedRequest.createdAt) }}</div>
                  </div>
                  <div class="col-6">
                    <label class="form-label text-muted small mb-0">Hora</label>
                    <div class="fw-semibold">{{ formatTime(selectedRequest.createdAt) }}</div>
                  </div>
                  <div class="col-12">
                    <label class="form-label text-muted small mb-0">Motivo</label>
                    <div class="fw-semibold">{{ selectedRequest.reason }}</div>
                  </div>
                  <div class="col-6">
                    <label class="form-label text-muted small mb-0">Día solicitado</label>
                    <div class="fw-semibold">{{ getDayName(selectedRequest.requestedDay) }}</div>
                  </div>
                  <div class="col-6">
                    <label class="form-label text-muted small mb-0">Estado</label>
                    <div>
                      <span class="badge rounded-pill"
                            [ngClass]="getStatusBadgeClass(selectedRequest.requestStatusId)">
                        {{ getStatusName(selectedRequest.requestStatusId) }}
                      </span>
                    </div>
                  </div>
                  @if (selectedRequest.fileUrl) {
                    <div class="col-12">
                      <label class="form-label text-muted small mb-0">Archivo adjunto</label>
                      <div>
                        <a [href]="selectedRequest.fileUrl" target="_blank" class="text-success">
                          <i class="bi bi-paperclip me-1"></i>Ver archivo
                        </a>
                      </div>
                    </div>
                  }
                </div>
              </div>
              <div class="modal-footer border-top">
                @if (isPendingStatus(selectedRequest.requestStatusId)) {
                  <button type="button" class="btn btn-outline-danger" (click)="openConfirmReject()">
                    <i class="bi bi-x-circle me-1"></i> Rechazar
                  </button>
                  <button type="button" class="btn btn-success" (click)="openConfirmAccept()">
                    <i class="bi bi-check-circle me-1"></i> Aprobar
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
          <div class="modal-dialog modal-dialog-centered modal-sm">
            <div class="modal-content border">
              <div class="modal-header border-bottom">
                <div class="d-flex align-items-center gap-3">
                  <div class="rounded-circle bg-success-subtle text-success d-flex align-items-center justify-content-center"
                       style="width: 48px; height: 48px; font-size: 1.3rem;">
                    <i class="bi bi-check-circle"></i>
                  </div>
                  <h5 class="modal-title fw-bold">Confirmar Aprobación</h5>
                </div>
                <button type="button" class="btn-close" (click)="closeAcceptModal()" [disabled]="updating"></button>
              </div>
              <div class="modal-body">
                <p class="text-muted mb-0">
                  ¿Estás seguro de que deseas <strong>aprobar</strong> la solicitud
                  <strong>#{{ selectedRequest.reinforcementRequestId }}</strong>?
                </p>
              </div>
              <div class="modal-footer border-top">
                <button type="button" class="btn btn-outline-secondary" (click)="closeAcceptModal()" [disabled]="updating">Cancelar</button>
                <button type="button" class="btn btn-success" (click)="doUpdateStatus(2)" [disabled]="updating">
                  @if (updating) {
                    <span class="spinner-border spinner-border-sm me-2"></span> Aprobando...
                  } @else {
                    <i class="bi bi-check-circle me-1"></i> Sí, aprobar
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
          <div class="modal-dialog modal-dialog-centered modal-sm">
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
                  ¿Estás seguro de que deseas <strong>rechazar</strong> la solicitud
                  <strong>#{{ selectedRequest.reinforcementRequestId }}</strong>?
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
          <div class="col-6 col-lg-4">
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
                     placeholder="Buscar por motivo o ID"
                     (keyup.enter)="applyFilters()"/>
            </div>

            <div class="col-6 col-lg-3">
              <label class="form-label mb-1 small fw-semibold">
                <i class="bi bi-funnel me-1"></i>Estado
              </label>
              <select class="form-select border" [(ngModel)]="filters.statusId" (change)="applyFilters()">
                @for (o of statusOptions; track o.label) {
                  <option [ngValue]="o.value">{{ o.label }}</option>
                }
              </select>
            </div>

            <div class="col-6 col-lg-4 d-flex gap-2">
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
                  <th>ID</th>
                  <th>FECHA</th>
                  <th>DÍA</th>
                  <th>MOTIVO</th>
                  <th>ESTADO</th>
                  <th class="text-end">ACCIONES</th>
                </tr>
                </thead>

                <tbody>
                  @if (rows.length === 0) {
                    <tr>
                      <td colspan="6" class="text-center py-5 text-muted">
                        <i class="bi bi-inbox display-4 d-block mb-2 opacity-25"></i>
                        Sin solicitudes para mostrar.
                      </td>
                    </tr>
                  } @else {
                    @for (r of rows; track r.reinforcementRequestId) {
                      <tr class="clickable-row" (click)="viewDetail(r)">
                        <td class="fw-semibold text-muted">#{{ r.reinforcementRequestId }}</td>

                        <td class="fw-semibold">
                          {{ formatDate(r.createdAt) }}
                          <div class="text-muted small">{{ formatTime(r.createdAt) }}</div>
                        </td>

                        <td>{{ getDayName(r.requestedDay) }}</td>

                        <td>{{ r.reason }}</td>

                        <td>
                          <span class="badge rounded-pill"
                                [ngClass]="getStatusBadgeClass(r.requestStatusId)">
                            {{ getStatusName(r.requestStatusId) }}
                          </span>
                        </td>

                        <td class="text-end">
                          <button class="btn btn-sm btn-outline-success border" type="button"
                                  title="Ver detalle" (click)="$event.stopPropagation(); viewDetail(r)">
                            <i class="bi bi-eye me-1"></i>Ver
                          </button>
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
    .clickable-row { cursor: pointer; transition: background-color 0.15s; }
    .clickable-row:hover { background-color: #edf7e8 !important; }
  `]
})
export class TeacherRequestsComponent implements AfterViewInit {
  private svc = inject(TeacherRequestsService);
  private cdr = inject(ChangeDetectorRef);

  loading = false;
  errorMessage: string | null = null;
  successMessage: string | null = null;

  rows: ReinforcementRequestDTO[] = [];
  allRequests: ReinforcementRequestDTO[] = [];
  totalCount = 0;

  page = 1;
  size = 10;
  totalPages = 1;

  filters: {
    statusId?: number | null;
    search?: string;
  } = {
      statusId: null,
      search: ''
    };

  // Loaded dynamically from /api/reinforcement/reinforcement-request-statuses
  requestStatuses: ReinforcementRequestStatusDTO[] = [];
  statusOptions: Option[] = [
    { value: null, label: 'Todos' },
  ];

  summaryChips: { label: string; value: number; icon: string; color: string; bgColor: string }[] = [
    { label: 'Pendientes', value: 0, icon: 'bi-clock-history', color: '#ed6c02', bgColor: '#fff3e0' },
    { label: 'Aprobadas', value: 0, icon: 'bi-check-circle', color: '#1B7505', bgColor: '#e8f5e9' },
    { label: 'Rechazadas', value: 0, icon: 'bi-x-circle', color: '#d32f2f', bgColor: '#ffebee' },
  ];

  // Modal states
  showDetailModal = false;
  showAcceptModal = false;
  showRejectModal = false;
  selectedRequest: ReinforcementRequestDTO | null = null;
  updating = false;

  private readonly dayNames: Record<number, string> = {
    1: 'Lunes', 2: 'Martes', 3: 'Miércoles', 4: 'Jueves', 5: 'Viernes', 6: 'Sábado', 7: 'Domingo'
  };

  ngAfterViewInit(): void {
    Promise.resolve().then(() => {
      this.loadStatuses();
    });
  }

  loadStatuses(): void {
    this.svc.getRequestStatuses().subscribe({
      next: (statuses) => {
        this.requestStatuses = statuses.filter(s => s.state);
        this.statusOptions = [
          { value: null, label: 'Todos' },
          ...this.requestStatuses.map(s => ({
            value: s.idReinforcementRequestStatus,
            label: s.nameState
          }))
        ];
        this.cdr.detectChanges();
        // Now load requests after statuses are available
        this.load();
      },
      error: (err) => {
        console.error('[TeacherRequests] Error loading statuses:', err);
        // Still try to load with defaults
        this.load();
      }
    });
  }

  applyFilters(): void {
    this.page = 1;
    this.load();
  }

  clearFilters(): void {
    this.filters = { statusId: null, search: '' };
    this.applyFilters();
  }

  goTo(p: number): void {
    this.page = p;
    this.applyLocalFilters();
    this.cdr.detectChanges();
  }

  load(): void {
    this.loading = true;
    this.errorMessage = null;

    const statusId = this.filters.statusId;

    if (statusId) {
      // Filter by specific status
      this.svc.getRequestsByStatus(statusId).subscribe({
        next: (data) => {
          this.allRequests = data ?? [];
          this.applyLocalFilters();
          this.updateSummaryFromData();
          this.loading = false;
          this.cdr.detectChanges();
        },
        error: (err) => {
          this.errorMessage = err?.message || 'Error al cargar solicitudes';
          this.allRequests = [];
          this.rows = [];
          this.totalCount = 0;
          this.totalPages = 1;
          this.loading = false;
          this.cdr.detectChanges();
        }
      });
    } else {
      // No status filter: load all active statuses
      const activeStatuses = this.requestStatuses.length > 0
        ? this.requestStatuses
        : [{ idReinforcementRequestStatus: 1, nameState: 'Pendiente', state: true }];

      const requests$ = activeStatuses.map(s =>
        this.svc.getRequestsByStatus(s.idReinforcementRequestStatus)
      );

      forkJoin(requests$).subscribe({
        next: (results) => {
          this.allRequests = results.flat();
          this.applyLocalFilters();
          this.updateSummaryFromData();
          this.loading = false;
          this.cdr.detectChanges();
        },
        error: (err) => {
          this.errorMessage = err?.message || 'Error al cargar solicitudes';
          this.allRequests = [];
          this.rows = [];
          this.totalCount = 0;
          this.totalPages = 1;
          this.loading = false;
          this.cdr.detectChanges();
        }
      });
    }
  }

  /** Apply search and pagination locally on already-fetched data */
  private applyLocalFilters(): void {
    let filtered = [...this.allRequests];

    // Search filter
    const search = (this.filters.search ?? '').trim().toLowerCase();
    if (search) {
      filtered = filtered.filter(r =>
        r.reason.toLowerCase().includes(search) ||
        r.reinforcementRequestId.toString().includes(search)
      );
    }

    // Sort by createdAt descending (newest first)
    filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    this.totalCount = filtered.length;
    this.totalPages = Math.max(1, Math.ceil(this.totalCount / this.size));

    // Paginate
    const start = (this.page - 1) * this.size;
    this.rows = filtered.slice(start, start + this.size);
  }

  /** Update summary chips from the loaded data */
  private updateSummaryFromData(): void {
    // Count by statusId across ALL loaded requests
    const countByStatus = new Map<number, number>();
    for (const r of this.allRequests) {
      countByStatus.set(r.requestStatusId, (countByStatus.get(r.requestStatusId) ?? 0) + 1);
    }

    this.summaryChips = [
      { label: 'Pendientes', value: countByStatus.get(1) ?? 0, icon: 'bi-clock-history', color: '#ed6c02', bgColor: '#fff3e0' },
      { label: 'Aprobadas', value: countByStatus.get(2) ?? 0, icon: 'bi-check-circle', color: '#1B7505', bgColor: '#e8f5e9' },
      { label: 'Rechazadas', value: countByStatus.get(3) ?? 0, icon: 'bi-x-circle', color: '#d32f2f', bgColor: '#ffebee' },
    ];
  }

  // --- Status helpers ---

  getStatusName(statusId: number): string {
    const found = this.requestStatuses.find(s => s.idReinforcementRequestStatus === statusId);
    return found?.nameState ?? 'Desconocido';
  }

  getStatusBadgeClass(statusId: number): string {
    switch (statusId) {
      case 1: return 'bg-warning text-dark';  // Pendiente
      case 2: return 'bg-success';             // Aprobada
      case 3: return 'bg-danger';              // Rechazada
      default: return 'bg-secondary';
    }
  }

  isPendingStatus(statusId: number): boolean {
    return statusId === 1;
  }

  getDayName(day: number): string {
    return this.dayNames[day] ?? `Día ${day}`;
  }

  // --- Modal actions ---

  viewDetail(row: ReinforcementRequestDTO): void {
    this.selectedRequest = row;
    this.showDetailModal = true;
  }

  closeDetailModal(): void {
    this.showDetailModal = false;
    this.selectedRequest = null;
  }

  /** Transition from detail modal → accept confirm (keeps selectedRequest) */
  openConfirmAccept(): void {
    this.showDetailModal = false;
    this.showAcceptModal = true;
  }

  /** Transition from detail modal → reject confirm (keeps selectedRequest) */
  openConfirmReject(): void {
    this.showDetailModal = false;
    this.showRejectModal = true;
  }

  confirmAccept(row: ReinforcementRequestDTO): void {
    this.selectedRequest = row;
    this.showAcceptModal = true;
  }

  closeAcceptModal(): void {
    this.showAcceptModal = false;
    this.selectedRequest = null;
  }

  confirmReject(row: ReinforcementRequestDTO): void {
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

    this.svc.updateRequestStatus(this.selectedRequest.reinforcementRequestId, statusId).subscribe({
      next: (updated) => {
        this.updating = false;
        const action = statusId === 2 ? 'aprobada' : 'rechazada';
        this.successMessage = `Solicitud #${updated.reinforcementRequestId} ${action} exitosamente`;
        this.closeAcceptModal();
        this.closeRejectModal();
        this.load();
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

  // --- Helpers ---

  formatDate(dt: string): string {
    const d = new Date(dt);
    return isNaN(d.getTime()) ? dt : d.toLocaleDateString();
  }

  formatTime(dt: string): string {
    const d = new Date(dt);
    return isNaN(d.getTime()) ? '' : d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }
}
