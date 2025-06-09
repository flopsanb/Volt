import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

// Módulos de diseño y componentes reutilizables
import { MaterialModule } from 'src/app/material/material.module';
import { CrudMaterialModule } from 'src/app/modules/crud-material/crud-material.module';

// Componentes del módulo de proyectos
import { ProjectCardComponent } from '../../components/card/project-card.component';
import { ProyectosRoutingModule } from './proyectos-routing.module';
import { ProyectosComponent } from './proyectos.component';
import { AddProyectoComponent } from './add-proyecto/add-proyecto.component';
import { EditProyectoComponent } from './edit-proyecto/edit-proyecto.component';
import { DeleteProyectoComponent } from './delete-proyecto/delete-proyecto.component';
import { ProjectDetailsComponent } from './project-details/project-details.component';

// Pipe para sanitizar URLs en iframes
import { SafeUrlPipe } from 'src/app/auth/pipes/safe-url.pipe';

/**
 * Módulo de gestión de proyectos.
 * Declara los componentes relacionados con la creación, edición, visualización y eliminación de proyectos.
 * Incluye routing específico, componentes de diseño (Material) y formularios reactivos.
 */
@NgModule({
  declarations: [
    ProyectosComponent,           // Página principal de proyectos
    AddProyectoComponent,         // Diálogo para añadir nuevo proyecto
    EditProyectoComponent,        // Diálogo para editar proyecto
    DeleteProyectoComponent,      // Diálogo de confirmación para eliminar
    ProjectCardComponent,         // Tarjeta visual de proyecto individual
    ProjectDetailsComponent,      // Página de visualización de detalles (iframe)
    SafeUrlPipe                   // Pipe para sanitizar URLs incrustadas
  ],
  imports: [
    CommonModule,                 // Módulo base de Angular
    ReactiveFormsModule,          // Formularios reactivos (para Add/Edit)
    MaterialModule,               // Angular Material personalizado
    CrudMaterialModule,           // Componentes CRUD reutilizables
    ProyectosRoutingModule,       // Rutas del módulo
    FormsModule                   // Soporte para ngModel en formularios template-driven
  ],
  exports: [
    SafeUrlPipe                   // Exportamos el Pipe para uso fuera del módulo
  ]
})
export class ProyectosModule { }
