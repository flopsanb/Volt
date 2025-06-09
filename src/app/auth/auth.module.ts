import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthComponent } from './auth.component';
import { AuthRoutingModule } from './auth-routing.module';
import { LayoutPageComponent } from './pages/layout-page/layout-page.component';
import { LoginPageComponent } from './pages/login-page/login-page.component';
import { MaterialModule } from '../material/material.module';
import { ReactiveFormsModule } from '@angular/forms';
import { RegisterDialogComponent } from './components/register-dialog/register-dialog.component';
import { FormsModule } from '@angular/forms';

/**
 * Módulo principal de autenticación.
 * Carga los componentes, formularios y módulos necesarios para gestionar el login.
 */
@NgModule({
  declarations: [
    AuthComponent,
    LayoutPageComponent,
    LoginPageComponent,       // Página del login donde se introduce el usuario
    RegisterDialogComponent   // Diálogo modal donde se introduce la contraseña
  ],
  imports: [
    CommonModule,
    AuthRoutingModule,        // Rutas del módulo de autenticación
    MaterialModule,
    ReactiveFormsModule,
    FormsModule
  ]
})

export class AuthModule { }