import { Component, AfterViewInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { StudentNewRequestService } from '../../../services/student/student-new-request.service';
import {
  SubjectItem,
  SyllabusItem,
  TeacherItem,
  ModalityItem,
  SessionTypeItem,
  TimeSlotItem,
  AvailableTimeSlotItem,
  ClassmateItem
} from '../../../models/student/catalog.model';
import { CreateRequestPayload } from '../../../models/student/request.model';

@Component({
  selector: 'app-student-new-request',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="container-fluid">
      <!-- Header -->
      <div class="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h3 class="mb-1">Nueva Solicitud</h3>
          <p class="text-muted mb-0">Crea una nueva solicitud de refuerzo académico</p>
        </div>
      </div>

      <!-- Error Alert -->
      @if (errorMessage) {
        <div class="alert alert-danger alert-dismissible fade show" role="alert">
          <i class="bi bi-exclamation-triangle-fill me-2"></i>
          {{ errorMessage }}
          <button type="button" class="btn-close" (click)="errorMessage = null"></button>
        </div>
      }

      <!-- Success Alert -->
      @if (successMessage) {
        <div class="alert alert-success alert-dismissible fade show" role="alert">
          <i class="bi bi-check-circle-fill me-2"></i>
          {{ successMessage }}
          <button type="button" class="btn-close" (click)="successMessage = null"></button>
        </div>
      }

      <!-- Form Card -->
      <div class="card border-0 shadow-sm">
        <div class="card-body p-4">
          <form (ngSubmit)="onSubmit()" #requestForm="ngForm">

            <!-- Row 1: Asignatura y Tipo de Sesión -->
            <div class="row g-3 mb-3">
              <div class="col-md-6">
                <label class="form-label fw-semibold">Asignatura <span class="text-danger">*</span></label>
                <select class="form-select" [(ngModel)]="form.subjectId" name="subjectId"
                        (change)="onSubjectChange()" required [disabled]="loadingCatalogs">
                  <option [ngValue]="null">Selecciona una asignatura</option>
                  @for (s of subjects; track s.subjectId) {
                    <option [ngValue]="s.subjectId">{{ s.subjectName }} (Semestre {{ s.semester }})</option>
                  }
                </select>
              </div>

              <div class="col-md-6">
                <label class="form-label fw-semibold">Tipo de Sesión <span class="text-danger">*</span></label>
                <select class="form-select" [(ngModel)]="form.sessionTypeId" name="sessionTypeId"
                        (ngModelChange)="onSessionTypeChange()" required [disabled]="loadingCatalogs">
                  <option [ngValue]="null">Selecciona tipo de sesión</option>
                  @for (st of sessionTypes; track st.sessionTypeId) {
                    <option [ngValue]="st.sessionTypeId">{{ st.sessionTypeName }}</option>
                  }
                </select>
              </div>
            </div>

            <!-- Compañeros seleccionados (visible solo en Grupal) -->
            @if (isGroupSession() && selectedClassmates.length > 0) {
              <div class="alert alert-info d-flex align-items-center justify-content-between mb-3">
                <div>
                  <i class="bi bi-people-fill me-2"></i>
                  <strong>{{ selectedClassmates.length }}</strong> compañero{{ selectedClassmates.length > 1 ? 's' : '' }} seleccionado{{ selectedClassmates.length > 1 ? 's' : '' }}
                  <span class="text-muted ms-2">
                    ({{ getSelectedNames() }})
                  </span>
                </div>
                <button type="button" class="btn btn-sm btn-outline-primary" (click)="openClassmatesModal()">
                  <i class="bi bi-pencil me-1"></i>Editar
                </button>
              </div>
            }

            <!-- Row 2: Docente y Motivo -->
            <div class="row g-3 mb-3">
              <div class="col-md-6">
                <label class="form-label fw-semibold">Docente <span class="text-danger">*</span></label>
                <select class="form-select" [(ngModel)]="form.teacherId" name="teacherId"
                        (ngModelChange)="onTeacherOrDayChange()" required [disabled]="loadingTeachers">
                  <option [ngValue]="null">{{ loadingTeachers ? 'Cargando...' : 'Selecciona docente' }}</option>
                  @for (t of teachers; track t.teacherId) {
                    <option [ngValue]="t.teacherId">{{ t.fullName }}</option>
                  }
                </select>
              </div>

              <div class="col-md-6">
                <label class="form-label fw-semibold">Motivo <span class="text-danger">*</span></label>
                <textarea class="form-control" [(ngModel)]="form.reason" name="reason"
                          rows="2" required minlength="10" maxlength="500"
                          placeholder="Describe brevemente el motivo de tu solicitud..."></textarea>
                <small class="text-muted">Mínimo 10 caracteres</small>
              </div>
            </div>

            <!-- Row 3: URL de archivo (opcional) -->
            <div class="row g-3 mb-4">
              <div class="col-12">
                <label class="form-label fw-semibold">URL de Archivo (opcional)</label>
                <input type="url" class="form-control" [(ngModel)]="form.fileUrl" name="fileUrl"
                       placeholder="https://ejemplo.com/archivo.pdf">
                <small class="text-muted">Si tienes material de apoyo, puedes compartir el enlace</small>
              </div>
            </div>

            <!-- === Campos ocultos (necesarios para el backend, auto-asignados) === -->
            <div class="d-none">
              <!-- Tema/Temario (auto-seleccionado al cambiar asignatura) -->
              <select [(ngModel)]="form.syllabusId" name="syllabusId">
                <option [ngValue]="null"></option>
                @for (sy of syllabi; track sy.syllabusId) {
                  <option [ngValue]="sy.syllabusId">{{ sy.syllabusName }}</option>
                }
              </select>

              <!-- Modalidad (auto-seleccionada al cargar catálogos) -->
              <select [(ngModel)]="form.modalityId" name="modalityId">
                <option [ngValue]="null"></option>
                @for (m of modalities; track m.modalityId) {
                  <option [ngValue]="m.modalityId">{{ m.modalityName }}</option>
                }
              </select>

              <!-- Día Solicitado (auto-calculado) -->
              <select [(ngModel)]="form.requestedDay" name="requestedDay">
                <option [ngValue]="null"></option>
                <option [ngValue]="1">Lunes</option>
                <option [ngValue]="2">Martes</option>
                <option [ngValue]="3">Miércoles</option>
                <option [ngValue]="4">Jueves</option>
                <option [ngValue]="5">Viernes</option>
                <option [ngValue]="6">Sábado</option>
              </select>

              <!-- Franja Horaria (auto-seleccionada) -->
              <select [(ngModel)]="form.timeSlotId" name="timeSlotId">
                <option [ngValue]="null"></option>
                @for (ts of availableTimeSlots; track ts.timeSlotId) {
                  <option [ngValue]="ts.timeSlotId">{{ ts.label }}</option>
                }
              </select>
            </div>

            <!-- Buttons -->
            <div class="d-flex justify-content-end gap-2">
              <button type="button" class="btn btn-outline-secondary" (click)="goBack()" [disabled]="submitting">
                Cancelar
              </button>
              <button type="submit" class="btn btn-success" [disabled]="!isFormValid() || submitting">
                @if (submitting) {
                  <span class="spinner-border spinner-border-sm me-2" role="status"></span>
                  Creando...
                } @else {
                  <i class="bi bi-check-lg me-2"></i>
                  Crear Solicitud
                }
              </button>
            </div>

          </form>
        </div>
      </div>

      <!-- ====== Modal Compañeros (Sesión Grupal) ====== -->
      @if (showClassmatesModal) {
        <div class="modal fade show d-block" tabindex="-1" style="background: rgba(0,0,0,0.5); z-index: 1050;">
          <div class="modal-dialog modal-dialog-centered modal-dialog-scrollable modal-lg">
            <div class="modal-content">
              <div class="modal-header">
                <h5 class="modal-title">
                  <i class="bi bi-people-fill me-2"></i>Seleccionar Compañeros
                </h5>
                <button type="button" class="btn-close" (click)="closeClassmatesModal()"></button>
              </div>

              <div class="modal-body">
                @if (loadingClassmates) {
                  <div class="text-center py-4">
                    <span class="spinner-border text-primary" role="status"></span>
                    <p class="text-muted mt-2">Cargando compañeros...</p>
                  </div>
                } @else if (classmates.length === 0) {
                  <div class="text-center py-4">
                    <i class="bi bi-person-x fs-1 text-muted"></i>
                    <p class="text-muted mt-2">No se encontraron compañeros matriculados en esta asignatura.</p>
                  </div>
                } @else {
                  <!-- Buscador y botón seleccionar todos -->
                  <div class="d-flex justify-content-between align-items-center mb-3">
                    <div class="input-group" style="max-width: 300px;">
                      <span class="input-group-text"><i class="bi bi-search"></i></span>
                      <input type="text" class="form-control" placeholder="Buscar compañero..."
                             [(ngModel)]="classmateSearch" [ngModelOptions]="{standalone: true}">
                    </div>
                    <div class="d-flex gap-2">
                      <button type="button" class="btn btn-sm btn-outline-primary"
                              (click)="selectAllClassmates()">
                        <i class="bi bi-check-all me-1"></i>Seleccionar Todos
                      </button>
                      <button type="button" class="btn btn-sm btn-outline-secondary"
                              (click)="deselectAllClassmates()"
                              [disabled]="tempSelectedIds.size === 0">
                        <i class="bi bi-x-lg me-1"></i>Quitar Todos
                      </button>
                    </div>
                  </div>

                  <!-- Info de selección -->
                  <div class="mb-3">
                    <small class="text-muted">
                      {{ tempSelectedIds.size }} de {{ filteredClassmates().length }} seleccionado(s)
                    </small>
                  </div>

                  <!-- Lista de compañeros -->
                  <div class="list-group" style="max-height: 350px; overflow-y: auto;">
                    @for (c of filteredClassmates(); track c.studentId) {
                      <label class="list-group-item list-group-item-action d-flex align-items-center gap-3"
                             [class.active]="tempSelectedIds.has(c.studentId)"
                             style="cursor: pointer;">
                        <input type="checkbox" class="form-check-input m-0"
                               [checked]="tempSelectedIds.has(c.studentId)"
                               (change)="toggleClassmate(c.studentId)">
                        <div class="flex-grow-1">
                          <div class="fw-semibold" [class.text-white]="tempSelectedIds.has(c.studentId)">
                            {{ c.fullName }}
                          </div>
                          <small [class.text-white-50]="tempSelectedIds.has(c.studentId)"
                                 [class.text-muted]="!tempSelectedIds.has(c.studentId)">
                            {{ c.email }}
                          </small>
                        </div>
                        @if (tempSelectedIds.has(c.studentId)) {
                          <i class="bi bi-check-circle-fill text-white"></i>
                        }
                      </label>
                    }
                  </div>
                }
              </div>

              <div class="modal-footer">
                <button type="button" class="btn btn-secondary" (click)="closeClassmatesModal()">
                  Cancelar
                </button>
                <button type="button" class="btn btn-primary" (click)="confirmClassmatesSelection()"
                        [disabled]="loadingClassmates">
                  <i class="bi bi-check-lg me-1"></i>
                  Confirmar ({{ tempSelectedIds.size }})
                </button>
              </div>
            </div>
          </div>
        </div>
      }

    </div>
  `
})
export class StudentNewRequestComponent implements AfterViewInit {
  private svc = inject(StudentNewRequestService);
  private router = inject(Router);
  private cdr = inject(ChangeDetectorRef);

  // Catalogs
  subjects: SubjectItem[] = [];
  syllabi: SyllabusItem[] = [];
  teachers: TeacherItem[] = [];
  modalities: ModalityItem[] = [];
  sessionTypes: SessionTypeItem[] = [];
  timeSlots: TimeSlotItem[] = [];
  availableTimeSlots: AvailableTimeSlotItem[] = [];

  // Classmates (sesión grupal)
  classmates: ClassmateItem[] = [];
  selectedClassmates: ClassmateItem[] = [];
  selectedClassmateIds: Set<number> = new Set();
  tempSelectedIds: Set<number> = new Set();  // IDs temporales en el modal
  showClassmatesModal = false;
  loadingClassmates = false;
  classmateSearch = '';

  // Loading states
  loadingCatalogs = false;
  loadingSyllabi = false;
  loadingTeachers = false;
  loadingTimeSlots = false;
  submitting = false;

  // Messages
  errorMessage: string | null = null;
  successMessage: string | null = null;
  noTimeSlotsMessage: string | null = null;

  // Form model
  form: {
    subjectId: number | null;
    syllabusId: number | null;
    teacherId: number | null;
    modalityId: number | null;
    sessionTypeId: number | null;
    timeSlotId: number | null;
    requestedDay: number | null;
    reason: string;
    fileUrl: string;
    periodId: number;
  } = {
    subjectId: null,
    syllabusId: null,
    teacherId: null,
    modalityId: null,
    sessionTypeId: null,
    timeSlotId: null,
    requestedDay: null,
    reason: '',
    fileUrl: '',
    periodId: 1
  };

  ngAfterViewInit(): void {
    Promise.resolve().then(() => {
      this.loadCatalogs();
    });
  }

  loadCatalogs(): void {
    this.loadingCatalogs = true;
    this.errorMessage = null;

    Promise.all([
      this.svc.getSubjects().toPromise(),
      this.svc.getModalities().toPromise(),
      this.svc.getSessionTypes().toPromise(),
      this.svc.getTimeSlots().toPromise(),
      this.svc.getTeachers().toPromise()
    ]).then(([subjects, modalities, sessionTypes, timeSlots, teachers]) => {
      this.subjects = subjects || [];
      this.modalities = modalities || [];
      this.sessionTypes = sessionTypes || [];
      this.timeSlots = timeSlots || [];
      this.teachers = teachers || [];
      this.loadingCatalogs = false;

      if (this.modalities.length > 0 && !this.form.modalityId) {
        this.form.modalityId = this.modalities[0].modalityId;
      }

      if (!this.form.requestedDay) {
        const jsDay = new Date().getDay();
        this.form.requestedDay = jsDay === 0 ? 1 : jsDay;
      }


      if (this.form.modalityId) {
        this.onModalityChange();
      }

      this.cdr.detectChanges();
    }).catch(err => {
      this.errorMessage = err?.message || 'Error al cargar los catálogos';
      this.loadingCatalogs = false;
      this.cdr.detectChanges();
    });
  }

  onSubjectChange(): void {
    this.form.syllabusId = null;
    this.syllabi = [];

    // Limpiar compañeros al cambiar asignatura
    this.classmates = [];
    this.selectedClassmates = [];
    this.selectedClassmateIds.clear();

    if (this.form.subjectId) {
      this.loadingSyllabi = true;
      this.svc.getSyllabiBySubject(this.form.subjectId).subscribe({
        next: (data) => {
          this.syllabi = data || [];
          this.loadingSyllabi = false;
          if (this.syllabi.length > 0) {
            this.form.syllabusId = this.syllabi[0].syllabusId;
          }
          this.cdr.detectChanges();
        },
        error: (err) => {
          this.errorMessage = err?.message || 'Error al cargar los temas';
          this.loadingSyllabi = false;
          this.cdr.detectChanges();
        }
      });

      // Si ya está en sesión grupal, abrir el modal automáticamente
      if (this.isGroupSession()) {
        this.openClassmatesModal();
      }
    }
  }

  onModalityChange(): void {
    if (this.form.modalityId) {
      this.loadingTeachers = true;
      this.form.teacherId = null;
      this.form.timeSlotId = null;
      this.availableTimeSlots = [];
      this.noTimeSlotsMessage = null;

      this.svc.getTeachers(this.form.modalityId).subscribe({
        next: (data) => {
          this.teachers = data || [];
          this.loadingTeachers = false;
          this.cdr.detectChanges();
        },
        error: (err) => {
          this.errorMessage = err?.message || 'Error al cargar los docentes';
          this.loadingTeachers = false;
          this.cdr.detectChanges();
        }
      });
    }
  }

  // ==================== SESIÓN GRUPAL / COMPAÑEROS ====================

  /**
   * Verifica si el tipo de sesión seleccionado es "Grupal" (sessionTypeId === 2)
   */
  isGroupSession(): boolean {
    return this.form.sessionTypeId === 2;
  }

  /**
   * Handler cuando cambia el tipo de sesión.
   * Si es Grupal y hay asignatura seleccionada, abre el modal de compañeros.
   */
  onSessionTypeChange(): void {
    if (this.isGroupSession() && this.form.subjectId) {
      this.openClassmatesModal();
    } else if (!this.isGroupSession()) {
      // Si cambia a Individual, limpiar la selección de compañeros
      this.selectedClassmates = [];
      this.selectedClassmateIds.clear();
    }
  }

  /**
   * Abre el modal de compañeros y carga la lista desde el backend
   */
  openClassmatesModal(): void {
    if (!this.form.subjectId) {
      this.errorMessage = 'Selecciona una asignatura primero para ver los compañeros';
      return;
    }

    this.showClassmatesModal = true;
    this.classmateSearch = '';
    // Copiar selección actual al temporal
    this.tempSelectedIds = new Set(this.selectedClassmateIds);

    this.loadingClassmates = true;
    this.cdr.detectChanges();

    this.svc.getClassmatesBySubject(this.form.subjectId).subscribe({
      next: (data) => {
        this.classmates = data || [];
        this.loadingClassmates = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.errorMessage = err?.message || 'Error al cargar compañeros';
        this.loadingClassmates = false;
        this.cdr.detectChanges();
      }
    });
  }

  closeClassmatesModal(): void {
    this.showClassmatesModal = false;
    this.classmateSearch = '';
  }

  /**
   * Filtra compañeros por el texto de búsqueda
   */
  filteredClassmates(): ClassmateItem[] {
    if (!this.classmateSearch.trim()) {
      return this.classmates;
    }
    const search = this.classmateSearch.toLowerCase().trim();
    return this.classmates.filter(c =>
      c.fullName.toLowerCase().includes(search) ||
      c.email.toLowerCase().includes(search)
    );
  }

  toggleClassmate(studentId: number): void {
    if (this.tempSelectedIds.has(studentId)) {
      this.tempSelectedIds.delete(studentId);
    } else {
      this.tempSelectedIds.add(studentId);
    }
  }

  selectAllClassmates(): void {
    for (const c of this.filteredClassmates()) {
      this.tempSelectedIds.add(c.studentId);
    }
    this.cdr.detectChanges();
  }

  deselectAllClassmates(): void {
    this.tempSelectedIds.clear();
    this.cdr.detectChanges();
  }

  /**
   * Confirma la selección de compañeros y cierra el modal
   */
  confirmClassmatesSelection(): void {
    this.selectedClassmateIds = new Set(this.tempSelectedIds);
    this.selectedClassmates = this.classmates.filter(c => this.selectedClassmateIds.has(c.studentId));
    this.showClassmatesModal = false;
    this.classmateSearch = '';
    this.cdr.detectChanges();
  }

  /**
   * Obtiene los nombres de los compañeros seleccionados (primer nombre solamente)
   */
  getSelectedNames(): string {
    return this.selectedClassmates.map(c => c.fullName.split(' ')[0]).join(', ');
  }

  // ==================== FRANJAS HORARIAS ====================

  canLoadTimeSlots(): boolean {
    return !!(this.form.teacherId && this.form.requestedDay && this.form.periodId);
  }

  onTeacherOrDayChange(): void {
    this.form.timeSlotId = null;
    this.availableTimeSlots = [];
    this.noTimeSlotsMessage = null;

    if (!this.form.teacherId || !this.form.periodId) {
      this.cdr.detectChanges();
      return;
    }

    this.loadingTimeSlots = true;
    this.cdr.detectChanges();

    // Intentar con el día actual primero, luego probar todos los días (1-6)
    const currentDay = this.form.requestedDay || 1;
    const daysToTry = [currentDay, ...([1, 2, 3, 4, 5, 6].filter(d => d !== currentDay))];

    this.tryLoadTimeSlotsForDays(daysToTry, 0);
  }

  /**
   * Intenta cargar franjas disponibles probando cada día de la lista.
   * Si el día actual no tiene franjas, prueba el siguiente hasta encontrar uno.
   */
  private tryLoadTimeSlotsForDays(days: number[], index: number): void {
    if (index >= days.length) {
      // No se encontraron franjas en ningún día
      this.loadingTimeSlots = false;
      this.availableTimeSlots = [];
      this.form.timeSlotId = null;
      this.cdr.detectChanges();
      return;
    }

    const day = days[index];

    this.svc.getAvailableTimeSlots(
      this.form.teacherId!,
      day,
      this.form.periodId
    ).subscribe({
      next: (data) => {
        const slots = data || [];

        if (slots.length > 0) {
          // Encontramos franjas disponibles en este día
          this.form.requestedDay = day;
          this.availableTimeSlots = slots;
          this.loadingTimeSlots = false;

          // Seleccionar la 2da opción (índice 1), o la 1ra si solo hay una
          const idx = Math.min(1, slots.length - 1);
          this.form.timeSlotId = slots[idx].timeSlotId;

          this.cdr.detectChanges();
        } else {
          // No hay franjas en este día, probar el siguiente
          this.tryLoadTimeSlotsForDays(days, index + 1);
        }
      },
      error: () => {
        // Error en este día, probar el siguiente
        this.tryLoadTimeSlotsForDays(days, index + 1);
      }
    });
  }

  // ==================== SUBMIT ====================

  onSubmit(): void {
    if (!this.isFormValid()) {
      this.errorMessage = 'Por favor completa todos los campos obligatorios';
      return;
    }

    this.submitting = true;
    this.errorMessage = null;

    const payload: CreateRequestPayload = {
      syllabusId: this.form.syllabusId!,
      teacherId: this.form.teacherId!,
      timeSlotId: this.form.timeSlotId!,
      modalityId: this.form.modalityId!,
      sessionTypeId: this.form.sessionTypeId!,
      reason: this.form.reason.trim(),
      requestedDay: this.form.requestedDay!,
      fileUrl: this.form.fileUrl?.trim() || null,
      periodId: this.form.periodId,
      participantIds: this.isGroupSession() ? Array.from(this.selectedClassmateIds) : undefined
    };

    this.svc.createRequest(payload).subscribe({
      next: (response) => {
        this.submitting = false;
        this.successMessage = `Solicitud #${response.requestId} creada exitosamente`;
        this.cdr.detectChanges();

        setTimeout(() => {
          this.router.navigate(['/student/my-requests']);
        }, 1500);
      },
      error: (err) => {
        this.errorMessage = err?.message || 'Error al crear la solicitud';
        this.submitting = false;

        if (err?.message?.includes('no está disponible') ||
            err?.message?.includes('not available')) {
          this.form.timeSlotId = null;
          this.onTeacherOrDayChange();
        }

        this.cdr.detectChanges();
      }
    });
  }

  isFormValid(): boolean {
    return !!(
      this.form.syllabusId &&
      this.form.teacherId &&
      this.form.timeSlotId &&
      this.form.modalityId &&
      this.form.sessionTypeId &&
      this.form.requestedDay &&
      this.form.reason?.trim().length >= 10
    );
  }

  goBack(): void {
    this.router.navigate(['/student/my-requests']);
  }
}
