import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

// Componentes principales del módulo de Proyectos
import { ProyectosComponent } from './proyectos.component';
import { ProjectDetailsComponent } from './project-details/project-details.component';

/**
 * Rutas internas del módulo de Proyectos.
 */
const routes: Routes = [
  { path: '', component: ProyectosComponent },              // Vista principal de proyectos
  { path: 'ver/:id', component: ProjectDetailsComponent }   // Ruta para ver detalles (iframe embebido)
];

@NgModule({
  // Importamos RouterModule con las rutas definidas
  imports: [RouterModule.forChild(routes)],
  // Exportamos para que esté disponible en el módulo de proyectos
  exports: [RouterModule]
})
export class ProyectosRoutingModule { }

