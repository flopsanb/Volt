import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Project } from '../../interfaces/project.interface';

/**
 * Componente de diálogo de confirmación.
 * Muestra una ventana modal con dos opciones (Sí/No) y devuelve el resultado al componente que lo abrió.
 */
@Component({
  selector: 'app-confirm-dialog',
  templateUrl: './confirm-dialog.component.html',
  styles: []
})
export class ConfirmDialogComponent {

  constructor(
    public dialogRef: MatDialogRef<ConfirmDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Project            // Recibe el proyecto sobre el que se está confirmando la acción
  ) {}

  // Cierra el diálogo sin confirmar (false)
  onNoClick(): void {
    this.dialogRef.close(false);
  }

  // Cierra el diálogo confirmando la acción (true)
  onConfirmClick(): void {
    this.dialogRef.close(true);
  }
}
