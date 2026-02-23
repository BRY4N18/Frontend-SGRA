import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { debounceTime, distinctUntilChanged, combineLatest, startWith } from 'rxjs';
import { GUser } from '../../../models/administration/admin-user-management/GUser.model';
import { AdminUserManagementService } from '../../../services/administration/admin-user-management/admin-user-management.service';
import { AdminUseTableComponent } from './admin-user-table/admin-use-table.component';
import { AdminUserCreateModalComponent } from './admin-user-create-modal/admin-user-create-modal.component';

declare var bootstrap: any;

@Component({
  selector: 'app-admin-user-management',
  standalone: true,
  imports: [CommonModule, AdminUseTableComponent, AdminUserCreateModalComponent, ReactiveFormsModule],
  templateUrl: './admin-user-management.component.html',
  styleUrl: './admin-user-management.component.css',
})
export class AdminUserManagementComponent implements OnInit{
  users: GUser[] = [];
  selectedUserId: number | null = null;
  searchControl = new FormControl('');
  statusControl = new FormControl('');

  private cdr = inject(ChangeDetectorRef);
  private userService = inject(AdminUserManagementService);

  ngOnInit(): void {
    combineLatest([
      this.searchControl.valueChanges.pipe(startWith(''), debounceTime(200), distinctUntilChanged()),
      this.statusControl.valueChanges.pipe(startWith(''))
    ]).subscribe(([filterValue, statusValue]) => {

      let stateParam: boolean | undefined = undefined;
      if (statusValue === 'true') stateParam = true;
      if (statusValue === 'false') stateParam = false;

      this.loadUsers(filterValue || '', stateParam);
    });
  }


  openModal(): void{
    const modalElement = document.getElementById('createUserModal');

    if (modalElement) {
      const modal = new bootstrap.Modal(modalElement);
      modal.show();
    } else {
      console.error('Angular no está dibujando el componente del modal en la pantalla.');
    }
  }

  prepareEdit(user: GUser){
    this.selectedUserId = user.idgu;
    this.openModal();
  }

  prepareCreate() {
    this.selectedUserId = null;
    this.openModal();
  }

  loadUsers(filter = '', state?: boolean): void {
    this.userService.getUsers(filter, undefined, state) .subscribe({
      next: (data) => {
        this.users = data;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error cargando usuarios', err);
      }
    });
  }
}
