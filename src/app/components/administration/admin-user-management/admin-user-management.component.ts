import { User } from './../../coordination/coord-layout/coord-layout.component.spec';
import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GUser } from '../../../models/administration/admin-user-management/GUser.model';
import { AdminUserManagementService } from '../../../services/administration/admin-user-management/admin-user-management.service';
import { AdminUseTableComponent } from './admin-user-table/admin-use-table.component';
import { AdminUserCreateModalComponent } from './admin-user-create-modal/admin-user-create-modal.component';

declare var bootstrap: any;

@Component({
  selector: 'app-admin-user-management',
  standalone: true,
  imports: [CommonModule, AdminUseTableComponent, AdminUserCreateModalComponent],
  templateUrl: './admin-user-management.component.html',
  styleUrl: './admin-user-management.component.css',
})
export class AdminUserManagementComponent implements OnInit{
  users: GUser[] = [];
  selectedUserId: number | null = null;

  private cdr = inject(ChangeDetectorRef);
  private userService = inject(AdminUserManagementService);

  ngOnInit(): void {
    this.loadUsers();
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

  loadUsers(): void {
    this.userService.getUsers().subscribe({
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
