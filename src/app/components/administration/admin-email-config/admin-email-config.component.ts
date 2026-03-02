import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { debounceTime, distinctUntilChanged, combineLatest, startWith } from 'rxjs';
import { GEmailConfig } from '../../../models/administration/admin-email-config/GEmailConfig.model';
import { AdminEmailConfigService } from '../../../services/administration/admin-email-config/admin-email-config.service';
import { AdminEmailConfigTableComponent } from './admin-email-config-table/admin-email-config-table.component';
import { AdminEmailConfigModalComponent } from './admin-email-config-modal/admin-email-config-modal.component';

declare var bootstrap: any;

@Component({
  selector: 'app-admin-email-config',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    AdminEmailConfigTableComponent,
    AdminEmailConfigModalComponent,
  ],
  templateUrl: './admin-email-config.component.html',
  styleUrl: './admin-email-config.component.css',
})
export class AdminEmailConfigComponent implements OnInit {
  emailConfigs: GEmailConfig[] = [];
  isLoading = true;
  selectedConfigId: number | null = null;

  searchControl = new FormControl('');
  statusControl = new FormControl('');

  private cdr = inject(ChangeDetectorRef);
  private emailConfigService = inject(AdminEmailConfigService);

  ngOnInit(): void {
    combineLatest([
      this.searchControl.valueChanges.pipe(
        startWith(''),
        debounceTime(200),
        distinctUntilChanged()
      ),
      this.statusControl.valueChanges.pipe(startWith('')),
    ]).subscribe(([filterValue, statusValue]) => {
      let stateParam: boolean | undefined = undefined;
      if (statusValue === 'true') stateParam = true;
      if (statusValue === 'false') stateParam = false;

      this.loadEmailConfigs(filterValue || '', stateParam);
    });
  }

  loadEmailConfigs(filter = '', state?: boolean): void {
    this.isLoading = true;
    this.emailConfigService.getEmailConfigs(filter, state).subscribe({
      next: (data) => {
        this.emailConfigs = data;
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error cargando configuraciones de correo', err);
        this.isLoading = false;
      },
    });
  }

  openModal(): void {
    const modalElement = document.getElementById('emailConfigModal');
    if (modalElement) {
      const modal = new bootstrap.Modal(modalElement);
      modal.show();
    }
  }

  prepareCreate(): void {
    this.selectedConfigId = null;
    this.openModal();
  }

  prepareEdit(config: GEmailConfig): void {
    this.selectedConfigId = config.pidconfiguracioncorreo;
    this.openModal();
  }
}
