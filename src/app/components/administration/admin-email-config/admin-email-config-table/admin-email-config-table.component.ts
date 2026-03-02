import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GEmailConfig } from '../../../../models/administration/admin-email-config/GEmailConfig.model';

@Component({
  selector: 'app-admin-email-config-table',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './admin-email-config-table.component.html',
  styleUrl: './admin-email-config-table.component.css',
})
export class AdminEmailConfigTableComponent {
  @Input() emailConfigs: GEmailConfig[] = [];
  @Input() isLoading = true;
  @Output() editEmailConfig = new EventEmitter<GEmailConfig>();

  onEditClick(config: GEmailConfig): void {
    this.editEmailConfig.emit(config);
  }
}
