import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../services/auth/auth.service';

@Component({
  selector: 'app-student-layout',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './student-layout.component.html',
  styleUrls: ['./student-layout.component.css']
})
export class StudentLayoutComponent implements OnInit {
  private authService = inject(AuthService);

  isSidebarCollapsed = signal(false);
  userName = signal('Estudiante');
  userRoleLabel = signal('Estudiante');

  userInitials = computed(() => {
    const parts = this.userName().trim().split(' ');
    const first = parts[0]?.[0] ?? 'E';
    const second = parts[1]?.[0] ?? '';
    return (first + second).toUpperCase();
  });

  navItems = [
    { path: '/student/dashboard', label: 'Dashboard', icon: 'bi-grid' },
    { path: '/student/my-requests', label: 'Mis Solicitudes', icon: 'bi-card-list' },
    { path: '/student/new-request', label: 'Nueva Solicitud', icon: 'bi-plus-square' },
    { path: '/student/history', label: 'Historial', icon: 'bi-clock-history' },
    { path: '/student/preferences', label: 'Preferencias', icon: 'bi-gear' }
  ];

  ngOnInit(): void {
    const user = this.authService.currentUser();
    if (user) {
      const fullName = `${user.firstName || ''} ${user.lastName || ''}`.trim();
      this.userName.set(fullName || user.username || 'Estudiante');
      this.userRoleLabel.set('Estudiante');
    }
  }

  toggleSidebar(): void {
    this.isSidebarCollapsed.update(v => !v);
  }

  logout(): void {
    this.authService.logout().subscribe();
  }
}
