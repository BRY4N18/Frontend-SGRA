import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GRoleSimple } from '../../../../models/administration/admin-permission-management/GRoleSimple';
import { GRoleServer, GRoleApp, GRolesAppServerCUD } from '../../../../models/administration/admin-role-management/GAppRoleServers';
import { AdminRoleManagementService } from '../../../../services/administration/admin-role-management/admin-role-management.service';

@Component({
  selector: 'app-admin-role-management-server-connection',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './admin-role-management-server-connection.component.html',
  styleUrl: './admin-role-management-server-connection.component.css',
})
export class AdminRoleManagementServerConnectionComponent {
  matrixData: GRoleApp[] = [];

  private roleService = inject(AdminRoleManagementService);

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    this.roleService.getRoleServerMatrix().subscribe({
      next: (data) => {
        this.matrixData = data;
      },
      error: (err) => {
        console.error('Error cargando la matriz', err);
      }
    });
  }

  toggleRole(connection: GRoleServer, event: Event): void {
    connection.prelacion = (event.target as HTMLInputElement).checked;
  }

  saveConnections(): void {

    const payload: GRolesAppServerCUD[] = this.matrixData.map(appRole => {
      return {
        roleAppGId: appRole.pidrol,
        serverRoleIds: appRole.grolesconection
                        .filter(conn => conn.prelacion)
                        .map(conn => conn.pidgrol)
      };
    });

    console.log('JSON a enviar al backend:', payload);

    this.roleService.updateServerMappings(payload).subscribe({
      next: (response) => {
        if (response.success) {
          alert('Conexiones guardadas exitosamente.');
        } else {
          alert(response.message);
        }
      },
      error: (err) => {
        console.error(err);
        alert('Error al guardar las conexiones.');
      }
    });
  }
}
