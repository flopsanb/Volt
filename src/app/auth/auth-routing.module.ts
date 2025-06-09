import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { LayoutPageComponent } from './pages/layout-page/layout-page.component';
import { LoginPageComponent } from './pages/login-page/login-page.component';

/**
 * Módulo de rutas de autenticación.
 * Define las rutas disponibles dentro del módulo Auth (login, layout, etc.)
 */
const routes: Routes = [
    {
        path: '',
        component: LayoutPageComponent, // Contenedor visual de autenticación
        children: [
            { path: 'login', component: LoginPageComponent }, // Página de login
            { path: '**', redirectTo: 'login' } // Cualquier otra ruta se redirige al login
        ]
    }
];

@NgModule({
    imports: [ RouterModule.forChild(routes)],
    exports: [RouterModule],
})

export class AuthRoutingModule { }