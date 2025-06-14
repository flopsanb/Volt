import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { LayoutPageComponent } from './pages/layout-page/layout-page.component';
import { MainPageComponent } from './pages/main-page/main-page.component';
import { SoporteComponent } from './pages/soporte/soporte.component';
import { Error404PageComponent } from '../shared/pages/error404-page/error404-page.component';

/**
 * Rutas internas del módulo 'enterprises'.
 * Todas están contenidas dentro del LayoutPageComponent como componente base.
 */
const routes: Routes = [
  {
    path: '',
    component: LayoutPageComponent, // Contenedor común para todas las vistas privadas
    children: [
      { path: '', redirectTo: 'main', pathMatch: 'full' }, // Redirección por defecto

      // Ruta al panel principal
      { path: 'main', component: MainPageComponent },

      // Rutas cargadas dinámicamente (lazy loading)
      { path: 'empresa', loadChildren: () => import('./pages/my-enterprise/my.enterprise.module').then(m => m.MyEnterpriseModule) },
      { path: 'empresas', loadChildren: () => import('./pages/all-enterprises/all-enterprises.module').then(m => m.AllEnterprisesModule) },
      { path: 'proyectos', loadChildren: () => import('./pages/proyectos/proyectos.module').then(m => m.ProyectosModule) },

      // Rutas directas
      { path: 'soporte', component: SoporteComponent },

      // Ruta para manejar errores 404 dentro del módulo
      { path: '**', component: Error404PageComponent }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EnterprisesRoutingModule { }
