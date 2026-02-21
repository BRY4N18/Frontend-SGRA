import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GUser } from '../../../../models/administration/admin-user-management/GUser.model';

@Component({
  selector: 'app-admin-user-table',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './admin-use-table.component.html',
  styleUrl: './admin-use-table.component.css',
})
export class AdminUseTableComponent {
  @Input() users: GUser[] = [];
  @Output() editUser = new EventEmitter<GUser>();
  @Input() isLoading: boolean = true;
  onEditClick(user: GUser) {
    this.editUser.emit(user);
  }
}
