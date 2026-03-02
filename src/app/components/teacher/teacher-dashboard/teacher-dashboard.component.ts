// import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
// import { CommonModule } from '@angular/common';
// import { Router } from '@angular/router';
// import { TeacherRequestsService } from '../../../services/teacher';
// import { AuthService } from '../../../services/auth/auth.service';

// interface DashboardCard {
//   title: string;
//   description: string;
//   icon: string;
//   route: string;
// }

// interface StatCard {
//   label: string;
//   value: number | string;
//   icon: string;
//   subtitle: string;
// }

// @Component({
//   selector: 'app-teacher-dashboard',
//   standalone: true,
//   imports: [CommonModule],
//   templateUrl: './teacher-dashboard.component.html',
//   styleUrl: './teacher-dashboard.component.css',
// })
// export class TeacherDashboardComponent implements OnInit {
//   public authService = inject(AuthService);
//   private router = inject(Router);
//   private reqSvc = inject(TeacherRequestsService);
//   private cdr = inject(ChangeDetectorRef);

//   loading = true;
//   stats: StatCard[] = [];

//   readonly cards: DashboardCard[] = [
//     {
//       title: 'Solicitudes de Refuerzo',
//       description: 'Revisa y responde solicitudes pendientes de estudiantes.',
//       icon: 'bi-inbox',
//       route: '/teacher/requests'
//     },
//     {
//       title: 'Historial de Sesiones',
//       description: 'Consulta todas las sesiones de refuerzo realizadas.',
//       icon: 'bi-clock-history',
//       route: '/teacher/history'
//     }
//   ];

//   ngOnInit(): void {
//     this.loadDashboardData();
//   }

//   private loadDashboardData(): void {
//     // Load all requests to calculate summary counts
//     this.reqSvc.getRequests({ page: 1, size: 100 }).subscribe({
//       next: (data) => {
//         const items = data.items ?? [];
//         const count = (statusId: number) => items.filter(r => r.statusId === statusId).length;
//         this.stats = [
//           { label: 'Pendientes',  value: count(1), icon: 'bi-clock-history',  subtitle: 'Esperando tu respuesta' },
//           { label: 'Aceptadas',   value: count(2), icon: 'bi-check-circle',   subtitle: 'Sesiones programadas' },
//           { label: 'Finalizadas', value: count(5), icon: 'bi-journal-check',  subtitle: 'Sesiones completadas' },
//           { label: 'Total',       value: data.totalCount, icon: 'bi-inbox', subtitle: 'Solicitudes recibidas' },
//         ];
//         this.loading = false;
//         this.cdr.detectChanges();
//       },
//       error: () => {
//         this.stats = [
//           { label: 'Pendientes',  value: '—', icon: 'bi-clock-history', subtitle: 'Sin conexión' },
//           { label: 'Aceptadas',   value: '—', icon: 'bi-check-circle',  subtitle: 'Sin conexión' },
//           { label: 'Finalizadas', value: '—', icon: 'bi-journal-check', subtitle: 'Sin conexión' },
//           { label: 'Total',       value: '—', icon: 'bi-inbox',         subtitle: 'Sin conexión' },
//         ];
//         this.loading = false;
//         this.cdr.detectChanges();
//       }
//     });
//   }

//   navigateTo(route: string): void {
//     this.router.navigate([route]);
//   }
// }
