import { CommonModule } from '@angular/common';
import { Component, OnInit, ChangeDetectorRef, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TeacherRequestsService } from '../../../services/teacher/teacher-requests.service';
import { TeacherSessionsService } from '../../../services/teacher/teacher-sessions.service';
import {
  TeacherRequestItemDTO,
  AcceptRescheduleBodyDTO,
  AttendanceEntryDTO,
} from '../../../models/teacher/teacher-request.model';

type ModalMode = 'none' | 'detail' | 'accept' | 'reject' | 'reschedule' | 'cancel' | 'virtualLink' | 'attendance' | 'performed';

const STATUS_ID = { PENDING: 1, ACCEPTED: 2, REJECTED: 3, CANCELLED: 4, COMPLETED: 5 } as const;
const MODALITY  = { VIRTUAL: 1, PRESENCIAL: 2 } as const;

const STATUS_META: Record<number, { badge: string }> = {
  1: { badge: 'bg-warning text-dark' },
  2: { badge: 'bg-success'           },
  3: { badge: 'bg-danger'            },
  4: { badge: 'bg-secondary'         },
  5: { badge: 'bg-primary'           },
};

@Component({
  selector: 'app-teacher-requests',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './teacher-requests.component.html',
  styleUrl: './teacher-requests.component.css'
})
export class TeacherRequestsComponent implements OnInit {
  private reqSvc  = inject(TeacherRequestsService);
  private sessSvc = inject(TeacherSessionsService);
  private cdr     = inject(ChangeDetectorRef);

  loading  = false;
  busy     = false;
  errorMsg: string | null  = null;
  successMsg: string | null = null;

  rows: TeacherRequestItemDTO[] = [];
  totalCount = 0;
  page       = 1;
  size       = 10;
  totalPages = 1;

  filters: { statusId: number | null } = { statusId: null };

  summaryChips = [
    { label: 'Pendientes', value: 0, icon: 'bi-clock-history', color: '#ed6c02', bg: '#fff3e0' },
    { label: 'Aceptadas',  value: 0, icon: 'bi-check-circle',  color: '#1B7505', bg: '#e8f5e9' },
    { label: 'Rechazadas', value: 0, icon: 'bi-x-circle',      color: '#d32f2f', bg: '#ffebee' },
  ];

  // Modal
  activeModal: ModalMode = 'none';
  selected: TeacherRequestItemDTO | null = null;

  // Accept/Reschedule form
  scheduleForm: AcceptRescheduleBodyDTO = { scheduledDate: '', timeSlotId: 0, modalityId: 1, estimatedDuration: '', reason: '', workAreaId: undefined };
  todayStr = new Date().toISOString().split('T')[0];

  // Reject/Cancel
  reasonText = '';

  // Virtual link
  virtualLinkUrl = '';

  // Attendance
  attendancePerformedId: number | null = null;
  attendanceList: AttendanceEntryDTO[] = [{ participantId: 0, attended: true }];

  // Performed
  performedObservation = '';
  performedDuration    = '';
  performedFiles: File[] = [];

  ngOnInit(): void { this.load(); }

  load(): void {
    this.loading  = true;
    this.errorMsg = null;
    this.reqSvc.getRequests({ statusId: this.filters.statusId, page: this.page, size: this.size }).subscribe({
      next: d => {
        this.rows       = d.items ?? [];
        this.totalCount = d.totalCount;
        this.totalPages = d.totalPages ?? Math.max(1, Math.ceil(d.totalCount / this.size));
        this.page       = d.page;
        this.updateChips();
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: err => {
        this.errorMsg = err?.message || 'Error al cargar solicitudes';
        this.loading  = false;
        this.cdr.detectChanges();
      }
    });
  }

  clearFilters(): void { this.filters = { statusId: null }; this.page = 1; this.load(); }
  goTo(p: number):     void { this.page = p; this.load(); }

  private updateChips(): void {
    if (this.filters.statusId === null) {
      const m = new Map<number, number>();
      this.rows.forEach(r => m.set(r.statusId, (m.get(r.statusId) ?? 0) + 1));
      this.summaryChips[0].value = m.get(STATUS_ID.PENDING)   ?? 0;
      this.summaryChips[1].value = m.get(STATUS_ID.ACCEPTED)  ?? 0;
      this.summaryChips[2].value = m.get(STATUS_ID.REJECTED)  ?? 0;
    }
  }

  openDetail(r: TeacherRequestItemDTO):      void { this.selected = r; this.activeModal = 'detail'; }
  openReject(r: TeacherRequestItemDTO):      void { this.selected = r; this.reasonText = ''; this.activeModal = 'reject'; }
  openCancel(r: TeacherRequestItemDTO):      void { this.selected = r; this.reasonText = ''; this.activeModal = 'cancel'; }
  openVirtualLink(r: TeacherRequestItemDTO): void { this.selected = r; this.virtualLinkUrl = ''; this.activeModal = 'virtualLink'; }

  openAccept(r: TeacherRequestItemDTO): void {
    this.selected = r;
    this.scheduleForm = { scheduledDate: '', timeSlotId: 0, modalityId: 1, estimatedDuration: '', reason: '', workAreaId: undefined };
    this.activeModal = 'accept';
  }

  openReschedule(r: TeacherRequestItemDTO): void {
    this.selected = r;
    this.scheduleForm = { scheduledDate: '', timeSlotId: 0, modalityId: 1, estimatedDuration: '', reason: '', workAreaId: undefined };
    this.activeModal = 'reschedule';
  }

  openAttendance(r: TeacherRequestItemDTO): void {
    this.selected = r;
    this.attendancePerformedId = null;
    this.attendanceList = Array.from({ length: r.participantCount || 1 }, () => ({ participantId: 0, attended: true }));
    this.activeModal = 'attendance';
  }

  openPerformed(r: TeacherRequestItemDTO): void {
    this.selected = r;
    this.performedObservation = '';
    this.performedDuration    = '';
    this.performedFiles       = [];
    this.activeModal = 'performed';
  }

  closeModal(): void { this.activeModal = 'none'; this.selected = null; }

  onModalityChange(): void {
    if (this.scheduleForm.modalityId !== MODALITY.PRESENCIAL) {
      this.scheduleForm.workAreaId = undefined;
    }
  }

  scheduleFormValid(): boolean {
    const f = this.scheduleForm;
    const base = !!f.scheduledDate && f.timeSlotId > 0 && f.modalityId > 0 && !!f.estimatedDuration.trim();
    const pres = f.modalityId !== MODALITY.PRESENCIAL || (!!f.workAreaId && f.workAreaId > 0);
    return base && pres;
  }

  isValidUrl(url: string): boolean {
    try { return new URL(url).protocol.startsWith('https'); } catch { return false; }
  }

  addAttendanceRow():        void { this.attendanceList.push({ participantId: 0, attended: true }); }
  removeAttendanceRow(i: number): void { this.attendanceList.splice(i, 1); }

  onFilesSelected(ev: Event): void {
    const inp = ev.target as HTMLInputElement;
    this.performedFiles = inp.files ? Array.from(inp.files) : [];
  }

  // Submit: Accept/Reschedule (RF10, RF11)
  submitSchedule(): void {
    if (!this.selected) return;
    this.busy = true;
    const id   = this.selected.requestId;
    const obs  = this.activeModal === 'accept'
      ? this.reqSvc.acceptRequest(id, { ...this.scheduleForm })
      : this.reqSvc.rescheduleRequest(id, { ...this.scheduleForm });
    const label = this.activeModal === 'accept' ? 'aceptada y programada' : 'reprogramada';
    obs.subscribe({
      next: res => { this.busy = false; this.showSuccess(`Solicitud #${id} ${label}. ${res.message}`); this.closeModal(); this.load(); },
      error: err => { this.busy = false; this.errorMsg = err?.message; this.cdr.detectChanges(); }
    });
  }

  // Submit: Reject (RF10)
  submitReject(): void {
    if (!this.selected) return;
    this.busy = true;
    this.reqSvc.rejectRequest(this.selected.requestId, { reason: this.reasonText || undefined }).subscribe({
      next: res => { this.busy = false; this.showSuccess(`Solicitud rechazada. ${res.message}`); this.closeModal(); this.load(); },
      error: err => { this.busy = false; this.errorMsg = err?.message; this.cdr.detectChanges(); }
    });
  }

  // Submit: Cancel (RF15)
  submitCancel(): void {
    if (!this.selected) return;
    this.busy = true;
    const id = this.selected.scheduledId ?? this.selected.requestId;
    this.reqSvc.cancelRequest(id, { reason: this.reasonText || undefined }).subscribe({
      next: res => { this.busy = false; this.showSuccess(`Sesión cancelada. ${res.message}`); this.closeModal(); this.load(); },
      error: err => { this.busy = false; this.errorMsg = err?.message; this.cdr.detectChanges(); }
    });
  }

  // Submit: Virtual link (RF13)
  submitVirtualLink(): void {
    if (!this.selected) return;
    this.busy = true;
    const id = this.selected.scheduledId ?? this.selected.requestId;
    this.sessSvc.setVirtualLink(id, { url: this.virtualLinkUrl }).subscribe({
      next: res => { this.busy = false; this.showSuccess(`Enlace virtual registrado. ${res.message}`); this.closeModal(); },
      error: err => { this.busy = false; this.errorMsg = err?.message; this.cdr.detectChanges(); }
    });
  }

  // Submit: Attendance (RF16)
  submitAttendance(): void {
    if (!this.selected || !this.attendancePerformedId) return;
    this.busy = true;
    const id = this.selected.scheduledId ?? this.selected.requestId;
    this.sessSvc.registerAttendance(id, {
      performedId: this.attendancePerformedId,
      attendances: this.attendanceList,
    }).subscribe({
      next: res => { this.busy = false; this.showSuccess(`Asistencia registrada. ${res.message}`); this.closeModal(); },
      error: err => { this.busy = false; this.errorMsg = err?.message; this.cdr.detectChanges(); }
    });
  }

  // Submit: Performed (RF17)
  submitPerformed(): void {
    if (!this.selected) return;
    this.busy = true;
    const id = this.selected.scheduledId ?? this.selected.requestId;
    this.sessSvc.registerPerformed(id, this.performedObservation, this.performedDuration, this.performedFiles).subscribe({
      next: res => { this.busy = false; this.showSuccess(`Resultado registrado. ${res.message}`); this.closeModal(); this.load(); },
      error: err => { this.busy = false; this.errorMsg = err?.message; this.cdr.detectChanges(); }
    });
  }

  statusBadge(statusId: number): string { return STATUS_META[statusId]?.badge ?? 'bg-secondary'; }

  private showSuccess(msg: string): void {
    this.successMsg = msg;
    this.cdr.detectChanges();
    setTimeout(() => { this.successMsg = null; this.cdr.detectChanges(); }, 6000);
  }
}
