import { Component, inject, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
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

  // Variables para mostrar en la vista
  currentYear: number = new Date().getFullYear();
  userName: string = '';
  isSidebarCollapsed: boolean = false;

  public authService = inject(AuthService);

  ngOnInit(): void {
    // Obtener el nombre del usuario desde localStorage o usar un valor por defecto
    this.userName = localStorage.getItem('userName') || 'Coordinador';
  }

  /**
   * Método para cerrar sesión
   * Limpia el almacenamiento local y redirige al login
   */
  logout(): void {
    this.authService.logout().subscribe();
  }

  /**
   * Método opcional para ocultar/mostrar menú en móviles
   */
  toggleSidebar(): void {
    this.isSidebarCollapsed = !this.isSidebarCollapsed;
  }
}
