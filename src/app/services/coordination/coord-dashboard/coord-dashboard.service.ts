import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { environment } from '../../../environments/environment';
import {
  DashboardStats,
  RecentActivity,
  ChartData,
  Notification,
  QuickSummaryWidget
} from '../../../models/coordination/coord-dashboard';

/**
 * Servicio para el Dashboard del Coordinador
 * Proporciona estadísticas, actividad reciente y datos para gráficos
 */
@Injectable({
  providedIn: 'root'
})
export class CoordDashboardService {
  private readonly apiUrl = `${environment.apiUrl}/coordination/dashboard`;

  constructor(/* private http: HttpClient */) {
    // HttpClient se inyectará cuando se integre con el backend
  }

  // ============================================
  // ESTADÍSTICAS GENERALES
  // ============================================

  /**
   * Obtiene las estadísticas principales del dashboard
   */
  getDashboardStats(): Observable<DashboardStats> {
    // TODO: Implementar llamada real al backend
    // return this.http.get<DashboardStats>(`${this.apiUrl}/stats`);

    return of({
      totalEstudiantes: 1250,
      totalDocentes: 85,
      totalEspacios: 42,
      totalReservas: 328,
      reservasHoy: 15,
      reservasPendientes: 7
    });
  }

  /**
   * Obtiene los widgets de resumen rápido
   */
  getQuickSummaryWidgets(): Observable<QuickSummaryWidget[]> {
    // TODO: Implementar llamada real al backend
    // return this.http.get<QuickSummaryWidget[]>(`${this.apiUrl}/widgets`);

    return of([
      { titulo: 'Estudiantes', valor: 1250, icono: 'bi-people', color: 'primary', tendencia: 'up', porcentajeCambio: 5.2 },
      { titulo: 'Docentes', valor: 85, icono: 'bi-person-badge', color: 'success', tendencia: 'stable', porcentajeCambio: 0 },
      { titulo: 'Espacios', valor: 42, icono: 'bi-building', color: 'info', tendencia: 'up', porcentajeCambio: 2 },
      { titulo: 'Reservas Hoy', valor: 15, icono: 'bi-calendar-check', color: 'warning', tendencia: 'down', porcentajeCambio: -3 }
    ]);
  }

  // ============================================
  // ACTIVIDAD RECIENTE
  // ============================================

  /**
   * Obtiene la actividad reciente del sistema
   */
  getRecentActivity(limit: number = 10): Observable<RecentActivity[]> {
    // TODO: Implementar llamada real al backend
    // return this.http.get<RecentActivity[]>(`${this.apiUrl}/activity?limit=${limit}`);

    return of([
      { id: 1, tipo: 'reserva', descripcion: 'Nueva reserva de Laboratorio A', usuario: 'jperez', fecha: new Date(), estado: 'completado' },
      { id: 2, tipo: 'carga', descripcion: 'Carga de 50 estudiantes', usuario: 'admin', fecha: new Date(), estado: 'completado' },
      { id: 3, tipo: 'espacio', descripcion: 'Aula 301 marcada en mantenimiento', usuario: 'mrodriguez', fecha: new Date(), estado: 'pendiente' },
      { id: 4, tipo: 'horario', descripcion: 'Horario de clases actualizado', usuario: 'coordinator', fecha: new Date(), estado: 'completado' },
      { id: 5, tipo: 'reserva', descripcion: 'Reserva cancelada - Auditorio Principal', usuario: 'alopez', fecha: new Date(), estado: 'error' }
    ]);
  }

  // ============================================
  // DATOS PARA GRÁFICOS
  // ============================================

  /**
   * Obtiene datos para el gráfico de reservas por día
   */
  getReservationsByDayChart(): Observable<ChartData> {
    // TODO: Implementar llamada real al backend
    // return this.http.get<ChartData>(`${this.apiUrl}/charts/reservations-by-day`);

    return of({
      labels: ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'],
      datasets: [{
        label: 'Reservas',
        data: [12, 19, 15, 22, 18, 8],
        backgroundColor: '#27ae60',
        borderColor: '#1e8449'
      }]
    });
  }

  /**
   * Obtiene datos para el gráfico de uso de espacios
   */
  getSpaceUsageChart(): Observable<ChartData> {
    // TODO: Implementar llamada real al backend
    // return this.http.get<ChartData>(`${this.apiUrl}/charts/space-usage`);

    return of({
      labels: ['Aulas', 'Laboratorios', 'Auditorios', 'Salas de Reunión'],
      datasets: [{
        label: 'Ocupación %',
        data: [75, 85, 45, 60],
        backgroundColor: ['#3498db', '#e74c3c', '#f39c12', '#9b59b6']
      }]
    });
  }

  /**
   * Obtiene datos para el gráfico de estudiantes por carrera
   */
  getStudentsByCareerChart(): Observable<ChartData> {
    // TODO: Implementar llamada real al backend
    // return this.http.get<ChartData>(`${this.apiUrl}/charts/students-by-career`);

    return of({
      labels: ['Ing. Sistemas', 'Ing. Industrial', 'Administración', 'Contabilidad', 'Derecho'],
      datasets: [{
        label: 'Estudiantes',
        data: [320, 280, 250, 200, 200],
        backgroundColor: ['#27ae60', '#2980b9', '#e74c3c', '#f39c12', '#9b59b6']
      }]
    });
  }

  // ============================================
  // NOTIFICACIONES
  // ============================================

  /**
   * Obtiene las notificaciones del coordinador
   */
  getNotifications(): Observable<Notification[]> {
    // TODO: Implementar llamada real al backend
    // return this.http.get<Notification[]>(`${this.apiUrl}/notifications`);

    return of([
      { id: 1, titulo: 'Nueva reserva pendiente', mensaje: 'El docente Juan Pérez solicita el Laboratorio B', tipo: 'info', leida: false, fecha: new Date() },
      { id: 2, titulo: 'Espacio en mantenimiento', mensaje: 'El Aula 201 estará en mantenimiento hasta el viernes', tipo: 'warning', leida: false, fecha: new Date() },
      { id: 3, titulo: 'Carga exitosa', mensaje: 'Se cargaron 50 estudiantes correctamente', tipo: 'success', leida: true, fecha: new Date() }
    ]);
  }

  /**
   * Marca una notificación como leída
   */
  markNotificationAsRead(id: number): Observable<boolean> {
    // TODO: Implementar llamada real al backend
    // return this.http.patch<boolean>(`${this.apiUrl}/notifications/${id}/read`, {});

    return of(true);
  }

  /**
   * Obtiene el conteo de notificaciones no leídas
   */
  getUnreadNotificationsCount(): Observable<number> {
    // TODO: Implementar llamada real al backend
    // return this.http.get<number>(`${this.apiUrl}/notifications/unread-count`);

    return of(2);
  }
}
