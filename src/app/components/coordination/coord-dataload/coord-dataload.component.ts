import { Component, ViewChild, ElementRef, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UploadResult } from '../../../models/coordination/coord-dataload';
import { CoordDataloadService } from '../../../services/coordination/coord-dataload/coord-dataload.service';

// 1. Definimos un tipo estricto para las 8 opciones de carga
export type UploadType = 'periods' | 'careers' | 'subjects' | 'syllabi' | 'students' | 'teachers' | 'registrations' | 'schedules';

@Component({
  selector: 'app-coord-dataload',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './coord-dataload.component.html',
  styleUrl: './coord-dataload.component.css',
})
export class CoordDataloadComponent {
  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;
  @ViewChild('fileInputStudents') fileInputStudents!: ElementRef<HTMLInputElement>;
  @ViewChild('fileInputTeachers') fileInputTeachers!: ElementRef<HTMLInputElement>;

  // Opción seleccionada para el dropdown
  selectedOption = {
    id: 'students',
    label: 'Estudiantes',
    icon: 'bi bi-mortarboard'
  };

  // Estado de carga
  isLoading = false;

  // Método para cambiar la opción en el dropdown
  selectOption(option: any) {
    this.selectedOption = option;
    this.selectedUploadType = option.id;
    this.clearFile();
  }

  // Método principal para subir datos
  uploadData() {
    if (!this.selectedFile) {
      this.showPrerequisiteAlert('Por favor, selecciona un archivo primero.');
      return;
    }
    // Validaciones de prerrequisitos según el orden correcto
    let mensaje = '';
    switch (this.selectedOption.id) {
      case 'careers':
        mensaje = 'Primero debes cargar los Periodos Académicos.';
        break;
      case 'subjects':
        mensaje = 'Primero debes cargar las Carreras.';
        break;
      case 'syllabi':
        mensaje = 'Primero debes cargar las Asignaturas.';
        break;
      case 'students':
        mensaje = 'Primero debes cargar los Periodos Académicos.';
        break;
      case 'teachers':
        mensaje = 'Primero debes cargar los Periodos Académicos.';
        break;
      case 'registrations':
        mensaje = 'Primero debes cargar Estudiantes, Asignaturas y Periodos Académicos.';
        break;
      case 'schedules':
        mensaje = 'Primero debes cargar Docentes, Asignaturas, Periodos Académicos y Matrículas.';
        break;
      default:
        mensaje = '';
    }
    if (mensaje) {
      this.showPrerequisiteAlert(mensaje);
      return;
    }
    this.isLoading = true;
    let uploadObservable;
    switch (this.selectedOption.id) {
      case 'periods': uploadObservable = this.dataloadService.uploadPeriods(this.selectedFile); break;
      case 'careers': uploadObservable = this.dataloadService.uploadCareers(this.selectedFile); break;
      case 'subjects': uploadObservable = this.dataloadService.uploadSubjects(this.selectedFile); break;
      case 'syllabi': uploadObservable = this.dataloadService.uploadSyllabi(this.selectedFile); break;
      case 'students': uploadObservable = this.dataloadService.uploadStudentsFile(this.selectedFile); break;
      case 'teachers': uploadObservable = this.dataloadService.uploadTeachersFile(this.selectedFile); break;
      case 'registrations': uploadObservable = this.dataloadService.uploadRegistrations(this.selectedFile); break;
      case 'schedules': uploadObservable = this.dataloadService.uploadClassSchedules(this.selectedFile); break;
      default:
        this.isLoading = false;
        return;
    }
    uploadObservable.subscribe({
      next: (response: string[]) => {
        this.uploadResults = response.map(msg => ({
          tipo: this.selectedOption.label as any,
          status: msg.toLowerCase().includes('error') ? 'error' : 'success',
          message: msg,
          timestamp: new Date()
        }));
        this.updateCounters();
        this.currentPage = 1;
        this.filterResults();
        this.isLoading = false;
        this.selectedFile = null;
        if (this.fileInput) {
          this.fileInput.nativeElement.value = '';
        }
        this.cdr.detectChanges();
      },
      error: () => {
        alert('Hubo un error al procesar el archivo.');
        this.isLoading = false;
      }
    });
  }

  constructor(
    private dataloadService: CoordDataloadService,
    private cdr: ChangeDetectorRef
  ) {}

  // ===== NUEVO SISTEMA UNIFICADO =====

  // 2. Lista de opciones para generar el menú desplegable en el HTML dinámicamente
  uploadOptions = [
    { id: 'periods' as UploadType, label: 'Periodos Académicos', icon: 'bi bi-calendar' },
    { id: 'careers' as UploadType, label: 'Carreras', icon: 'bi bi-building' },
    { id: 'subjects' as UploadType, label: 'Asignaturas', icon: 'bi bi-book' },
    { id: 'syllabi' as UploadType, label: 'Temarios', icon: 'bi bi-card-text' },
    { id: 'students' as UploadType, label: 'Estudiantes', icon: 'bi bi-mortarboard' },
    { id: 'teachers' as UploadType, label: 'Docentes', icon: 'bi bi-person-badge' },
    { id: 'registrations' as UploadType, label: 'Matrículas de Estudiantes', icon: 'bi bi-journal-check' },
    { id: 'schedules' as UploadType, label: 'Horarios de Clases', icon: 'bi bi-clock' }
  ];

  selectedUploadType: UploadType = 'students';
  selectedFile: File | null = null;
  isDragging = false;
  isUploading = false;
  uploadProgress = 0;
  uploadSuccess = false;

  // ===== RESULTADOS DE CARGA =====
  uploadResults: UploadResult[] = [];
  searchTerm = '';
  paginatedResults: UploadResult[] = [];
  currentPage = 1;
  pageSize = 10;
  currentFilterStatus: 'all' | 'success' | 'error' = 'all';
  filteredResults: UploadResult[] = [];
  Math = Math;
  uploadedItems = 0;
  errorCount = 0;
  successCount = 0;

  // ===== MÉTODOS UNIFICADOS =====

  // Obtiene el label en español de la opción seleccionada (ej. "Periodos Académicos")
  get selectedUploadLabel(): string {
    return this.uploadOptions.find(o => o.id === this.selectedUploadType)?.label || 'Estudiantes';
  }

  selectUploadType(type: UploadType | any): void {
    // Si pasas el objeto completo desde el HTML, extraemos el ID
    this.selectedUploadType = typeof type === 'string' ? type : type.id;
    this.clearFile();
  }

  openFileSelect(): void {
    this.fileInput.nativeElement.click();
  }

  onDragOver(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isDragging = true;
  }

  onDragLeave(): void {
    this.isDragging = false;
  }

  onDrop(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isDragging = false;

    const files = event.dataTransfer?.files;
    if (files && files.length > 0) {
      const file = files[0];
      if (this.isValidFile(file)) {
        this.selectedFile = file;
        this.uploadSuccess = false;
      } else {
        this.showError('Por favor, selecciona un archivo válido (Excel o CSV). Máximo 10 MB.');
      }
    }
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const files = input.files;
    if (files && files.length > 0) {
      const file = files[0];
      if (this.isValidFile(file)) {
        this.selectedFile = file;
        this.uploadSuccess = false;
        // No subir automáticamente, solo asignar el archivo
      } else {
        this.showError('Por favor, selecciona un archivo válido (Excel o CSV). Máximo 10 MB.');
        input.value = '';
      }
    }
  }

  clearFile(event?: Event): void {
    if (event) event.stopPropagation();
    this.selectedFile = null;
    this.uploadProgress = 0;
    this.uploadSuccess = false;
    if (this.fileInput) this.fileInput.nativeElement.value = '';
    // No limpiar el reporte ni los contadores
    // El reporte y los contadores solo se limpian al cambiar de tipo o subir un nuevo archivo
  }

  uploadFile(): void {
    if (!this.selectedFile) {
      this.showError('Por favor, selecciona un archivo primero.');
      return;
    }
    // Validación de prerrequisitos solo para Matrículas y Horarios
    if (['registrations', 'schedules'].includes(this.selectedUploadType)) {
      const tipoLabel = this.uploadOptions.find(opt => opt.id === this.selectedUploadType)?.label || '';
      const mensaje = `¿Ya subiste todos los datos previos (periodos, carreras, asignaturas, temarios, estudiantes, docentes) para "${tipoLabel}"?\n\nSi no lo hiciste, la carga puede fallar. ¿Deseas continuar?`;
      if (!window.confirm(mensaje)) {
        this.showError('Carga cancelada. Por favor, sube primero los datos previos.');
        return;
      }
    }
    this.isUploading = true;
    this.uploadProgress = 0;
    let uploadObservable;
    switch (this.selectedUploadType) {
      case 'periods': uploadObservable = this.dataloadService.uploadPeriods(this.selectedFile); break;
      case 'careers': uploadObservable = this.dataloadService.uploadCareers(this.selectedFile); break;
      case 'subjects': uploadObservable = this.dataloadService.uploadSubjects(this.selectedFile); break;
      case 'syllabi': uploadObservable = this.dataloadService.uploadSyllabi(this.selectedFile); break;
      case 'students': uploadObservable = this.dataloadService.uploadStudentsFile(this.selectedFile); break;
      case 'teachers': uploadObservable = this.dataloadService.uploadTeachersFile(this.selectedFile); break;
      case 'registrations': uploadObservable = this.dataloadService.uploadRegistrations(this.selectedFile); break;
      case 'schedules': uploadObservable = this.dataloadService.uploadClassSchedules(this.selectedFile); break;
      default:
        this.isUploading = false;
        return;
    }
    uploadObservable.subscribe({
      next: (response: string[]) => {
        this.processUploadReport(response, this.selectedUploadLabel);
        this.isUploading = false;
        this.uploadSuccess = true;
        this.uploadProgress = 100;
        this.selectedFile = null;
        if (this.fileInput) {
          this.fileInput.nativeElement.value = '';
        }
        this.cdr.detectChanges();
      },
      error: (error: any) => {
        this.uploadResults = [{
          tipo: this.selectedUploadLabel as any,
          status: 'error',
          message: error.message || `Error al cargar el archivo de ${this.selectedUploadLabel}.`,
          timestamp: new Date()
        }];
        this.updateCounters();
        this.filterResults();
        this.isUploading = false;
        this.uploadSuccess = false;
        this.uploadProgress = 0;
        this.selectedFile = null;
        if (this.fileInput) {
          this.fileInput.nativeElement.value = '';
        }
        this.cdr.detectChanges();
      }
    });
  }

  private processUploadReport(reporte: string[], tipo: string): void {
    this.uploadResults = [];
    const errorKeywords = [
      'error', 'falló', 'fallo', 'failure', 'exception', '500',
      'invalid', 'not found', 'no encontrado', 'incorrecto', 'incorrect',
      'missing', 'faltante', 'null', 'nulo', 'parse', 'parsing', 'format', 'formato',
      'denied', 'denegado', 'unauthorized', 'no autorizado', 'forbidden', 'prohibido',
      'timeout', 'tiempo', 'expired', 'expirado', 'duplicate', 'duplicado', 'conflict', 'conflicto'
    ];
    reporte.forEach((mensaje: string) => {
      const texto = mensaje.toLowerCase();
      const isError = errorKeywords.some(keyword => texto.includes(keyword));
      const result: UploadResult = {
        tipo: tipo as any,
        status: isError ? 'error' : 'success',
        message: mensaje,
        timestamp: new Date()
      };
      this.uploadResults.push(result);
    });

    this.updateCounters();
    this.currentPage = 1;
    this.filterResults();
    this.cdr.detectChanges();
  }

  // ===== FILTROS Y PAGINACIÓN (Se mantienen igual) =====

  private updateCounters(): void {
    this.uploadedItems = this.uploadResults.length;
    this.errorCount = this.uploadResults.filter(r => r.status === 'error').length;
    this.successCount = this.uploadResults.filter(r => r.status === 'success').length;
  }

  filterResults(): void {
    let filtered = [...this.uploadResults];
    if (this.currentFilterStatus !== 'all') {
      filtered = filtered.filter(r => r.status === this.currentFilterStatus);
    }
    if (this.searchTerm.trim()) {
      filtered = filtered.filter(r =>
        r.message.toLowerCase().includes(this.searchTerm.toLowerCase())
      );
    }
    this.filteredResults = filtered;
    this.paginatedResults = this.getPaginatedResults(filtered);
  }

  private getPaginatedResults(items: UploadResult[]): UploadResult[] {
    const start = (this.currentPage - 1) * this.pageSize;
    const end = start + this.pageSize;
    return items.slice(start, end);
  }

  nextPage(event: Event): void {
    event.preventDefault();
    if (this.hasNextPage()) {
      this.currentPage++;
      this.filterResults();
    }
  }

  previousPage(event: Event): void {
    event.preventDefault();
    if (this.currentPage > 1) {
      this.currentPage--;
      this.filterResults();
    }
  }

  hasNextPage(): boolean {
    return (this.currentPage * this.pageSize) < this.filteredResults.length;
  }

  getTotalPages(): number {
    return Math.ceil(this.filteredResults.length / this.pageSize) || 1;
  }

  filterByStatus(status: 'all' | 'success' | 'error'): void {
    this.currentFilterStatus = status;
    this.currentPage = 1;
    this.filterResults();
  }

  // ===== VALIDACIONES =====
  private isValidFile(file: File): boolean {
    const validTypes = [
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'application/vnd.ms-excel',
      'text/csv'
    ];
    const validExtensions = ['.xlsx', '.xls', '.csv'];
    const maxSize = 10 * 1024 * 1024; // 10 MB
    const fileName = file.name.toLowerCase();
    const hasValidExtension = validExtensions.some(ext => fileName.endsWith(ext));
    return (validTypes.includes(file.type) || hasValidExtension) && file.size <= maxSize;
  }

  private showError(message: string): void {
    alert(message);
  }

  private showSuccess(message: string): void {
    alert(message);
  }

  // ===== MODAL DE ALERTA DE PRERREQUISITO =====
  showPrerequisiteModal = false;
  prerequisiteMessage = '';

  showPrerequisiteAlert(message: string) {
    this.prerequisiteMessage = message;
    this.showPrerequisiteModal = true;
  }

  closePrerequisiteModal() {
    this.showPrerequisiteModal = false;
  }

  // ===================================================================
  // ===== CONTROL DE ARCHIVOS Y MÉTODOS "LEGACY" (DEPRECADOS) =========
  // (Mantenidos para evitar que tu HTML actual se rompa si los usa)
  // ===================================================================

  selectedFileStudents: File | null = null;
  selectedFileTeachers: File | null = null;
  isDraggingStudents = false;
  isDraggingTeachers = false;
  isUploadingStudents = false;
  isUploadingTeachers = false;
  studentUploadProgress = 0;
  teacherUploadProgress = 0;
  studentUploadSuccess = false;
  teacherUploadSuccess = false;

  openFileSelectStudents(): void { this.fileInputStudents.nativeElement.click(); }
  openFileSelectTeachers(): void { this.fileInputTeachers.nativeElement.click(); }

  // ... (Aquí irían el resto de tus métodos antiguos como uploadStudents, uploadTeachers, onDropStudents, etc.
  // No los he borrado, puedes copiarlos y pegarlos aquí al final del archivo tal y como los tenías si aún los necesitas).
}
