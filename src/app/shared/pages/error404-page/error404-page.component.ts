import { Component } from '@angular/core';
import { Router } from '@angular/router';

/**
 * Componente de página 404.
 * Se muestra cuando el usuario accede a una ruta no existente.
 * Incluye una opción para redirigir a la pantalla de login.
 */
@Component({
  selector: 'app-error404-page',
  templateUrl: './error404-page.component.html',
  styleUrls: ['./error404-page.component.css']
})
export class Error404PageComponent {
  constructor(private router: Router) {}

  goToLogin() {
    // Método que redirige al usuario a la pantalla de login
    this.router.navigate(['/auth']);
  }
}