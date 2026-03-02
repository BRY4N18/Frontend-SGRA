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

  expandedSchemas = new Set<number>();

  toggleSchema(index: number): void {
    if (this.expandedSchemas.has(index)) {
      this.expandedSchemas.delete(index);
    } else {
      this.expandedSchemas.add(index);
    }
  }

  isExpanded(index: number): boolean {
    return this.expandedSchemas.has(index);
  }

  onToggleChange(): void {
    this.permissionChanged.emit();
  }
}
