/**
 * Estadísticas del Dashboard del Coordinador
 */
export interface DashboardStats {
  totalEstudiantes: number;
  totalDocentes: number;
  totalEspacios: number;
  totalReservas: number;
  reservasHoy: number;
  reservasPendientes: number;
}

/**
 * Resumen de actividad reciente
 */
export interface RecentActivity {
  id: number;
  tipo: 'reserva' | 'carga' | 'espacio' | 'horario';
  descripcion: string;
  usuario: string;
  fecha: Date;
  estado: 'completado' | 'pendiente' | 'error';
}

/**
 * Datos para gráficos del dashboard
 */
export interface ChartData {
  labels: string[];
  datasets: ChartDataset[];
}

export interface ChartDataset {
  label: string;
  data: number[];
  backgroundColor?: string | string[];
  borderColor?: string;
}

/**
 * Notificación del sistema
 */
export interface Notification {
  id: number;
  titulo: string;
  mensaje: string;
  tipo: 'info' | 'warning' | 'error' | 'success';
  leida: boolean;
  fecha: Date;
}

/**
 * Widget de resumen rápido
 */
export interface QuickSummaryWidget {
  titulo: string;
  valor: number | string;
  icono: string;
  color: 'primary' | 'success' | 'warning' | 'danger' | 'info';
  tendencia?: 'up' | 'down' | 'stable';
  porcentajeCambio?: number;
}
