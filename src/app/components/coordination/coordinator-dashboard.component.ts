import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth/auth.service';

@Component({
  selector: 'app-coordinator-dashboard',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="dashboard-container">
      <div class="dashboard-card">
        <div class="dashboard-header coordinator">
          <h1>Pantalla Coordinador</h1>
        </div>
        <div class="dashboard-content">
          <p class="welcome-text">
            Bienvenido, <strong>{{ authService.currentUser()?.firstName }} {{ authService.currentUser()?.lastName }}</strong>
          </p>
          <p class="role-badge coordinator">ROL: COORDINADOR</p>
          <p class="info-text">Esta es la pantalla principal del coordinador.</p>
          <button class="btn-logout" (click)="logout()">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
              <polyline points="16 17 21 12 16 7"/>
              <line x1="21" y1="12" x2="9" y2="12"/>
            </svg>
            Cerrar Sesion
          </button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .dashboard-container {
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 20px;
      background: #f0f2f5;
    }
    .dashboard-card {
      width: 100%;
      max-width: 500px;
      background: white;
      border-radius: 16px;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
      overflow: hidden;
    }
    .dashboard-header {
      padding: 32px 24px;
      text-align: center;
      color: white;
    }
    .dashboard-header.coordinator {
      background: linear-gradient(135deg, #6a1b9a 0%, #8e24aa 100%);
    }
    .dashboard-header h1 {
      margin: 0;
      font-size: 1.5rem;
      font-weight: 600;
    }
    .dashboard-content {
      padding: 32px 24px;
      text-align: center;
    }
    .welcome-text {
      font-size: 1.1rem;
      color: #333;
      margin-bottom: 16px;
    }
    .role-badge {
      display: inline-block;
      padding: 8px 20px;
      border-radius: 20px;
      font-size: 0.85rem;
      font-weight: 600;
      color: white;
      margin-bottom: 20px;
    }
    .role-badge.coordinator {
      background: #6a1b9a;
    }
    .info-text {
      color: #666;
      font-size: 0.95rem;
      margin-bottom: 24px;
    }
    .btn-logout {
      display: inline-flex;
      align-items: center;
      gap: 10px;
      padding: 12px 28px;
      font-size: 1rem;
      font-weight: 500;
      color: white;
      background: #d32f2f;
      border: none;
      border-radius: 8px;
      cursor: pointer;
      transition: all 0.2s ease;
    }
    .btn-logout:hover {
      background: #b71c1c;
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(211, 47, 47, 0.3);
    }
    .btn-logout svg {
      width: 20px;
      height: 20px;
    }
  `]
})
export class CoordinatorDashboardComponent {
  constructor(public authService: AuthService) {}

  logout(): void {
    this.authService.logout().subscribe();
  }
}

