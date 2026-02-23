import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../../services/auth/auth.service';

@Component({
  selector: 'app-teacher-layout',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './teacher-layout.component.html',
  styleUrl: './teacher-layout.component.css',
})
export class TeacherLayoutComponent {
  public authService = inject(AuthService);

  showDropdown = false;

  get userName(): string {
    const user = this.authService.currentUser();
    if (user?.firstName && user?.lastName) {
      return `${user.firstName} ${user.lastName}`;
    }
    return 'Docente';
  }

  get userInitials(): string {
    const user = this.authService.currentUser();
    const f = user?.firstName?.[0] ?? '';
    const l = user?.lastName?.[0] ?? '';
    return (f + l).toUpperCase() || 'D';
  }

  toggleDropdown(): void {
    this.showDropdown = !this.showDropdown;
  }

  closeDropdown(): void {
    this.showDropdown = false;
  }

  logout(): void {
    this.authService.logout().subscribe();
  }
}
