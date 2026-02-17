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
    loadComponent: () => import('./components/administration/admin-dashboard.component').then(m => m.AdminDashboardComponent),
    canActivate: [authGuard, roleGuard(['admin', 'administrador'])]
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
    redirectTo: 'login'
  }
];
