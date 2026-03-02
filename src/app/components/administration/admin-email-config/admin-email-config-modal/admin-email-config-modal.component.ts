import { Component, EventEmitter, Input, Output, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AdminEmailConfigService } from '../../../../services/administration/admin-email-config/admin-email-config.service';
import { AuthService } from '../../../../services/auth/auth.service';

declare var bootstrap: any;

@Component({
  selector: 'app-admin-email-config-modal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './admin-email-config-modal.component.html',
  styleUrl: './admin-email-config-modal.component.css',
})
export class AdminEmailConfigModalComponent {
  @Output() emailConfigSaved = new EventEmitter<void>();

  emailForm: FormGroup;
  isSubmitting = false;
  isEditing = false;
  currentConfigId: number | null = null;
  showPassword = false;

  private fb = inject(FormBuilder);
  private emailConfigService = inject(AdminEmailConfigService);
  private authService = inject(AuthService);

  constructor() {
    this.emailForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      appPassword: ['', [Validators.required, Validators.minLength(8)]],
      status: ['activo'],
    });
  }

  @Input() set configIdToEdit(id: number | null) {
    const passwordControl = this.emailForm.get('appPassword');

    if (id) {
      this.isEditing = true;
      this.currentConfigId = id;

      passwordControl?.clearValidators();
      passwordControl?.setValidators([Validators.minLength(8)]);
      passwordControl?.updateValueAndValidity();

      this.emailConfigService.getEmailConfigById(id).subscribe({
        next: (data) => {
          this.emailForm.patchValue({
            email: data.correo,
            appPassword: data.contrasenaApp,
            status: data.estado.toLowerCase() === 'activo' ? 'activo' : 'inactivo',
          });
        },
        error: () => {
          alert('No se pudo cargar la información del correo.');
        },
      });
    } else {
      this.isEditing = false;
      this.currentConfigId = null;
      this.emailForm.reset({ status: 'activo' });

      passwordControl?.setValidators([Validators.required, Validators.minLength(8)]);
      passwordControl?.updateValueAndValidity();
    }
  }

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  onSubmit(): void {
    if (this.emailForm.invalid) {
      this.emailForm.markAllAsTouched();
      return;
    }

    this.isSubmitting = true;
    const formValues = this.emailForm.value;
    const currentUser = this.authService.currentUser();

    const payload = {
      pidconfiguracioncorreo: this.isEditing ? (this.currentConfigId ?? undefined) : undefined,
      idusuario: currentUser?.userId ?? 0,
      pcorreoemisor: formValues.email,
      paplicacionsontrasena: formValues.appPassword,
    };

    const request$ = this.isEditing
      ? this.emailConfigService.updateEmailConfig(payload)
      : this.emailConfigService.createEmailConfig(payload);

    request$.subscribe({
      next: (response) => {
        if (response.success) {
          alert(response.message);
          const modalElement = document.getElementById('emailConfigModal');
          if (modalElement) {
            bootstrap.Modal.getInstance(modalElement)?.hide();
          }
          this.emailForm.reset({ status: 'activo' });
          this.emailConfigSaved.emit();
        } else {
          alert(response.message);
        }
        this.isSubmitting = false;
      },
      error: () => {
        this.isSubmitting = false;
        alert(this.isEditing ? 'Error al actualizar la configuración' : 'Error al crear la configuración');
      },
    });
  }

  get f() {
    return this.emailForm.controls;
  }
}
