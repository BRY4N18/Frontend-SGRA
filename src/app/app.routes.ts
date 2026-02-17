import { Component } from '@angular/core';
import { Routes } from '@angular/router';
import { authGuard, loginGuard, roleGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  {
    path: 'login',
    loadComponent: () => import('./components/auth/login.component').then(m => m.LoginComponent),
    canActivate: [loginGuard]
  },
  {
    path: 'admin',
    loadComponent: () => import('./components/administration/admin-layout/admin-layout.component').then(m => m.AdminLayoutComponent),
    canActivate: [authGuard, roleGuard(['admin', 'administrador'])],
    children: [
      {
        path: 'dashboard',
        loadComponent: () => import('./components/administration/admin-dashboard/admin-dashboard.component').then(m => m.AdminDashboardComponent)
      },
      {
        path: 'users',
        loadComponent: () => import('./components/administration/admin-user-management/admin-user-management.component').then(m => m.AdminUserManagementComponent)
      },
      {
        path: 'master-tables',
        loadComponent: () => import('./components/administration/admin-master-tables/admin-master-tables.component').then(m => m.AdminMasterTablesComponent)
      },
      {
        path: 'permissions',
        loadComponent: () => import('./components/administration/admin-permission-management/admin-permission-management.component').then(m => m.AdminPermissionManagementComponent)
      },
      {
        path: 'roles',
        loadComponent: () => import('./components/administration/admin-role-management/admin-role-management.component').then(m => m.AdminRoleManagementComponent)
      },
      { path: '', redirectTo: 'dashboard', pathMatch: 'full'}
    ]
  },
  {
    path: 'teacher',
    loadComponent: () => import('./components/teacher/teacher-dashboard.component').then(m => m.TeacherDashboardComponent),
    canActivate: [authGuard, roleGuard(['teacher', 'docente'])]
  },
  {
    path: 'student',
    loadComponent: () => import('./components/student/student-dashboard.component').then(m => m.StudentDashboardComponent),
    canActivate: [authGuard, roleGuard(['student', 'estudiante'])]
  },
  {
    path: 'coordinator',
    loadComponent: () => import('./components/coordination/coordinator-dashboard.component').then(m => m.CoordinatorDashboardComponent),
    canActivate: [authGuard, roleGuard(['coordinator', 'coordinador'])]
  },
  {
    path: '**',
    redirectTo: '/login'
  }
];
