import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, RouterOutlet, Router, NavigationEnd } from '@angular/router';
import { Subject, filter, takeUntil } from 'rxjs';

// Servicios y Modelos
import { AuthService } from '../../../services/auth/auth.service';

export interface User {
  id?: string;
  name?: string;
  email?: string;
  role?: string;
}

@Component({
  selector: 'app-coordination-layout',
  standalone: true,
  imports: [CommonModule, RouterModule, RouterOutlet],
  templateUrl: './coord-layout.component.html', // Asegúrate de que el nombre coincida
  styleUrls: ['./coord-layout.component.scss']
})
export class CoordinationLayoutComponent implements OnInit, OnDestroy {

  sidebarCollapsed = false;
  currentUser: User | null = null;
  pendingRequests = 0;
  currentPageTitle = 'Inicio';

  private destroy$ = new Subject<void>();

  // Mapa de rutas a títulos para el breadcrumb
  private readonly pageTitles: Record<string, string> = {
    'dashboard':    'Dashboard',
    'upload':       'Carga de Información Base',
    'ai-ingestion': 'Ingesta Asistida con IA',
    'spaces':       'Gestión de Espacios Físicos',
    'reports':      'Reportes Consolidados',
  };

  constructor(
    private authService: AuthService,
    private router: Router // Inyectamos el Router para detectar cambios de ruta
  ) {}

  ngOnInit(): void {
    const login = this.authService.currentUser();
    // login may be a LoginResponse that contains a `user` or may already be the user object; handle both cases
    this.currentUser = login ? ((login as any).user ?? login) as User : null;
    this.loadPendingRequests();
    this.restoreSidebarState();
    this.listenToRouteChanges(); // Iniciar escucha de navegación
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  toggleSidebar(): void {
    this.sidebarCollapsed = !this.sidebarCollapsed;
    localStorage.setItem('sgra_sidebar_collapsed', String(this.sidebarCollapsed));
  }

  private restoreSidebarState(): void {
    const saved = localStorage.getItem('sgra_sidebar_collapsed');
    if (saved !== null) {
      this.sidebarCollapsed = saved === 'true';
    }
  }

  private loadPendingRequests(): void {
    // Carga las solicitudes pendientes de reserva de aulas
    this.pendingRequests = 0;
  }

  /**
   * Escucha los eventos de navegación para actualizar el título del breadcrumb automáticamente
   */
  private listenToRouteChanges(): void {
    // Detectamos la ruta inicial al cargar
    this.updateTitleFromUrl(this.router.url);

    // Nos suscribimos a futuros cambios de navegación
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd),
      takeUntil(this.destroy$)
    ).subscribe((event: any) => {
      this.updateTitleFromUrl(event.urlAfterRedirects);
    });
  }

  private updateTitleFromUrl(url: string): void {
    const segment = url.split('/').pop() || '';
    this.currentPageTitle = this.pageTitles[segment] ?? 'Coordinación';
  }

  logout(): void {
    this.authService.logout();
  }
}
