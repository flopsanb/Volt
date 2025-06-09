import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Enterprise } from 'src/app/enterprises/interfaces/enterprise.interface';
import { EnterprisesService } from 'src/app/services/enterprises.service';
import { MatSnackBar } from '@angular/material/snack-bar';

/**
 * Componente para confirmar y eliminar una empresa.
 *
 * - Se muestra como un diálogo modal.
 * - Recibe la empresa seleccionada para eliminar.
 * - Envía la solicitud al backend y muestra notificaciones.
 */
@Component({
  selector: 'app-delete-enterprise',
  templateUrl: './delete-enterprise.component.html',
  styleUrls: ['./delete-enterprise.component.css']
})
export class DeleteEnterpriseComponent {

  constructor(
    public dialogRef: MatDialogRef<DeleteEnterpriseComponent>,  // Referencia al diálogo para cerrarlo manualmente
    @Inject(MAT_DIALOG_DATA) public empresa: Enterprise,         // Empresa que se va a eliminar (inyectada desde el componente padre)
    private enterpriseService: EnterprisesService,               // Servicio para operaciones relacionadas con empresas
    private snackBar: MatSnackBar                                // Servicio para mostrar mensajes tipo toast/snackbar
  ) {}

  /**
   * Ejecuta la eliminación de la empresa desde el backend.
   * Si es exitoso, muestra notificación y cierra el diálogo con éxito.
   * Si hay error, muestra mensaje de error.
   */
  delete(): void {
    this.enterpriseService.deleteEmpresa(this.empresa.id_empresa).subscribe({
      next: (res) => {
        this.snackBar.open('Empresa eliminada correctamente', 'Cerrar', { duration: 3000 });
        this.dialogRef.close({ ok: true });
      },
      error: () => {
        this.snackBar.open('Error al eliminar la empresa', 'Cerrar', { duration: 3000 });
      }
    });
  }

  /**
   * Cancela la acción de eliminar y cierra el diálogo sin hacer nada.
   */
  cancel(): void {
    this.dialogRef.close({ ok: false });
  }
}
