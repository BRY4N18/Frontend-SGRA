import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { GSchemaPermission } from '../../../../models/administration/admin-permission-management/GSchemaPermission';

@Component({
  selector: 'app-admin-permission-matrix',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-permission-matrix.component.html',
  styleUrl: './admin-permission-matrix.component.css',
})
export class AdminPermissionMatrixComponent {
  @Input() schemas: GSchemaPermission[] = [];
  @Output() permissionChanged = new EventEmitter<void>();
  onToggleChange(): void {
    this.permissionChanged.emit();
  }
}
