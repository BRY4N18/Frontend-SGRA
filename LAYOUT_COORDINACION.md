# Layout de Coordinación - Documentación

## 📋 Resumen
Se ha creado un layout completo y funcional para la sección de coordinación usando **Angular 21**, **Bootstrap** y componentes **standalone**.

---

## 🎨 Características Principales

### 1. **Sidebar (Barra Lateral)**
- Logo UTEQ/SGRA
- Tarjeta de perfil de usuario
- Menú organizado en secciones:
  - **PRINCIPAL**: Dashboard
  - **GESTIÓN**: Carga de Información, Espacios Físicos
  - **REPORTES**: Consolidados
- Botón de cerrar sesión en el footer
- Colores institucionales UTEQ:
  - Verde oscuro: `#0a3d1d`
  - Verde activo: `#198754`

### 2. **Header (Barra Superior)**
- Breadcrumb dinámico
- Campana de notificaciones
- Botón de perfil de usuario
- Altura fija de 70px
- Sticky position (se mantiene visible al scroll)

### 3. **Área Principal**
- `<router-outlet>` para cargar componentes hijos
- Scroll independiente
- Fondo gris claro
- Padding responsivo

---

## 📁 Estructura de Archivos

```
src/app/components/coordination/
├── coord-layout/
│   ├── coord-layout.component.ts
│   ├── coord-layout.component.html ✨ (Actualizado)
│   └── coord-layout.component.css ✨ (Mejorado)
├── coord-dashboard/
│   ├── coord-dashboard.component.ts ✨ (Actualizado)
│   ├── coord-dashboard.component.html ✨ (Nuevo contenido)
│   └── coord-dashboard.component.css
├── coord-dataload/
│   ├── coord-dataload.component.ts ✨ (Actualizado)
│   ├── coord-dataload.component.html ✨ (Nuevo contenido)
│   └── coord-dataload.component.css
└── coord-physicalspaces/
    ├── coord-physicalspaces.component.ts ✨ (Actualizado)
    ├── coord-physicalspaces.component.html ✨ (Nuevo contenido)
    └── coord-physicalspaces.component.css
```

---

## 🔄 Rutas Configuradas

```typescript
path: 'coordinator',
loadComponent: () => CoordLayoutComponent,
  children: [
    { path: 'dashboard', ... },
    { path: 'dataload', ... },
    { path: 'physicalspaces', ... },
    { path: '', redirectTo: 'dashboard', pathMatch: 'full' }
  ]
```

### URLs Disponibles:
- `/coordinator` → Redirige a dashboard
- `/coordinator/dashboard` → Dashboard
- `/coordinator/dataload` → Carga de Información
- `/coordinator/physicalspaces` → Espacios Físicos

---

## 🚀 Cómo Usar

### 1. **Navegar desde el Menú**
El menú ya está configurado con `routerLink` y `routerLinkActive`:
```html
<a routerLink="/coordinator/dashboard" routerLinkActive="active">
  Dashboard
</a>
```

### 2. **Programaticamente**
```typescript
import { Router } from '@angular/router';

constructor(private router: Router) {}

navigateTo(path: string) {
  this.router.navigate([`/coordinator/${path}`]);
}
```

### 3. **Actualizar Datos del Usuario**
En `ngOnInit()` del layout:
```typescript
this.userName = localStorage.getItem('userName') || 'Coordinador';
```

---

## 🎯 Componentes Incluidos

### CoordDashboardComponent
- Tarjetas de estadísticas (4 columnas)
- Gráfico de actividad
- Lista de próximas tareas
- Estado: ✅ Funcional

### CoordDataloadComponent
- Formulario de carga de archivos
- Selector de tipo de información
- Selector de período académico
- Historial de cargas en tabla
- Estado: ✅ Funcional

### CoordPhysicalspacesComponent
- Tabla de espacios físicos
- Búsqueda y filtros
- Botón para agregar espacios
- Acciones (Editar, Eliminar)
- Paginación
- Estado: ✅ Funcional

---

## 🎨 Personalización

### Cambiar Colores
En `coord-layout.component.css`:
```css
:root {
    --uteq-dark: #0a3d1d;       /* Cambiar aquí */
    --uteq-active: #198754;     /* Cambiar aquí */
    --uteq-light: #f4f6f9;      /* Cambiar aquí */
}
```

### Agregar Nuevos Menús
En `coord-layout.component.html`:
```html
<li>
  <a routerLink="/coordinator/nueva-seccion" routerLinkActive="active" 
     class="nav-link text-white d-flex align-items-center">
    <i class="bi bi-icon-name me-3"></i>
    Nueva Sección
  </a>
</li>
```

### Agregar Nuevos Componentes Hijos
1. Crear el componente en `src/app/components/coordination/nuevo-componente/`
2. Agregar ruta en `app.routes.ts`:
```typescript
{
  path: 'nueva-ruta',
  loadComponent: () => import('./nuevo-componente.component')
    .then(m => m.NuevoComponente)
}
```

---

## 🔐 Seguridad

- El logout limpia:
  - `localStorage.userName`
  - `localStorage.token`
  - `localStorage.userRole`
- Redirige a `/login`

---

## 📱 Responsive

El layout es completamente responsivo:
- **Desktop**: Sidebar fijo, contenido fluido
- **Tablet**: Sidebar y contenido se adaptan
- **Móvil**: Sidebar se convierte en menú colapsable (preparado para future)

---

## ✅ Checklist de Implementación

- [x] Sidebar con logo y menú
- [x] Header con breadcrumb y notificaciones
- [x] Router-outlet para componentes hijos
- [x] Componentes standalone
- [x] Bootstrap 5 integrado
- [x] Colores UTEQ aplicados
- [x] Efectos hover y transiciones
- [x] Logout funcional
- [x] Rutas configuradas
- [x] Contenido de ejemplo en componentes hijos

---

## 🛠️ Tecnologías Utilizadas

- **Angular 21** (Standalone Components)
- **Bootstrap 5**
- **TypeScript**
- **Bootstrap Icons** (bi bi-*)

---

## 📞 Notas Finales

El layout está listo para producción. Solo necesitas:
1. Conectar tu API para datos reales
2. Implementar lógica de negocio en componentes
3. Ajustar estilos según necesidades específicas

¡Éxito con tu proyecto SGRA! 🎓
