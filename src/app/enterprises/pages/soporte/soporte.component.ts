import { Component } from '@angular/core';
import { SoporteService } from 'src/app/services/soporte.service';
import { MatSnackBar } from '@angular/material/snack-bar';

/**
 * Componente de envío de tickets de soporte.
 * Permite al usuario rellenar un formulario con asunto y mensaje para contactar con el equipo técnico.
 * Los datos del usuario (nombre, ID, email) se extraen de `localStorage` para asociar el ticket.
 */
@Component({
  selector: 'app-soporte',
  templateUrl: './soporte.component.html',
  styleUrls: ['./soporte.component.scss']
})
export class SoporteComponent {
  asunto: string = '';
  mensaje: string = '';
  cargando: boolean = false;

  nombre_publico: string | null = '';
  id_usuario: string | null = '';
  id_empresa: string | null = '';
  email: string | null = '';

  constructor(
    private soporteService: SoporteService,
    private snackBar: MatSnackBar
  ) {
    this.nombre_publico = localStorage.getItem('nombre_publico');
    this.id_usuario = localStorage.getItem('id_usuario');
    this.id_empresa = localStorage.getItem('id_empresa');
    this.email = localStorage.getItem('email');
  }

  /**
   * Valida el formulario y envía el ticket al backend mediante el servicio correspondiente.
   */
  enviarTicket(): void {
    if (!this.asunto || !this.mensaje) {
      this.snackBar.open('Rellena todos los campos del ticket', 'Cerrar', { duration: 3000 });
      return;
    }

    this.cargando = true;

    const ticket = {
      asunto: `[Ticket] ${this.asunto}`,
      mensaje: this.mensaje,
      email: this.email ?? ''
    };

    this.soporteService.enviarTicket(ticket).subscribe({
      next: (res) => {
        this.cargando = false;
        if (res.ok) {
          this.snackBar.open('Ticket enviado correctamente', 'Cerrar', { duration: 3000 });
          this.asunto = '';
          this.mensaje = '';
        } else {
          this.snackBar.open('Error al enviar el ticket', 'Cerrar', { duration: 3000 });
        }
      },
      error: () => {
        this.cargando = false;
        this.snackBar.open('Fallo al conectar con soporte', 'Cerrar', { duration: 3000 });
      }
    });
  }
}
