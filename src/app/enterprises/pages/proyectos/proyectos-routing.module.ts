import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

// Componentes principales del módulo de Proyectos
import { ProyectosComponent } from './proyectos.component';
import { AddProyectoComponent } from './add-proyecto/add-proyecto.component';
import { EditProyectoComponent } from './edit-proyecto/edit-proyecto.component';
import { DeleteProyectoComponent } from './delete-proyecto/delete-proyecto.component';
import { ProjectDetailsComponent } from './project-details/project-details.component';

/**
 * Rutas internas del módulo de Proyectos.
 */
const routes: Routes = [
  { path: '', component: ProyectosComponent },              // Vista principal de proyectos
  { path: 'add', component: AddProyectoComponent },         // Ruta para añadir un nuevo proyecto
  { path: 'edit/:id', component: EditProyectoComponent },   // Ruta para editar proyecto (por ID)
  { path: 'delete/:id', component: DeleteProyectoComponent }, // Ruta para confirmar eliminación (por ID)
  { path: 'ver/:id', component: ProjectDetailsComponent }   // Ruta para ver detalles (iframe embebido)
];

@NgModule({
  // Importamos RouterModule con las rutas definidas
  imports: [RouterModule.forChild(routes)],
  // Exportamos para que esté disponible en el módulo de proyectos
  exports: [RouterModule]
})
export class ProyectosRoutingModule { }

