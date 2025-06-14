import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { EnterprisesService } from 'src/app/services/enterprises.service';

/**
 * Componente que representa la pantalla principal tras el login.
 * Muestra un mensaje de bienvenida personalizado con el nombre del usuario y su empresa.
 */
@Component({
  selector: 'app-main-page',
  templateUrl: './main-page.component.html',
  styleUrls: ['./main-page.component.scss']
})
export class MainPageComponent implements OnInit {
  idEmpresa = Number(localStorage.getItem('id_empresa'));           // ID de empresa extraído del almacenamiento local
  nombreUsuario = localStorage.getItem('nombre_publico');           // Nombre del usuario autenticado
  nombreEmpresa: string = '';                                       // Nombre de la empresa recuperado del backend

  constructor(
    private router: Router,
    private enterpriseService: EnterprisesService
  ) {}

  /**
   * Al inicializar el componente, se realiza una petición al backend
   * para obtener el nombre de la empresa correspondiente al usuario autenticado.
   */
  ngOnInit(): void {
    this.enterpriseService.getMyEmpresas().subscribe({
      next: (empresa) => {
        this.nombreEmpresa = empresa?.data.nombre_empresa ?? 'tu empresa';
      },
      error: () => {
        this.nombreEmpresa = 'tu empresa';
      }
    });
  }
}
