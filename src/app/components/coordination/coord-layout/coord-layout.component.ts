import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../services/auth/auth.service';

@Component({
  selector: 'app-coord-layout',
  standalone: true,
  imports: [RouterModule, CommonModule],
  templateUrl: './coord-layout.component.html',
  styleUrls: ['./coord-layout.component.css']
})
export class CoordLayoutComponent implements OnInit {
  private authService = inject(AuthService);

  isSidebarCollapsed = signal(false);
  userName = signal('Coordinador');
  userRoleLabel = signal('Coordinador');

  userInitials = computed(() => {
    const parts = this.userName().trim().split(' ');
    const first = parts[0]?.[0] ?? 'C';
    const second = parts[1]?.[0] ?? '';
    return (first + second).toUpperCase();
  });

  navItems = [
    { path: '/coordinator/dashboard', label: 'Dashboard', icon: 'bi-speedometer2' },
    { path: '/coordinator/dataload', label: 'Carga de Información', icon: 'bi-cloud-arrow-up' },
  ];

  ngOnInit(): void {
    const user = this.authService.currentUser();
    if (user) {
      const fullName = `${user.firstName || ''} ${user.lastName || ''}`.trim();
      this.userName.set(fullName || user.username || 'Coordinador');
      this.userRoleLabel.set('Coordinador');
    }
  }

  toggleSidebar(): void {
    this.isSidebarCollapsed.update(v => !v);
  }

  logout(): void {
    this.authService.logout().subscribe();
  }
}
