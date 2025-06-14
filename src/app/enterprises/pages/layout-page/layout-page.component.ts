import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';

/**
 * Componente de Layout Principal para el módulo de gestión de empresas.
 * Este componente actúa como contenedor de las páginas hijas tras el login.
 * 
 * - Carga dinámicamente las opciones del menú lateral según el rol del usuario.
 * - Controla el latido del sistema para mantener sesión activa.
 * - Gestiona el cierre de sesión y limpieza de datos locales.
 */
@Component({
  selector: 'app-layout-page',
  templateUrl: './layout-page.component.html',
  styleUrls: ['./layout-page.component.scss']
})
export class LayoutPageComponent implements OnInit {

  public sidebarItems: any[] = [];

  // Datos básicos del usuario, obtenidos del localStorage
  public rolUser = localStorage.getItem('id_rol');
  public nombre_publico = localStorage.getItem('nombre_publico');
  public userID = localStorage.getItem('id_usuario');

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Elementos base del menú lateral
    this.sidebarItems.push({ label: 'Inicio', icon: 'home', url: './main' });
    this.sidebarItems.push({ label: 'Proyectos', icon: 'dashboard', url: './proyectos' });
    this.sidebarItems.push({ label: 'Mi empresa', icon: 'business', url: './empresa' });

    // Añadir opciones adicionales según el rol
    switch (this.rolUser) {
      case '1': // superadmin
      case '2': // admin
        this.sidebarItems.push({ label: 'Gestionar empresas', icon: 'apartment', url: './empresas' });
        break;
    }

    // Todos los usuarios pueden acceder a Soporte
    this.sidebarItems.push({ label: 'Soporte', icon: 'support_agent', url: './soporte' });

    // Iniciar latido para mantener la sesión activa
    this.authService.startHeartbeat();

    // Asegurar envío de latido final al cerrar la pestaña
    window.addEventListener('beforeunload', () => {
      this.authService.sendFinalHeartbeat();
      this.authService.stopHeartbeat();
    });
  }

  /**
   * Cierra sesión del usuario, detiene el latido y redirige al login.
   */
  onLogout(): void {
    this.authService.sendFinalHeartbeat();
    this.authService.stopHeartbeat();
    this.authService.doLogout();
    this.router.navigate(['/auth']);
  }
}
