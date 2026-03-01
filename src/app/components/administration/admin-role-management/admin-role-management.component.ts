import { Component, OnInit, inject, ChangeDetectorRef} from '@angular/core';
import { CommonModule } from '@angular/common';
import { GRole } from '../../../models/administration/admin-role-management/GRole.model';
import { AdminRoleManagementService } from '../../../services/administration/admin-role-management/admin-role-management.service';
import { AdminRoleTableComponent } from './admin-role-table/admin-role-table.component';
import { AdminRoleCreateModalComponent } from './admin-role-create-modal/admin-role-create-modal.component';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { debounceTime, distinctUntilChanged, combineLatest, startWith } from 'rxjs';
import { AdminRoleManagementServerConnectionComponent } from "./admin-role-management-server-connection/admin-role-management-server-connection.component";

declare var bootstrap: any;

@Component({
  selector: 'app-admin-role-management',
  standalone: true,
  imports: [
    CommonModule,
    AdminRoleTableComponent,
    AdminRoleCreateModalComponent,
    ReactiveFormsModule,
    AdminRoleManagementServerConnectionComponent
],
  templateUrl: './admin-role-management.component.html',
  styleUrl: './admin-role-management.component.css',
})
export class AdminRoleManagementComponent implements OnInit {
  roles: GRole[] = [];
  isLoading: boolean = true;
  selectedRoleToEdit: GRole | null = null;

  searchControl = new FormControl('');
  statusControl = new FormControl('');

  private cdr = inject(ChangeDetectorRef);
  private roleService = inject(AdminRoleManagementService);

  ngOnInit(): void {
    combineLatest([
      this.searchControl.valueChanges.pipe(
        startWith(''),
        debounceTime(200),
        distinctUntilChanged(),
      ),
      this.statusControl.valueChanges.pipe(startWith('')),
    ]).subscribe(([filterValue, statusValue]) => {
      let stateParam: boolean | undefined = undefined;
      if (statusValue === 'true') stateParam = true;
      if (statusValue === 'false') stateParam = false;

      this.loadRoles(filterValue || '', stateParam);
    });
  }

  loadRoles(filter: string = '', state?: boolean): void {
    this.isLoading = true;
    this.roleService.getRoles(filter,state).subscribe({
      next: (data) => {
        this.roles = data;
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error', err);
        this.isLoading = false;
      },
    });
  }

  openModal(): void {
    const modalElement = document.getElementById('createRoleModal');
    if (modalElement) {
      const modal = new bootstrap.Modal(modalElement);
      modal.show();
    }
  }

  prepareCreate() {
    this.selectedRoleToEdit = null;
    this.openModal();
  }

  prepareEdit(role: GRole) {
    this.selectedRoleToEdit = { ...role };
    this.openModal();
  }
}
