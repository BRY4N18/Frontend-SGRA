import { Component, OnInit, ChangeDetectorRef, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TeacherSessionsService } from '../../../services/teacher/teacher-sessions.service';
import { TeacherHistoryItemDTO } from '../../../models/teacher/teacher-request.model';

@Component({
  selector: 'app-teacher-history',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './teacher-history.component.html',
  styleUrl: './teacher-history.component.css'
})
export class TeacherHistoryComponent implements OnInit {
  private sessSvc = inject(TeacherSessionsService);
  private cdr     = inject(ChangeDetectorRef);

  loading  = false;
  errorMsg: string | null = null;

  rows: TeacherHistoryItemDTO[] = [];
  totalCount = 0;
  page       = 1;
  size       = 10;
  totalPages = 1;

  ngOnInit(): void { this.load(); }

  load(): void {
    this.loading  = true;
    this.errorMsg = null;
    this.sessSvc.getHistory(this.page, this.size).subscribe({
      next: d => {
        this.rows       = d.items ?? [];
        this.totalCount = d.totalCount;
        this.totalPages = d.totalPages ?? Math.max(1, Math.ceil(d.totalCount / this.size));
        this.page       = d.page;
        this.loading    = false;
        this.cdr.detectChanges();
      },
      error: err => {
        this.errorMsg = err?.message || 'Error al cargar el historial';
        this.loading  = false;
        this.cdr.detectChanges();
      }
    });
  }

  goTo(p: number): void { this.page = p; this.load(); }

  countByModality(modality: string): number {
    return this.rows.filter(r => r.modality === modality).length;
  }

  modalityBadge(modality: string): string {
    return modality === 'Virtual' ? 'bg-info text-white' : 'bg-secondary';
  }

  statusBadge(statusName: string): string {
    const map: Record<string, string> = {
      'Finalizada':  'bg-primary',
      'Cancelada':   'bg-danger',
      'Aceptada':    'bg-success',
      'Rechazada':   'bg-danger',
      'Pendiente':   'bg-warning text-dark',
    };
    return map[statusName] ?? 'bg-secondary';
  }
}
