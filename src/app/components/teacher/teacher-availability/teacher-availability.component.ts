import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TeacherClassScheduleService } from '../../../services/teacher';
import { AuthService } from '../../../services/auth/auth.service';
import {
  DayOfWeek,
  TimeBlock,
  SlotStatus,
  ScheduleSection,
  SectionInfo
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
    { key: 'matutina',   label: 'Matutina',   icon: 'bi-sunrise',    range: '7:30 - 12:30',  colorClass: 'section-matutina' },
    { key: 'vespertina', label: 'Vespertina', icon: 'bi-sun',        range: '12:30 - 17:30', colorClass: 'section-vespertina' },
    { key: 'nocturna',   label: 'Nocturna',   icon: 'bi-moon-stars', range: '19:00 - 00:00', colorClass: 'section-nocturna' },
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

  private readonly defaultTimeBlocks: TimeBlock[] = [
    // Matutina: 7:30 - 12:30
    { timeBlockId: 1,  startTime: '07:30', endTime: '08:30', section: 'matutina' },
    { timeBlockId: 2,  startTime: '08:30', endTime: '09:30', section: 'matutina' },
    { timeBlockId: 3,  startTime: '09:30', endTime: '10:30', section: 'matutina' },
    { timeBlockId: 4,  startTime: '10:30', endTime: '11:30', section: 'matutina' },
    { timeBlockId: 5,  startTime: '11:30', endTime: '12:30', section: 'matutina' },
    // Vespertina: 12:30 - 17:30
    { timeBlockId: 6,  startTime: '12:30', endTime: '13:30', section: 'vespertina' },
    { timeBlockId: 7,  startTime: '13:30', endTime: '14:30', section: 'vespertina' },
    { timeBlockId: 8,  startTime: '14:30', endTime: '15:30', section: 'vespertina' },
    { timeBlockId: 9,  startTime: '15:30', endTime: '16:30', section: 'vespertina' },
    { timeBlockId: 10, startTime: '16:30', endTime: '17:30', section: 'vespertina' },
    // Nocturna: 19:00 - 00:00
    { timeBlockId: 11, startTime: '19:00', endTime: '20:00', section: 'nocturna' },
    { timeBlockId: 12, startTime: '20:00', endTime: '21:00', section: 'nocturna' },
    { timeBlockId: 13, startTime: '21:00', endTime: '22:00', section: 'nocturna' },
    { timeBlockId: 14, startTime: '22:00', endTime: '23:00', section: 'nocturna' },
    { timeBlockId: 15, startTime: '23:00', endTime: '00:00', section: 'nocturna' },
  ];

  /** Day name mapping */
  private readonly dayNames: Record<number, string> = {
    1: 'Lunes', 2: 'Martes', 3: 'Miércoles',
    4: 'Jueves', 5: 'Viernes', 6: 'Sábado', 7: 'Domingo'
  };

  ngOnInit(): void {
    this.initGrid();
    this.loadClassSchedules();
  }

  /** Get the day name from its number */
  getDayName(day: number): string {
    return this.dayNames[day] ?? `Día ${day}`;
  }

  /** Initialize the grid with default days and time blocks */
  private initGrid(): void {
    this.days = [...this.defaultDays];
    this.timeBlocks = [...this.defaultTimeBlocks];
    this.grid.clear();

    for (const day of this.days) {
      for (const block of this.timeBlocks) {
        this.grid.set(this.key(day.dayId, block.timeBlockId), 'empty');
      }
    }
  }

  /** Load class schedules for the current teacher */
  loadClassSchedules(): void {
    const userId = this.authService.currentUser()?.userId;
    if (!userId) {
      this.loading = false;
      return;
    }

    this.loading = true;
    this.errorMessage = null;

    this.scheduleSvc.getSchedulesByTeacherId(userId).subscribe({
      next: (data) => {
        console.log(data);
        this.classSchedules = data;
        this.applySchedulesToGrid();
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.errorMessage = err.message;
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

  /** Normalize time string to HH:mm for comparison */
  private normalizeTime(time: string): string {
    if (!time) return '';
    // Handle "07:30:00" -> "07:30" and "7:30" -> "07:30"
    const parts = time.split(':');
    const hh = parts[0]?.padStart(2, '0') ?? '00';
    const mm = parts[1]?.padStart(2, '0') ?? '00';
    return `${hh}:${mm}`;
  }

  /** Map class schedules onto the availability grid */
  private applySchedulesToGrid(): void {
    this.scheduleInfo.clear();

    for (const schedule of this.classSchedules) {
      if (!schedule.active) continue;

      const scheduleStart = this.normalizeTime(schedule.startTime);

      // Find matching time block by comparing normalized start time
      const matchingBlock = this.timeBlocks.find(
        b => this.normalizeTime(b.startTime) === scheduleStart
      );

      if (matchingBlock) {
        const k = this.key(schedule.day, matchingBlock.timeBlockId);
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

  /** Reload grid: reset and re-fetch schedules */
  reloadGrid(): void {
    this.initGrid();
    this.loadClassSchedules();
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

  /** Save availability (placeholder — implement when save API is available) */
  onSave(): void {
    this.saving = true;
    this.errorMessage = null;
    this.successMessage = null;

    const slots: { dayId: number; timeBlockId: number }[] = [];
    this.grid.forEach((status, k) => {
      if (status === 'available') {
        const [dayId, timeBlockId] = k.split('-').map(Number);
        slots.push({ dayId, timeBlockId });
      }
    });

    // TODO: Call save API when available
    console.log('[TeacherAvailability] Slots to save:', slots);
    this.saving = false;
    this.successMessage = `Se seleccionaron ${slots.length} bloques de disponibilidad.`;
    this.cdr.detectChanges();

    setTimeout(() => {
      this.successMessage = null;
      this.cdr.detectChanges();
    }, 5000);
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
