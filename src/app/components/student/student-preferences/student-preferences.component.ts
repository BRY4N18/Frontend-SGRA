import { Component, AfterViewInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  StudentPreferencesService,
  NotificationChannelDTO,
  StudentPreferenceDTO,
  StudentPreferenceUpsertRequestDTO
} from '../../../services/student/student-preferences.service';

@Component({
  selector: 'app-student-preferences',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="container-fluid">
      <!-- Header -->
      <div class="mb-4">
        <h3 class="mb-1">Preferencias</h3>
        <p class="text-muted mb-0">Configura tus preferencias para notificaciones de refuerzos académicos</p>
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

      <!-- Loading State -->
      @if (loading) {
        <div class="card border-0 shadow-sm">
          <div class="card-body text-center py-5">
            <div class="spinner-border text-success mb-3" role="status"></div>
            <p class="text-muted mb-0">Cargando preferencias...</p>
          </div>
        </div>
      }

      <!-- Preferences Form -->
      @if (!loading) {
        <div class="card border-0 shadow-sm">
          <div class="card-header bg-white border-0 py-3">
            <h5 class="mb-0">
              <i class="bi bi-bell me-2 text-success"></i>
              Notificaciones
            </h5>
          </div>
          <div class="card-body">
            <form (ngSubmit)="onSave()" #preferencesForm="ngForm">
              <!-- Channel Selection -->
              <div class="mb-4">
                <label class="form-label fw-semibold">
                  Canal de Notificación <span class="text-danger">*</span>
                </label>
                <p class="text-muted small mb-2">
                  Selecciona cómo deseas recibir notificaciones sobre tus solicitudes de refuerzo
                </p>
                <select class="form-select" [(ngModel)]="form.channelId" name="channelId" required>
                  <option [ngValue]="null">Selecciona un canal</option>
                  @for (channel of channels; track channel.channelId) {
                    <option [ngValue]="channel.channelId">{{ channel.channelName }}</option>
                  }
                </select>
              </div>

              <!-- Reminder Anticipation -->
              <div class="mb-4">
                <label class="form-label fw-semibold">
                  Anticipación del Recordatorio <span class="text-danger">*</span>
                </label>
                <p class="text-muted small mb-2">
                  ¿Con cuántos minutos de anticipación deseas recibir un recordatorio antes de tu sesión?
                </p>
                <div class="input-group" style="max-width: 200px;">
                  <input type="number" class="form-control"
                         [(ngModel)]="form.reminderAnticipation"
                         name="reminderAnticipation"
                         min="0" max="1440" required
                         placeholder="0">
                  <span class="input-group-text">minutos</span>
                </div>
                <small class="text-muted">Entre 0 y 1440 minutos (24 horas)</small>
              </div>

              <!-- Anticipation presets -->
              <div class="mb-4">
                <label class="form-label small text-muted">Opciones rápidas:</label>
                <div class="d-flex flex-wrap gap-2">
                  <button type="button" class="btn btn-sm btn-outline-secondary"
                          (click)="setAnticipation(0)" [class.active]="form.reminderAnticipation === 0">
                    Sin recordatorio
                  </button>
                  <button type="button" class="btn btn-sm btn-outline-secondary"
                          (click)="setAnticipation(15)" [class.active]="form.reminderAnticipation === 15">
                    15 min
                  </button>
                  <button type="button" class="btn btn-sm btn-outline-secondary"
                          (click)="setAnticipation(30)" [class.active]="form.reminderAnticipation === 30">
                    30 min
                  </button>
                  <button type="button" class="btn btn-sm btn-outline-secondary"
                          (click)="setAnticipation(60)" [class.active]="form.reminderAnticipation === 60">
                    1 hora
                  </button>
                  <button type="button" class="btn btn-sm btn-outline-secondary"
                          (click)="setAnticipation(120)" [class.active]="form.reminderAnticipation === 120">
                    2 horas
                  </button>
                </div>
              </div>

              <!-- Current preference info -->
              @if (currentPreference) {
                <div class="alert alert-light mb-4">
                  <small>
                    <i class="bi bi-info-circle me-1"></i>
                    Preferencia actual: <strong>{{ currentPreference.channelName }}</strong>
                    con recordatorio de <strong>{{ currentPreference.reminderAnticipation }} minutos</strong>
                  </small>
                </div>
              }

              <!-- Buttons -->
              <div class="d-flex gap-2">
                <button type="submit" class="btn btn-success"
                        [disabled]="!preferencesForm.valid || saving">
                  @if (saving) {
                    <span class="spinner-border spinner-border-sm me-2"></span>
                    Guardando...
                  } @else {
                    <i class="bi bi-check-lg me-2"></i>
                    Guardar cambios
                  }
                </button>
                <button type="button" class="btn btn-outline-secondary"
                        (click)="resetForm()" [disabled]="saving">
                  <i class="bi bi-arrow-counterclockwise me-2"></i>
                  Restablecer
                </button>
              </div>
            </form>
          </div>
        </div>
      }
    </div>
  `
})
export class StudentPreferencesComponent implements AfterViewInit {
  private svc = inject(StudentPreferencesService);
  private cdr = inject(ChangeDetectorRef);

  // State
  loading = true;
  saving = false;
  errorMessage: string | null = null;
  successMessage: string | null = null;

  // Data
  channels: NotificationChannelDTO[] = [];
  currentPreference: StudentPreferenceDTO | null = null;

  // Form
  form: StudentPreferenceUpsertRequestDTO = {
    channelId: null as unknown as number,
    reminderAnticipation: 30
  };

  ngAfterViewInit(): void {
    Promise.resolve().then(() => {
      this.loadData();
    });
  }

  loadData(): void {
    this.loading = true;
    this.errorMessage = null;

    // Load channels and current preference in parallel
    Promise.all([
      this.svc.getActiveChannels().toPromise(),
      this.svc.getMyPreference().toPromise()
    ]).then(([channels, preference]) => {
      this.channels = channels || [];

      // Handle the case where preference comes as { preference: null }
      if (preference && 'preference' in preference) {
        this.currentPreference = null;
      } else {
        this.currentPreference = preference as StudentPreferenceDTO | null;
      }

      // Set form values from current preference
      if (this.currentPreference) {
        this.form.channelId = this.currentPreference.channelId;
        this.form.reminderAnticipation = this.currentPreference.reminderAnticipation;
      } else if (this.channels.length > 0) {
        // Default to first channel if no preference exists
        this.form.channelId = this.channels[0].channelId;
      }

      this.loading = false;
      this.cdr.detectChanges();
    }).catch(err => {
      this.errorMessage = err?.message || 'Error al cargar datos';
      this.loading = false;
      this.cdr.detectChanges();
    });
  }

  setAnticipation(minutes: number): void {
    this.form.reminderAnticipation = minutes;
  }

  resetForm(): void {
    if (this.currentPreference) {
      this.form.channelId = this.currentPreference.channelId;
      this.form.reminderAnticipation = this.currentPreference.reminderAnticipation;
    } else if (this.channels.length > 0) {
      this.form.channelId = this.channels[0].channelId;
      this.form.reminderAnticipation = 30;
    }
    this.successMessage = null;
    this.errorMessage = null;
  }

  onSave(): void {
    if (!this.form.channelId || this.form.reminderAnticipation < 0) {
      this.errorMessage = 'Por favor completa todos los campos correctamente';
      return;
    }

    this.saving = true;
    this.errorMessage = null;
    this.successMessage = null;

    this.svc.saveMyPreference(this.form).subscribe({
      next: (response) => {
        this.saving = false;
        this.successMessage = response.message || 'Preferencias guardadas exitosamente';

        // Update current preference to reflect saved values
        const selectedChannel = this.channels.find(c => c.channelId === this.form.channelId);
        this.currentPreference = {
          preferenceId: this.currentPreference?.preferenceId || 0,
          userId: this.currentPreference?.userId || 0,
          channelId: this.form.channelId,
          channelName: selectedChannel?.channelName || '',
          reminderAnticipation: this.form.reminderAnticipation
        };

        this.cdr.detectChanges();

        // Auto-hide success message after 5 seconds
        setTimeout(() => {
          this.successMessage = null;
          this.cdr.detectChanges();
        }, 5000);
      },
      error: (err) => {
        this.saving = false;
        this.errorMessage = err?.message || 'Error al guardar preferencias';
        this.cdr.detectChanges();
      }
    });
  }
}
