import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { forkJoin } from 'rxjs';
import { AuthService } from '../../../services/auth/auth.service';
import { TeacherClassScheduleService, TeacherAvailabilityService } from '../../../services/teacher';
import { ClassScheduleDetail } from '../../../models/teacher';
import { TeacherAvailabilityItem } from '../../../models/teacher';

interface DashboardCard {
  title: string;
  description: string;
  icon: string;
  route: string;
}

interface StatCard {
  label: string;
  value: number | string;
  icon: string;
  subtitle: string;
}

@Component({
  selector: 'app-teacher-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './teacher-dashboard.component.html',
  styleUrl: './teacher-dashboard.component.css',
})
export class TeacherDashboardComponent implements OnInit {
  public authService = inject(AuthService);
  private router = inject(Router);
  private scheduleSvc = inject(TeacherClassScheduleService);
  private availabilitySvc = inject(TeacherAvailabilityService);
  private cdr = inject(ChangeDetectorRef);

  loading = true;

  // Stats
  stats: StatCard[] = [];
  schedules: ClassScheduleDetail[] = [];
  availabilitySlots: TeacherAvailabilityItem[] = [];

  // Quick access cards
  readonly cards: DashboardCard[] = [
    {
      title: 'Disponibilidad Horaria',
      description: 'Gestiona tus bloques horarios disponibles para refuerzos.',
      icon: 'bi-calendar2-week',
      route: '/teacher/availability'
    },
    {
      title: 'Mi Horario de Clases',
      description: 'Consulta tu horario asignado del periodo actual.',
      icon: 'bi-table',
      route: '/teacher/availability'
    },
    {
      title: 'Solicitudes de Refuerzo',
      description: 'Revisa y responde solicitudes de estudiantes.',
      icon: 'bi-inbox',
      route: '/teacher/requests'
    }
  ];

  ngOnInit(): void {
    this.loadDashboardData();
  }

  private loadDashboardData(): void {
    const userId = this.authService.currentUser()?.userId;
    if (!userId) {
      this.loading = false;
      return;
    }

    forkJoin({
      schedules: this.scheduleSvc.getSchedulesByTeacherId(userId),
      availability: this.availabilitySvc.getAvailabilityByUser(userId)
    }).subscribe({
      next: ({ schedules, availability }) => {
        this.schedules = schedules;
        this.availabilitySlots = availability;
        this.buildStats();
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.stats = this.defaultStats();
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

  private buildStats(): void {
    const active = this.schedules.filter(s => s.active);
    const subjects = new Set(active.map(s => s.subjectName));
    const period = active[0]?.period ?? '—';

    // Count unique days with classes
    const classDays = new Set(active.map(s => s.day));

    this.stats = [
      {
        label: 'Clases Asignadas',
        value: active.length,
        icon: 'bi-easel',
        subtitle: `en ${classDays.size} día(s) de la semana`
      },
      {
        label: 'Materias Activas',
        value: subjects.size,
        icon: 'bi-journals',
        subtitle: Array.from(subjects).slice(0, 2).join(', ') || '—'
      },
      {
        label: 'Bloques Disponibles',
        value: this.availabilitySlots.length,
        icon: 'bi-calendar2-check',
        subtitle: 'bloques horarios registrados'
      },
      {
        label: 'Periodo Académico',
        value: period,
        icon: 'bi-mortarboard',
        subtitle: active[0] ? `${active[0].periodStartDate} — ${active[0].periodEndDate}` : '—'
      }
    ];
  }

  private defaultStats(): StatCard[] {
    return [
      { label: 'Clases Asignadas', value: 0, icon: 'bi-easel', subtitle: 'Sin datos' },
      { label: 'Materias Activas', value: 0, icon: 'bi-journals', subtitle: '—' },
      { label: 'Bloques Disponibles', value: 0, icon: 'bi-calendar2-check', subtitle: '—' },
      { label: 'Periodo Académico', value: '—', icon: 'bi-mortarboard', subtitle: '—' }
    ];
  }

  navigateTo(route: string): void {
    this.router.navigate([route]);
  }
}
