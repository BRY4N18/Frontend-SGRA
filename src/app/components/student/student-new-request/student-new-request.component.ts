import { Component, AfterViewInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { StudentNewRequestService } from '../../../services/student/student-new-request.service';
import {
  SubjectItem,
  SessionTypeItem,
  StudentSubjectTeacher,
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

            <!-- Row 1: Asignatura y Docente -->
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
                <label class="form-label fw-semibold">Docente</label>
                @if (loadingTeacher) {
                  <div class="form-control bg-light text-muted">
                    <span class="spinner-border spinner-border-sm me-2" role="status"></span>
                    Cargando docente...
                  </div>
                } @else if (teacherInfo) {
                  <input type="text" class="form-control bg-light" [value]="teacherInfo.fullName" readonly>
                  <small class="text-muted">{{ teacherInfo.email }}</small>
                } @else if (form.subjectId && !loadingTeacher) {
                  <div class="form-control bg-light text-danger">
                    <i class="bi bi-exclamation-triangle me-1"></i>
                    No hay docente asignado para esta asignatura
                  </div>
                } @else {
                  <input type="text" class="form-control bg-light" value="Selecciona una asignatura primero" readonly disabled>
                }
              </div>
            </div>

            <!-- Row 2: Tipo de Sesión -->
            <div class="row g-3 mb-3">
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

              <div class="col-md-6">
                <!-- Placeholder para mantener layout equilibrado -->
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

            <!-- Row 3: Motivo -->
            <div class="row g-3 mb-3">
              <div class="col-12">
                <label class="form-label fw-semibold">Motivo <span class="text-danger">*</span></label>
                <textarea class="form-control" [(ngModel)]="form.reason" name="reason"
                          rows="3" required minlength="10" maxlength="500"
                          placeholder="Describe brevemente el motivo de tu solicitud de refuerzo..."></textarea>
                <small class="text-muted">Mínimo 10 caracteres ({{ form.reason.length }}/500)</small>
              </div>
            </div>

            <!-- Row 4: Subida de Archivos -->
            <div class="row g-3 mb-4">
              <div class="col-12">
                <label class="form-label fw-semibold">Archivos de Apoyo (opcional)</label>
                <div class="input-group">
                  <input type="file" class="form-control" multiple
                         (change)="onFilesSelected($event)"
                         accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.jpg,.jpeg,.png,.gif,.zip,.rar">
                  @if (selectedFiles.length > 0) {
                    <button type="button" class="btn btn-outline-danger" (click)="clearFiles()">
                      <i class="bi bi-trash"></i>
                    </button>
                  }
                </div>
                <small class="text-muted">Máximo 10MB por archivo. Formatos: PDF, documentos Office, imágenes, ZIP</small>

                <!-- Lista de archivos seleccionados -->
                @if (selectedFiles.length > 0) {
                  <div class="mt-2">
                    @for (file of selectedFiles; track $index) {
                      <div class="d-flex align-items-center justify-content-between bg-light rounded px-3 py-2 mb-1">
                        <div>
                          <i class="bi bi-file-earmark me-2"></i>
                          <span class="fw-semibold">{{ file.name }}</span>
                          <small class="text-muted ms-2">({{ formatFileSize(file.size) }})</small>
                        </div>
                        <button type="button" class="btn btn-sm btn-outline-danger border-0" (click)="removeFile($index)">
                          <i class="bi bi-x-lg"></i>
                        </button>
                      </div>
                    }
                  </div>
                }
              </div>
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

  // Catálogos
  subjects: SubjectItem[] = [];
  sessionTypes: SessionTypeItem[] = [];

  // Docente (auto-cargado por paralelo)
  teacherInfo: StudentSubjectTeacher | null = null;
  loadingTeacher = false;

  // Compañeros (sesión grupal)
  classmates: ClassmateItem[] = [];
  selectedClassmates: ClassmateItem[] = [];
  selectedClassmateIds: Set<number> = new Set();
  tempSelectedIds: Set<number> = new Set();
  showClassmatesModal = false;
  loadingClassmates = false;
  classmateSearch = '';

  // Archivos
  selectedFiles: File[] = [];

  // Estados de carga
  loadingCatalogs = false;
  submitting = false;

  // Mensajes
  errorMessage: string | null = null;
  successMessage: string | null = null;

  // Modelo del formulario (simplificado)
  form: {
    subjectId: number | null;
    sessionTypeId: number | null;
    reason: string;
  } = {
    subjectId: null,
    sessionTypeId: null,
    reason: ''
  };

  ngAfterViewInit(): void {
    Promise.resolve().then(() => {
      this.loadCatalogs();
    });
  }

  // ==================== CARGA DE CATÁLOGOS ====================

  loadCatalogs(): void {
    this.loadingCatalogs = true;
    this.errorMessage = null;

    Promise.all([
      this.svc.getSubjects().toPromise(),
      this.svc.getSessionTypes().toPromise()
    ]).then(([subjects, sessionTypes]) => {
      this.subjects = subjects || [];
      this.sessionTypes = sessionTypes || [];
      this.loadingCatalogs = false;
      this.cdr.detectChanges();
    }).catch(err => {
      this.errorMessage = err?.message || 'Error al cargar los catálogos';
      this.loadingCatalogs = false;
      this.cdr.detectChanges();
    });
  }

  // ==================== CAMBIO DE ASIGNATURA ====================

  onSubjectChange(): void {
    // Resetear docente y compañeros
    this.teacherInfo = null;
    this.classmates = [];
    this.selectedClassmates = [];
    this.selectedClassmateIds.clear();

    if (!this.form.subjectId) {
      this.cdr.detectChanges();
      return;
    }

    // Cargar el docente del paralelo del estudiante para esta asignatura
    this.loadingTeacher = true;
    this.cdr.detectChanges();

    this.svc.getTeacherBySubject(this.form.subjectId).subscribe({
      next: (data: any) => {
        this.loadingTeacher = false;
        // Si el backend retorna { found: false, message: "..." } significa que no hay docente
        if (data && data.found === false) {
          this.teacherInfo = null;
        } else if (data && data.teacherId) {
          this.teacherInfo = data as StudentSubjectTeacher;
        } else {
          this.teacherInfo = null;
        }
        this.cdr.detectChanges();

        // Si ya está en sesión grupal, abrir modal de compañeros
        if (this.isGroupSession()) {
          this.openClassmatesModal();
        }
      },
      error: (err) => {
        this.loadingTeacher = false;
        this.teacherInfo = null;
        this.errorMessage = err?.message || 'Error al cargar el docente';
        this.cdr.detectChanges();
      }
    });
  }

  // ==================== SESIÓN GRUPAL / COMPAÑEROS ====================

  isGroupSession(): boolean {
    return this.form.sessionTypeId === 2;
  }

  onSessionTypeChange(): void {
    if (this.isGroupSession() && this.form.subjectId) {
      this.openClassmatesModal();
    } else if (!this.isGroupSession()) {
      this.selectedClassmates = [];
      this.selectedClassmateIds.clear();
    }
  }

  openClassmatesModal(): void {
    if (!this.form.subjectId) {
      this.errorMessage = 'Selecciona una asignatura primero para ver los compañeros';
      return;
    }

    this.showClassmatesModal = true;
    this.classmateSearch = '';
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

  confirmClassmatesSelection(): void {
    this.selectedClassmateIds = new Set(this.tempSelectedIds);
    this.selectedClassmates = this.classmates.filter(c => this.selectedClassmateIds.has(c.studentId));
    this.showClassmatesModal = false;
    this.classmateSearch = '';
    this.cdr.detectChanges();
  }

  getSelectedNames(): string {
    return this.selectedClassmates.map(c => c.fullName.split(' ')[0]).join(', ');
  }

  // ==================== ARCHIVOS ====================

  onFilesSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files) {
      const newFiles = Array.from(input.files);

      // Validar tamaño (max 10MB por archivo)
      const maxSize = 10 * 1024 * 1024; // 10MB
      for (const file of newFiles) {
        if (file.size > maxSize) {
          this.errorMessage = `El archivo "${file.name}" excede el tamaño máximo de 10MB`;
          return;
        }
      }

      this.selectedFiles = [...this.selectedFiles, ...newFiles];
      this.cdr.detectChanges();
    }
  }

  removeFile(index: number): void {
    this.selectedFiles.splice(index, 1);
    this.cdr.detectChanges();
  }

  clearFiles(): void {
    this.selectedFiles = [];
    this.cdr.detectChanges();
  }

  formatFileSize(bytes: number): string {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  }

  // ==================== ENVIAR SOLICITUD ====================

  onSubmit(): void {
    if (!this.isFormValid()) {
      this.errorMessage = 'Por favor completa todos los campos obligatorios';
      return;
    }

    this.submitting = true;
    this.errorMessage = null;

    const payload: CreateRequestPayload = {
      subjectId: this.form.subjectId!,
      sessionTypeId: this.form.sessionTypeId!,
      reason: this.form.reason.trim(),
      participantIds: this.isGroupSession() ? Array.from(this.selectedClassmateIds) : undefined
    };

    this.svc.createRequest(payload, this.selectedFiles).subscribe({
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
        this.cdr.detectChanges();
      }
    });
  }

  isFormValid(): boolean {
    return !!(
      this.form.subjectId &&
      this.form.sessionTypeId &&
      this.teacherInfo &&                    // Debe haber docente asignado
      this.form.reason?.trim().length >= 10
    );
  }

  goBack(): void {
    this.router.navigate(['/student/my-requests']);
  }
}
