import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from 'src/app/material/material.module';
import { EnterprisesDetailsComponent } from './enterprises-details.component';
import { AddUsuarioComponent } from './add-usuario/add-usuario.component';
import { EditUsuarioComponent } from './edit-usuario/edit-usuario.component';
import { DeleteUsuarioComponent } from './delete-usuario/delete-usuario.component';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    EnterprisesDetailsComponent,
    AddUsuarioComponent,
    EditUsuarioComponent,
    DeleteUsuarioComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MaterialModule,
    FormsModule
  ]
})
export class EnterprisesDetailsModule {}