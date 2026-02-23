import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { forkJoin } from 'rxjs';
import { TeacherClassScheduleService, TeacherAvailabilityService } from '../../../services/teacher';
import { AuthService } from '../../../services/auth/auth.service';
import {
  DayOfWeek,
  TimeBlock,
  SlotStatus,
  ScheduleSection,
  SectionInfo,
  TeacherAvailabilityItem,
  TimeSlotDTO
} from '../../../models/teacher';
import { ClassScheduleDetail } from '../../../models/teacher';

@Component({
  selector: 'app-teacher-availability',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './teacher-availability.component.html',
  styleUrl: './teacher-availability.component.css',
})
export class TeacherAvailabilityComponent implements OnInit {
  private scheduleSvc = inject(TeacherClassScheduleService);
  private availabilitySvc = inject(TeacherAvailabilityService);
  private authService = inject(AuthService);
  private cdr = inject(ChangeDetectorRef);

  // State
  loading = true;
  saving = false;
  errorMessage: string | null = null;
  successMessage: string | null = null;

  // Class schedules
  classSchedules: ClassScheduleDetail[] = [];
  loadingSchedules = false;
  scheduleError: string | null = null;

  // Schedule info per grid cell: key = "dayId-timeBlockId" => ClassScheduleDetail
  scheduleInfo = new Map<string, ClassScheduleDetail>();

  // Data
  days: DayOfWeek[] = [];
  timeBlocks: TimeBlock[] = [];

  // Grid state: key = "dayId-timeBlockId" => SlotStatus
  grid = new Map<string, SlotStatus>();

  // Quick selection
  selectedDayFilter: number | null = null;
  selectedBlockFilter: number | null = null;

  // Active section tab
  activeSection: ScheduleSection = 'matutina';

  /** Section definitions */
  readonly sections: SectionInfo[] = [
    { key: 'matutina', label: 'Matutina', icon: 'bi-sunrise', range: '7:30 - 12:30', colorClass: 'section-matutina' },
    { key: 'vespertina', label: 'Vespertina', icon: 'bi-sun', range: '12:30 - 17:30', colorClass: 'section-vespertina' },
    { key: 'nocturna', label: 'Nocturna', icon: 'bi-moon-stars', range: '19:00 - 00:00', colorClass: 'section-nocturna' },
  ];

  /** Default data when API is not connected */
  private readonly defaultDays: DayOfWeek[] = [
    { dayId: 1, dayName: 'Lunes', dayFullName: 'Lun' },
    { dayId: 2, dayName: 'Martes', dayFullName: 'Mar' },
    { dayId: 3, dayName: 'Miercoles', dayFullName: 'Mie' },
    { dayId: 4, dayName: 'Jueves', dayFullName: 'Jue' },
    { dayId: 5, dayName: 'Viernes', dayFullName: 'Vie' },
    { dayId: 6, dayName: 'Sabado', dayFullName: 'Sab' },
    { dayId: 7, dayName: 'Domingo', dayFullName: 'Dom' }
  ];

  // Time blocks are loaded from the API (no longer hardcoded)

  /** Day name mapping */
  private readonly dayNames: Record<number, string> = {
    1: 'Lunes', 2: 'Martes', 3: 'Miércoles',
    4: 'Jueves', 5: 'Viernes', 6: 'Sábado', 7: 'Domingo'
  };

  ngOnInit(): void {
    this.initGrid();
    this.loadData();
  }

  /** Get the day name from its number */
  getDayName(day: number): string {
    return this.dayNames[day] ?? `Día ${day}`;
  }

  /** Initialize the grid with days (time blocks loaded from API) */
  private initGrid(): void {
    this.days = [...this.defaultDays];
    this.grid.clear();
  }

  /** Build the grid once time blocks are loaded */
  private buildGrid(): void {
    this.grid.clear();
    for (const day of this.days) {
      for (const block of this.timeBlocks) {
        this.grid.set(this.key(day.dayId, block.timeBlockId), 'empty');
      }
    }
  }

  /** Map API TimeSlotDTO[] → TimeBlock[] with auto-detected section */
  private mapTimeSlots(slots: TimeSlotDTO[]): TimeBlock[] {
    return slots.map(s => {
      const start = this.normalizeTime(s.startTime);
      return {
        timeBlockId: s.timeSlotId,
        startTime: start,
        endTime: this.normalizeTime(s.endTime),
        section: this.detectSection(start)
      } as TimeBlock;
    });
  }

  /** Detect section from a HH:mm start time */
  private detectSection(startTime: string): ScheduleSection {
    const mins = this.timeToMinutes(startTime);
    if (mins < this.timeToMinutes('12:30')) return 'matutina';
    if (mins < this.timeToMinutes('17:30')) return 'vespertina';
    return 'nocturna';
  }

  /** Normalize time to HH:mm (strip seconds if present) */
  private normalizeTime(t: string): string {
    if (!t) return '';
    const parts = t.split(':');
    return `${parts[0].padStart(2, '0')}:${parts[1]}`;
  }

  /** Load time slots, then schedules + availability in parallel */
  private loadData(): void {
    const userId = this.authService.currentUser()?.userId;
    if (!userId) {
      this.loading = false;
      return;
    }

    this.loading = true;
    this.errorMessage = null;

    // Step 1: Load time slots from API
    this.availabilitySvc.getTimeSlots().subscribe({
      next: (slotsDTO) => {
        this.timeBlocks = this.mapTimeSlots(slotsDTO);
        this.buildGrid();

        // Step 2: Load schedules + saved availability in parallel
        forkJoin({
          schedules: this.scheduleSvc.getSchedulesByTeacherId(userId),
          availability: this.availabilitySvc.getAvailabilityByUser(userId)
        }).subscribe({
          next: ({ schedules, availability }) => {
            this.classSchedules = schedules;
            this.applySchedulesToGrid();
            this.applyAvailabilityToGrid(availability);
            this.loading = false;
            this.cdr.detectChanges();
          },
          error: (err) => {
            this.errorMessage = err.message;
            this.loading = false;
            this.cdr.detectChanges();
          }
        });
      },
      error: (err) => {
        this.errorMessage = 'Error al cargar los bloques horarios: ' + err.message;
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

  /** Apply saved availability slots to the grid */
  private applyAvailabilityToGrid(items: TeacherAvailabilityItem[]): void {
    for (const item of items) {
      const k = this.key(item.dayOfWeek, item.timeSlotId);
      // Only mark as available if the cell is not already scheduled
      if (this.grid.has(k) && this.grid.get(k) !== 'scheduled') {
        this.grid.set(k, 'available');
      }
    }
  }



  /** Convert "HH:mm" to total minutes for range comparison */
  private timeToMinutes(time: string): number {
    const normalized = this.normalizeTime(time);
    const [hh, mm] = normalized.split(':').map(Number);
    // Handle midnight (00:00) as 1440 so it's treated as end-of-day
    return hh === 0 && mm === 0 ? 1440 : hh * 60 + mm;
  }

  /** Map class schedules onto the availability grid */
  private applySchedulesToGrid(): void {
    this.scheduleInfo.clear();

    for (const schedule of this.classSchedules) {
      if (!schedule.active) continue;

      const schedStart = this.timeToMinutes(schedule.startTime);
      const schedEnd = this.timeToMinutes(schedule.endTime);

      // Find ALL time blocks whose startTime falls within [schedStart, schedEnd)
      const matchingBlocks = this.timeBlocks.filter(b => {
        const blockStart = this.timeToMinutes(b.startTime);
        return blockStart >= schedStart && blockStart < schedEnd;
      });

      for (const block of matchingBlocks) {
        const k = this.key(schedule.day, block.timeBlockId);
        this.grid.set(k, 'scheduled');
        this.scheduleInfo.set(k, schedule);
      }
    }
  }

  /** Get the schedule detail for a cell (if any) */
  getScheduleInfo(dayId: number, timeBlockId: number): ClassScheduleDetail | undefined {
    return this.scheduleInfo.get(this.key(dayId, timeBlockId));
  }

  /** Get tooltip text for a scheduled cell */
  getScheduleTooltip(dayId: number, timeBlockId: number): string {
    const info = this.getScheduleInfo(dayId, timeBlockId);
    if (!info) return '';
    return `${info.subjectName} — ${info.section} (Sem. ${info.semester})`;
  }

  /** Reload grid: reset and re-fetch data */
  reloadGrid(): void {
    this.initGrid();
    this.loadData();
  }

  /** Build a map key from dayId + timeBlockId */
  key(dayId: number, timeBlockId: number): string {
    return `${dayId}-${timeBlockId}`;
  }

  /** Get the status for a given cell */
  getStatus(dayId: number, timeBlockId: number): SlotStatus {
    return this.grid.get(this.key(dayId, timeBlockId)) || 'empty';
  }

  /** Toggle a single cell */
  toggleSlot(dayId: number, timeBlockId: number): void {
    const k = this.key(dayId, timeBlockId);
    const current = this.grid.get(k) || 'empty';

    // Don't allow toggling conflict or scheduled slots
    if (current === 'conflict' || current === 'scheduled') return;

    this.grid.set(k, current === 'available' ? 'empty' : 'available');
  }

  /** Count available slots for a given day */
  countSlots(dayId: number): number {
    let count = 0;
    for (const block of this.timeBlocks) {
      if (this.getStatus(dayId, block.timeBlockId) === 'available') count++;
    }
    return count;
  }

  /** Toggle all slots for a day (quick day selection) */
  toggleDay(dayId: number): void {
    this.selectedDayFilter = this.selectedDayFilter === dayId ? null : dayId;
    const allAvailable = this.timeBlocks.every(
      b => this.getStatus(dayId, b.timeBlockId) === 'available' ||
        this.getStatus(dayId, b.timeBlockId) === 'conflict' ||
        this.getStatus(dayId, b.timeBlockId) === 'scheduled'
    );

    for (const block of this.timeBlocks) {
      const k = this.key(dayId, block.timeBlockId);
      if (this.grid.get(k) === 'conflict' || this.grid.get(k) === 'scheduled') continue;
      this.grid.set(k, allAvailable ? 'empty' : 'available');
    }
  }

  /** Toggle all slots for a time block across all days */
  toggleBlock(timeBlockId: number): void {
    this.selectedBlockFilter = timeBlockId;
    const allAvailable = this.days.every(
      d => this.getStatus(d.dayId, timeBlockId) === 'available' ||
        this.getStatus(d.dayId, timeBlockId) === 'conflict' ||
        this.getStatus(d.dayId, timeBlockId) === 'scheduled'
    );

    for (const day of this.days) {
      const k = this.key(day.dayId, timeBlockId);
      if (this.grid.get(k) === 'conflict' || this.grid.get(k) === 'scheduled') continue;
      this.grid.set(k, allAvailable ? 'empty' : 'available');
    }
  }

  /** Check if a day button is active */
  isDayActive(dayId: number): boolean {
    return this.selectedDayFilter === dayId;
  }

  /** Get time blocks for the active section */
  get filteredTimeBlocks(): TimeBlock[] {
    return this.timeBlocks.filter(b => b.section === this.activeSection);
  }

  /** Count available slots for a day within a specific section */
  countSlotsInSection(dayId: number, section: ScheduleSection): number {
    let count = 0;
    for (const block of this.timeBlocks.filter(b => b.section === section)) {
      if (this.getStatus(dayId, block.timeBlockId) === 'available') count++;
    }
    return count;
  }

  /** Count total available slots for a section across all days */
  countTotalSectionSlots(section: ScheduleSection): number {
    let count = 0;
    for (const day of this.days) {
      count += this.countSlotsInSection(day.dayId, section);
    }
    return count;
  }

  /** Set the active section tab */
  setActiveSection(section: ScheduleSection): void {
    this.activeSection = section;
  }

  /** Save availability via batch API */
  onSave(): void {
    const userId = this.authService.currentUser()?.userId;
    if (!userId) {
      this.errorMessage = 'No se pudo identificar al usuario. Inicia sesión nuevamente.';
      return;
    }

    // Get periodId from loaded class schedules (first active schedule)
    const periodId = this.classSchedules.find(s => s.active)?.periodId;
    if (!periodId) {
      this.errorMessage = 'No se encontró un periodo académico activo.';
      return;
    }

    this.saving = true;
    this.errorMessage = null;
    this.successMessage = null;

    // Collect all 'available' slots from the grid
    const slots: { dayOfWeek: number; timeSlotId: number }[] = [];
    this.grid.forEach((status, k) => {
      if (status === 'available') {
        const [dayOfWeek, timeSlotId] = k.split('-').map(Number);
        slots.push({ dayOfWeek, timeSlotId });
      }
    });

    console.log(slots);

    this.availabilitySvc.saveAvailability({ userId: userId, periodId, slots }).subscribe({
      next: (res) => {
        this.saving = false;
        this.successMessage = res.message || `Se guardaron ${slots.length} bloques de disponibilidad.`;
        this.cdr.detectChanges();

        setTimeout(() => {
          this.successMessage = null;
          this.cdr.detectChanges();
        }, 5000);
      },
      error: (err) => {
        this.saving = false;
        this.errorMessage = err.message;
        this.cdr.detectChanges();
      }
    });
  }

  /** Clear all selections */
  clearAll(): void {
    this.grid.forEach((status, k) => {
      if (status !== 'conflict' && status !== 'scheduled') {
        this.grid.set(k, 'empty');
      }
    });
    this.selectedDayFilter = null;
    this.selectedBlockFilter = null;
  }
}
