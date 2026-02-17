import { Component, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UploadResult } from '../../../models/coordination/coord-dataload';
import { CoordDataloadService } from '../../../services/coordination/coord-dataload/coord-dataload.service';

@Component({
  selector: 'app-coord-dataload',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './coord-dataload.component.html',
  styleUrl: './coord-dataload.component.css',
})
export class CoordDataloadComponent {
  @ViewChild('fileInputStudents') fileInputStudents!: ElementRef<HTMLInputElement>;
  @ViewChild('fileInputTeachers') fileInputTeachers!: ElementRef<HTMLInputElement>;

  // Inyección del servicio
  constructor(private dataloadService: CoordDataloadService) {}

  // ===== CONTROL DE ARCHIVOS =====
  selectedFileStudents: File | null = null;
  selectedFileTeachers: File | null = null;

  // ===== CONTROL DE DRAG & DROP =====
  isDraggingStudents = false;
  isDraggingTeachers = false;

  // ===== CONTROL DE CARGA Y PROGRESO =====
  isUploadingStudents = false;
  isUploadingTeachers = false;
  studentUploadProgress = 0;
  teacherUploadProgress = 0;
  studentUploadSuccess = false;
  teacherUploadSuccess = false;

  // ===== RESULTADOS DE CARGA =====
  uploadResults: UploadResult[] = [];
  searchTerm = '';
  paginatedResults: UploadResult[] = [];

  // ===== PAGINACIÓN =====
  currentPage = 1;
  pageSize = 10;

  // ===== FILTROS =====
  currentFilterStatus: 'all' | 'success' | 'error' = 'all';
  filteredResults: UploadResult[] = [];

  // ===== PROPIEDADES AUXILIARES =====
  Math = Math; // Para usar Math en templates

  // ===== CONTADORES =====
  uploadedItems = 0;
  errorCount = 0;
  successCount = 0;

  // ===== MÉTODOS PARA ABRIR SELECTOR =====

  openFileSelectStudents(): void {
    this.fileInputStudents.nativeElement.click();
  }

  openFileSelectTeachers(): void {
    this.fileInputTeachers.nativeElement.click();
  }

  // ===== MÉTODOS ESTUDIANTES =====

  onDragOverStudents(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isDraggingStudents = true;
  }

  onDragLeaveStudents(): void {
    this.isDraggingStudents = false;
  }

  onDropStudents(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isDraggingStudents = false;

    const files = event.dataTransfer?.files;
    if (files && files.length > 0) {
      const file = files[0];
      if (this.isValidFile(file)) {
        this.selectedFileStudents = file;
        console.log('Archivo de estudiantes seleccionado:', file.name);
      } else {
        this.showError('Por favor, selecciona un archivo válido (Excel o CSV). Máximo 10 MB.');
      }
    }
  }

  onFileSelectedStudents(event: any): void {
    const files = event.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      if (this.isValidFile(file)) {
        this.selectedFileStudents = file;
        console.log('Archivo de estudiantes seleccionado:', file.name);
      } else {
        this.showError('Por favor, selecciona un archivo válido (Excel o CSV). Máximo 10 MB.');
        event.target.value = '';
      }
    }
  }

  uploadStudents(): void {
    if (!this.selectedFileStudents) {
      this.showError('Por favor, selecciona un archivo primero.');
      return;
    }

    this.isUploadingStudents = true;
    this.studentUploadProgress = 0;

    // Simular progreso de carga
    const interval = setInterval(() => {
      this.studentUploadProgress += Math.random() * 30;
      if (this.studentUploadProgress >= 100) {
        this.studentUploadProgress = 100;
        clearInterval(interval);
        this.completeStudentUpload();
      }
    }, 300);
  }

  private completeStudentUpload(): void {
    this.isUploadingStudents = false;
    this.studentUploadSuccess = true;

    // Agregar resultados de ejemplo
    this.addUploadResults('Estudiantes', 8);

    this.showSuccess(`✓ Archivo "${this.selectedFileStudents?.name}" cargado exitosamente.`);

    // Resetear después de 2 segundos
    setTimeout(() => {
      this.selectedFileStudents = null;
      this.studentUploadProgress = 0;
      if (this.fileInputStudents) {
        this.fileInputStudents.nativeElement.value = '';
      }
    }, 2000);
  }

  // ===== MÉTODOS DOCENTES =====

  onDragOverTeachers(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isDraggingTeachers = true;
  }

  onDragLeaveTeachers(): void {
    this.isDraggingTeachers = false;
  }

  onDropTeachers(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isDraggingTeachers = false;

    const files = event.dataTransfer?.files;
    if (files && files.length > 0) {
      const file = files[0];
      if (this.isValidFile(file)) {
        this.selectedFileTeachers = file;
        console.log('Archivo de docentes seleccionado:', file.name);
      } else {
        this.showError('Por favor, selecciona un archivo válido (Excel o CSV). Máximo 10 MB.');
      }
    }
  }

  onFileSelectedTeachers(event: any): void {
    const files = event.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      if (this.isValidFile(file)) {
        this.selectedFileTeachers = file;
        console.log('Archivo de docentes seleccionado:', file.name);
      } else {
        this.showError('Por favor, selecciona un archivo válido (Excel o CSV). Máximo 10 MB.');
        event.target.value = '';
      }
    }
  }

  uploadTeachers(): void {
    if (!this.selectedFileTeachers) {
      this.showError('Por favor, selecciona un archivo primero.');
      return;
    }

    this.isUploadingTeachers = true;
    this.teacherUploadProgress = 0;

    // Simular progreso de carga
    const interval = setInterval(() => {
      this.teacherUploadProgress += Math.random() * 30;
      if (this.teacherUploadProgress >= 100) {
        this.teacherUploadProgress = 100;
        clearInterval(interval);
        this.completeTeacherUpload();
      }
    }, 300);
  }

  private completeTeacherUpload(): void {
    this.isUploadingTeachers = false;
    this.teacherUploadSuccess = true;

    // Agregar resultados de ejemplo
    this.addUploadResults('Docentes', 6);

    this.showSuccess(`✓ Archivo "${this.selectedFileTeachers?.name}" cargado exitosamente.`);

    // Resetear después de 2 segundos
    setTimeout(() => {
      this.selectedFileTeachers = null;
      this.teacherUploadProgress = 0;
      if (this.fileInputTeachers) {
        this.fileInputTeachers.nativeElement.value = '';
      }
    }, 2000);
  }

  // ===== MÉTODOS DE RESULTADOS =====

  /**
   * Agrega resultados de ejemplo a la tabla
   */
  private addUploadResults(type: string, count: number): void {
    const examples = [
      `Fila 2. Estudiante. "García López, María" registrado correctamente.`,
      `Fila 3. Estudiante. "Pérez Vega, Juan Carlos" registrado correctamente.`,
      `Fila 4. ERROR. Célula "DOCUMENTO" ya existe en el sistema.`,
      `Fila 5. Estudiante. "Torres Muñoz, Ana" registrado correctamente.`,
      `Fila 6. ERROR. Campo "Carrera" vacío. Registro omitido.`,
      `Fila 7. Estudiante. "Romano Alvarado, Luis" registrado correctamente.`,
      `Fila 8. Estudiante. "Mendoza Cevallos, Sofía" registrado correctamente.`,
      `Fila 9. ERROR. Número de teléfono inválido: "999 ABC-1234".`,
      `Fila 10. Estudiante. "Castro Ríos, Roberto" registrado correctamente.`,
    ];

    for (let i = 0; i < count; i++) {
      const isError = Math.random() < 0.2;
      const result: UploadResult = {
        tipo: type as 'Estudiantes' | 'Docentes',
        status: isError ? 'error' : 'success',
        message: examples[i % examples.length]
      };
      this.uploadResults.push(result);
    }

    this.updateCounters();
    this.currentPage = 1;
    this.filterResults();
  }

  /**
   * Actualiza los contadores
   */
  private updateCounters(): void {
    this.uploadedItems = this.uploadResults.length;
    this.errorCount = this.uploadResults.filter(r => r.status === 'error').length;
    this.successCount = this.uploadResults.filter(r => r.status === 'success').length;
  }

  /**
   * Filtra los resultados según el término de búsqueda y estado
   */
  filterResults(): void {
    let filtered = this.uploadResults;

    // Filtrar por estado
    if (this.currentFilterStatus !== 'all') {
      filtered = filtered.filter(r => r.status === this.currentFilterStatus);
    }

    // Filtrar por término de búsqueda
    if (this.searchTerm.trim()) {
      filtered = filtered.filter(r =>
        r.message.toLowerCase().includes(this.searchTerm.toLowerCase())
      );
    }

    this.paginatedResults = this.getPaginatedResults(filtered);
  }

  /**
   * Obtiene los resultados paginados
   */
  private getPaginatedResults(items: UploadResult[]): UploadResult[] {
    const start = (this.currentPage - 1) * this.pageSize;
    const end = start + this.pageSize;
    return items.slice(start, end);
  }

  /**
   * Navega a la página siguiente
   */
  nextPage(event: Event): void {
    event.preventDefault();
    if (this.hasNextPage()) {
      this.currentPage++;
      this.filterResults();
    }
  }

  /**
   * Navega a la página anterior
   */
  previousPage(event: Event): void {
    event.preventDefault();
    if (this.currentPage > 1) {
      this.currentPage--;
      this.filterResults();
    }
  }

  /**
   * Verifica si hay próxima página
   */
  hasNextPage(): boolean {
    return (this.currentPage * this.pageSize) < this.uploadResults.length;
  }

  /**
   * Obtiene el total de páginas
   */
  getTotalPages(): number {
    return Math.ceil(this.uploadResults.length / this.pageSize);
  }

  /**
   * Filtra por estado (all, success, error)
   */
  filterByStatus(status: 'all' | 'success' | 'error'): void {
    this.currentFilterStatus = status;
    this.currentPage = 1;
    this.filterResults();
  }

  // ===== MÉTODOS AUXILIARES =====

  /**
   * Valida que el archivo sea válido
   */
  private isValidFile(file: File): boolean {
    const validTypes = [
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'application/vnd.ms-excel',
      'text/csv'
    ];

    const maxSize = 10 * 1024 * 1024; // 10 MB

    return validTypes.includes(file.type) && file.size <= maxSize;
  }

  /**
   * Muestra un mensaje de error
   */
  private showError(message: string): void {
    alert(message);
  }

  /**
   * Muestra un mensaje de éxito
   */
  private showSuccess(message: string): void {
    alert(message);
  }
}
