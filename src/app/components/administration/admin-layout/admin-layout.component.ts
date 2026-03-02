import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../../services/auth/auth.service';

@Component({
  selector: 'app-admin-layout',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './admin-layout.component.html',
  styleUrl: './admin-layout.component.css',
})
export class AdminLayoutComponent implements OnInit {
  private authService = inject(AuthService);

  isSidebarCollapsed = signal(false);
  userName = signal('Administrador');
  userRoleLabel = signal('Administrador');

  userInitials = computed(() => {
    const parts = this.userName().trim().split(' ');
    const first = parts[0]?.[0] ?? 'A';
    const second = parts[1]?.[0] ?? '';
    return (first + second).toUpperCase();
  });

  navItems = [
    { path: '/admin/dashboard',     label: 'Dashboard',       icon: 'bi-boxes' },
    { path: '/admin/users',         label: 'Usuarios',        icon: 'bi-people' },
    { path: '/admin/roles',         label: 'Roles',           icon: 'bi-person-badge' },
    { path: '/admin/permissions',   label: 'Permisos',        icon: 'bi-shield-lock' },
    { path: '/admin/master-tables', label: 'Tablas Maestras', icon: 'bi-table' },
  ];

  ngOnInit(): void {
    const user = this.authService.currentUser();
    if (user) {
      const fullName = `${user.firstName || ''} ${user.lastName || ''}`.trim();
      this.userName.set(fullName || user.username || 'Administrador');
      this.userRoleLabel.set('Administrador');
    }
  }

  toggleSidebar(): void {
    this.isSidebarCollapsed.update(v => !v);
  }

  logout(): void {
    this.authService.logout().subscribe();
  }
}
