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
  templateUrl: './student-history.component.html',
  styleUrl: './student-history.component.css'
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
