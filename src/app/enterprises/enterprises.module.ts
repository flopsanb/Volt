import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EnterprisesRoutingModule } from './enterprises-routing.module';

import { MaterialModule } from '../material/material.module';
import { CrudMaterialModule } from '../modules/crud-material/crud-material.module';
import { ReactiveFormsModule } from '@angular/forms';

import { LayoutPageComponent } from './pages/layout-page/layout-page.component';
import { MainPageComponent } from './pages/main-page/main-page.component';
import { SoporteComponent } from './pages/soporte/soporte.component';
import { LogsComponent } from './pages/logs/logs.component';
import { ConfirmDialogComponent } from './components/confirm-dialog/confirm-dialog.component';

import { AllEnterprisesModule } from './pages/all-enterprises/all-enterprises.module';
import { MyEnterpriseModule } from './pages/my-enterprise/my.enterprise.module';
import { ProyectosModule } from './pages/proyectos/proyectos.module';

/**
 * Módulo principal de gestión de empresas y proyectos.
 * Agrupa componentes, submódulos y configuraciones de rutas internas.
 */
@NgModule({
  declarations: [
    LayoutPageComponent,         // Contenedor base para las vistas del módulo
    ConfirmDialogComponent,      // Diálogo de confirmación reutilizable
    MainPageComponent,           // Página de inicio tras el login
    SoporteComponent,            // Vista para enviar tickets de soporte
    LogsComponent                // Vista de registros de Logs (No implementado)
  ],
  imports: [
    CommonModule,
    EnterprisesRoutingModule,    // Rutas declaradas en el archivo de routing
    MaterialModule,              
    ReactiveFormsModule,         
    CrudMaterialModule,          // Componentes CRUD reutilizables
    AllEnterprisesModule,        // Submódulo para vista de administración de empresas
    MyEnterpriseModule,          // Submódulo para vista privada de empresa del usuario
    ProyectosModule              // Submódulo para gestión de proyectos
  ],
})

export class EnterprisesModule { }
