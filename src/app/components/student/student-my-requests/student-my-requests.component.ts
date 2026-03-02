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
  templateUrl: './student-my-requests.component.html',
  styleUrl: './student-my-requests.component.css'
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
