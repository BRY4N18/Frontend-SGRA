import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../../services/auth/auth.service';

@Component({
  selector: 'app-work-area-manager-layout',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './work-area-manager-layout.component.html',
  styleUrl: './work-area-manager-layout.component.css',
})
export class WorkAreaManagerLayoutComponent implements OnInit {
  private authService = inject(AuthService);

  isSidebarCollapsed = signal(false);
  userName = signal('Gestor de Espacios');
  userRoleLabel = signal('Gestor de Área');

  userInitials = computed(() => {
    const parts = this.userName().trim().split(' ');
    const first = parts[0]?.[0] ?? 'G';
    const second = parts[1]?.[0] ?? '';
    return (first + second).toUpperCase();
  });

  navItems = [
    { path: '/workAreaManagement/dashboard',          label: 'Dashboard',             icon: 'bi-boxes' },
    { path: '/workAreaManagement/management-requests', label: 'Gestionar Solicitudes', icon: 'bi-clipboard-check' },
  ];

  ngOnInit(): void {
    const user = this.authService.currentUser();
    if (user) {
      const fullName = `${user.firstName || ''} ${user.lastName || ''}`.trim();
      this.userName.set(fullName || user.username || 'Gestor de Espacios');
      this.userRoleLabel.set('Gestor de Área');
    }
  }

  toggleSidebar(): void {
    this.isSidebarCollapsed.update(v => !v);
  }

  logout(): void {
    this.authService.logout().subscribe();
  }
}
