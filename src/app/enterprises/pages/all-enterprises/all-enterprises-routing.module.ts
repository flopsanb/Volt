import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

// Componente principal del módulo AllEnterprises
import { AllEnterprisesComponent } from './all-enterprises.component';

/**
 * Rutas internas del módulo de AllEnterprises.
 * En este caso, solo hay una ruta raíz que carga el componente de listado de todas las empresas.
 */
const routes: Routes = [
  { path: '', component: AllEnterprisesComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AllEnterprisesRoutingModule { }
