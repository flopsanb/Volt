import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Usuario } from 'src/app/enterprises/interfaces/usuario';
import { UsuarioService } from 'src/app/services/usuario.service';
import { MatSnackBar } from '@angular/material/snack-bar';

/**
 * Componente para confirmar la eliminación de un usuario.
 *
 * - Se abre como modal desde el listado de usuarios.
 * - Verifica que el ID del usuario sea válido antes de proceder.
 * - Llama al servicio para eliminar el usuario por ID.
 * - Muestra notificaciones según el resultado y cierra el modal.
 */
@Component({
  selector: 'app-delete-usuario',
  templateUrl: './delete-usuario.component.html',
  styleUrls: ['./delete-usuario.component.css']
})
export class DeleteUsuarioComponent {

  constructor(
    private dialogRef: MatDialogRef<DeleteUsuarioComponent>, // Referencia para cerrar el modal
    @Inject(MAT_DIALOG_DATA) public data: Usuario,           // Datos del usuario a eliminar
    private usuarioService: UsuarioService,                  // Servicio para eliminar usuario
    private snackBar: MatSnackBar                            // Servicio de notificaciones
  ) {}

  /**
   * Confirma la acción de borrado.
   * - Valida que haya un ID.
   * - Llama al servicio para eliminar.
   * - Muestra mensaje de éxito o error.
   */
  confirmar(): void {
    if (!this.data.id_usuario) {
      this.snackBar.open('❌ ID de usuario no disponible.', 'Cerrar', { duration: 3000 });
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
        this.snackBar.open('Error inesperado al eliminar.', 'Cerrar', { duration: 3000 });
      }
    });
  }

  /**
   * Cancela la operación y cierra el diálogo.
   */
  cancelar(): void {
    this.dialogRef.close({ ok: false });
  }
}
