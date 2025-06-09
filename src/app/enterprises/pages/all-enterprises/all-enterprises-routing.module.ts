import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

// Componente principal del módulo AllEnterprises
import { AllEnterprisesComponent } from './all-enterprises.component';

/**
 * Rutas internas del módulo de AllEnterprises.
 * En este caso, solo hay una ruta raíz que carga el componente de listado de todas las empresas.
 */
const routes: Routes = [
  { path: '', component: AllEnterprisesComponent } // Vista principal que muestra el listado de empresas
];

@NgModule({
  // Importamos RouterModule con las rutas definidas para que Angular las reconozca
  imports: [RouterModule.forChild(routes)],
  // Exportamos el módulo de rutas para usarlo en el módulo principal del feature
  exports: [RouterModule]
})
export class AllEnterprisesRoutingModule { }
