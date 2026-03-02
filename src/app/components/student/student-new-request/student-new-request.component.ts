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
  templateUrl: './student-new-request.component.html'
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
