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
  templateUrl: './student-preferences.component.html'
})
export class StudentPreferencesComponent implements AfterViewInit {
  private svc = inject(StudentPreferencesService);
  private cdr = inject(ChangeDetectorRef);

  // State
  loading = true;
  saving = false;
  isNewUser = false;
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
      this.svc.getMyPreference().toPromise().catch(() => null)
    ]).then(([channels, preference]) => {
      this.channels = channels || [];

      // Handle null/empty/wrapper responses - student has no preference yet
      if (!preference || (typeof preference === 'object' && 'preference' in preference)) {
        this.currentPreference = null;
        this.isNewUser = true;
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
        this.isNewUser = false;
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
