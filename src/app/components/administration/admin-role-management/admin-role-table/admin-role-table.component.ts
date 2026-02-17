import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GRole } from '../../../../models/administration/admin-role-management/GRole.model';

@Component({
  selector: 'app-admin-role-table',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './admin-role-table.component.html',
  styleUrl: './admin-role-table.component.css',
})
export class AdminRoleTableComponent {
  @Input() roles: GRole[] = [];
  @Input() isLoading: boolean = true;
}
