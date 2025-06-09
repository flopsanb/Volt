import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Usuario } from 'src/app/enterprises/interfaces/usuario';
import { UsuarioService } from 'src/app/services/usuario.service';
import { MatSnackBar } from '@angular/material/snack-bar';

/**
 * Componente para confirmar y eliminar un usuario.
 * 
 * - Se muestra como modal emergente desde el listado de usuarios.
 * - Recibe el objeto `Usuario` a eliminar mediante inyección de datos.
 * - Ejecuta la eliminación del usuario en la base de datos mediante el servicio.
 * - Informa del resultado con notificaciones visuales (snackbar).
 */
@Component({
  selector: 'app-delete-usuario',
  templateUrl: './delete-usuario.component.html',
  styleUrls: ['./delete-usuario.component.css']
})
export class DeleteUsuarioComponent {

  constructor(
    public dialogRef: MatDialogRef<DeleteUsuarioComponent>, // Referencia al diálogo abierto
    @Inject(MAT_DIALOG_DATA) public data: Usuario,           // Usuario recibido como dato para eliminar
    private usuarioService: UsuarioService,                  // Servicio de usuarios
    private snackBar: MatSnackBar                            // Snackbar para mostrar notificaciones
  ) {}

  /**
   * Confirma la eliminación del usuario.
   * - Verifica que el ID sea válido.
   * - Llama al servicio `deleteUsuario`.
   * - Muestra el resultado con snackbar.
   * - Cierra el modal con el estado del resultado.
   */
  confirmar(): void {
    if (!this.data.id_usuario) {
      this.snackBar.open('❌ ID de usuario no válido', 'Cerrar', { duration: 3000 });
      this.dialogRef.close({ ok: false });
      return;
    }

    this.usuarioService.deleteUsuario(this.data.id_usuario).subscribe({
      next: (res) => {
        if (res.ok) {
          this.snackBar.open('✅ Usuario eliminado correctamente.', 'Cerrar', { duration: 3000 });
          this.dialogRef.close({ ok: true });
        } else {
          this.snackBar.open('❌ Error al eliminar usuario.', 'Cerrar', { duration: 3000 });
        }
      },
      error: () => {
        this.snackBar.open('❌ Fallo al conectar con el servidor.', 'Cerrar', { duration: 3000 });
      }
    });
  }

  /**
   * Cierra el diálogo sin realizar ninguna acción.
   * - Se invoca al pulsar "Cancelar".
   */
  cancelar(): void {
    this.dialogRef.close({ ok: false });
  }
}
