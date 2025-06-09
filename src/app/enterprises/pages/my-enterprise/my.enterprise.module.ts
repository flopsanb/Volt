// Módulo: my-enterprise.module.ts
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { MaterialModule } from 'src/app/material/material.module';
import { MyEnterpriseComponent } from './my-enterprise.component';
import { AddUsuarioComponent } from './add-usuario/add-usuario.component';
import { EditUsuarioComponent } from './edit-usuario/edit-usuario.component';
import { DeleteUsuarioComponent } from './delete-usuario/delete-usuario.component';

const routes: Routes = [
  { path: '', component: MyEnterpriseComponent }
];

/**
 * Módulo de gestión de la propia empresa para el usuario autenticado.
 * 
 * Incluye:
 * - Vista principal de empresa.
 * - Gestión de usuarios de su empresa (CRUD).
 */

@NgModule({
  declarations: [
    MyEnterpriseComponent,        // Página principal de la empresa
    AddUsuarioComponent,          // Diálogo para añadir usuario
    EditUsuarioComponent,         // Diálogo para editar usuario
    DeleteUsuarioComponent        // Diálogo para eliminar usuario
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forChild(routes), // Ruta principal ''
    MaterialModule                  // Componentes Angular Material
  ]
})
export class MyEnterpriseModule {}
