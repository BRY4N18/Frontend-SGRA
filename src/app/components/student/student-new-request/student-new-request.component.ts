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
  TimeSlotItem
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

            <!-- Row 1: Asignatura y Tema -->
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
                <label class="form-label fw-semibold">Tema/Temario <span class="text-danger">*</span></label>
                <select class="form-select" [(ngModel)]="form.syllabusId" name="syllabusId"
                        required [disabled]="!form.subjectId || loadingSyllabi">
                  <option [ngValue]="null">{{ loadingSyllabi ? 'Cargando...' : 'Selecciona un tema' }}</option>
                  @for (sy of syllabi; track sy.syllabusId) {
                    <option [ngValue]="sy.syllabusId">Unidad {{ sy.unit }}: {{ sy.syllabusName }}</option>
                  }
                </select>
              </div>
            </div>

            <!-- Row 2: Modalidad y Tipo Sesión -->
            <div class="row g-3 mb-3">
              <div class="col-md-6">
                <label class="form-label fw-semibold">Modalidad <span class="text-danger">*</span></label>
                <select class="form-select" [(ngModel)]="form.modalityId" name="modalityId"
                        (change)="onModalityChange()" required [disabled]="loadingCatalogs">
                  <option [ngValue]="null">Selecciona modalidad</option>
                  @for (m of modalities; track m.modalityId) {
                    <option [ngValue]="m.modalityId">{{ m.modalityName }}</option>
                  }
                </select>
              </div>

              <div class="col-md-6">
                <label class="form-label fw-semibold">Tipo de Sesión <span class="text-danger">*</span></label>
                <select class="form-select" [(ngModel)]="form.sessionTypeId" name="sessionTypeId"
                        required [disabled]="loadingCatalogs">
                  <option [ngValue]="null">Selecciona tipo de sesión</option>
                  @for (st of sessionTypes; track st.sessionTypeId) {
                    <option [ngValue]="st.sessionTypeId">{{ st.sessionTypeName }}</option>
                  }
                </select>
              </div>
            </div>

            <!-- Row 3: Docente y Franja Horaria -->
            <div class="row g-3 mb-3">
              <div class="col-md-6">
                <label class="form-label fw-semibold">Docente <span class="text-danger">*</span></label>
                <select class="form-select" [(ngModel)]="form.teacherId" name="teacherId"
                        required [disabled]="loadingTeachers">
                  <option [ngValue]="null">{{ loadingTeachers ? 'Cargando...' : 'Selecciona docente' }}</option>
                  @for (t of teachers; track t.teacherId) {
                    <option [ngValue]="t.teacherId">{{ t.fullName }}</option>
                  }
                </select>
              </div>

              <div class="col-md-6">
                <label class="form-label fw-semibold">Franja Horaria <span class="text-danger">*</span></label>
                <select class="form-select" [(ngModel)]="form.timeSlotId" name="timeSlotId"
                        required [disabled]="loadingCatalogs">
                  <option [ngValue]="null">Selecciona franja horaria</option>
                  @for (ts of timeSlots; track ts.timeSlotId) {
                    <option [ngValue]="ts.timeSlotId">{{ ts.label }}</option>
                  }
                </select>
              </div>
            </div>

            <!-- Row 4: Día y Motivo -->
            <div class="row g-3 mb-3">
              <div class="col-md-4">
                <label class="form-label fw-semibold">Día Solicitado <span class="text-danger">*</span></label>
                <select class="form-select" [(ngModel)]="form.requestedDay" name="requestedDay" required>
                  <option [ngValue]="null">Selecciona día</option>
                  <option [ngValue]="1">Lunes</option>
                  <option [ngValue]="2">Martes</option>
                  <option [ngValue]="3">Miércoles</option>
                  <option [ngValue]="4">Jueves</option>
                  <option [ngValue]="5">Viernes</option>
                  <option [ngValue]="6">Sábado</option>
                </select>
              </div>

              <div class="col-md-8">
                <label class="form-label fw-semibold">Motivo <span class="text-danger">*</span></label>
                <textarea class="form-control" [(ngModel)]="form.reason" name="reason"
                          rows="2" required minlength="10" maxlength="500"
                          placeholder="Describe brevemente el motivo de tu solicitud..."></textarea>
                <small class="text-muted">Mínimo 10 caracteres</small>
              </div>
            </div>

            <!-- Row 5: URL de archivo (opcional) -->
            <div class="row g-3 mb-4">
              <div class="col-12">
                <label class="form-label fw-semibold">URL de Archivo (opcional)</label>
                <input type="url" class="form-control" [(ngModel)]="form.fileUrl" name="fileUrl"
                       placeholder="https://ejemplo.com/archivo.pdf">
                <small class="text-muted">Si tienes material de apoyo, puedes compartir el enlace</small>
              </div>
            </div>

            <!-- Buttons -->
            <div class="d-flex justify-content-end gap-2">
              <button type="button" class="btn btn-outline-secondary" (click)="goBack()" [disabled]="submitting">
                Cancelar
              </button>
              <button type="submit" class="btn btn-success" [disabled]="!requestForm.valid || submitting">
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

  // Loading states
  loadingCatalogs = false;
  loadingSyllabi = false;
  loadingTeachers = false;
  submitting = false;

  // Messages
  errorMessage: string | null = null;
  successMessage: string | null = null;

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
    periodId: 1  // Default period, adjust as needed
  };

  ngAfterViewInit(): void {
    Promise.resolve().then(() => {
      this.loadCatalogs();
    });
  }

  loadCatalogs(): void {
    this.loadingCatalogs = true;
    this.errorMessage = null;

    // Load all catalogs in parallel
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

    if (this.form.subjectId) {
      this.loadingSyllabi = true;
      this.svc.getSyllabiBySubject(this.form.subjectId).subscribe({
        next: (data) => {
          this.syllabi = data || [];
          this.loadingSyllabi = false;
          this.cdr.detectChanges();
        },
        error: (err) => {
          this.errorMessage = err?.message || 'Error al cargar los temas';
          this.loadingSyllabi = false;
          this.cdr.detectChanges();
        }
      });
    }
  }

  onModalityChange(): void {
    // Optionally filter teachers by modality
    if (this.form.modalityId) {
      this.loadingTeachers = true;
      this.svc.getTeachers(this.form.modalityId).subscribe({
        next: (data) => {
          this.teachers = data || [];
          this.form.teacherId = null; // Reset selection
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
      periodId: this.form.periodId
    };

    this.svc.createRequest(payload).subscribe({
      next: (response) => {
        this.submitting = false;
        this.successMessage = `Solicitud #${response.requestId} creada exitosamente`;
        this.cdr.detectChanges();

        // Redirect after a brief delay to show success message
        setTimeout(() => {
          this.router.navigate(['/student/my-requests']);
        }, 1500);
      },
      error: (err) => {
        this.errorMessage = err?.message || 'Error al crear la solicitud';
        this.submitting = false;
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
