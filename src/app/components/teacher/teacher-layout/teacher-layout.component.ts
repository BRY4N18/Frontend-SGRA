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
  userName: string = 'Docente';

  public authService = inject(AuthService);

  logout(): void {
    this.authService.logout().subscribe();
  }
}
