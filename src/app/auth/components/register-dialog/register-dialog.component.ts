import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ViewEncapsulation } from '@angular/core';

/**
 * Diálogo modal que solicita la contraseña al usuario una vez validado su nombre.
 * El valor introducido se devuelve al componente de login para completar la autenticación.
 */
@Component({
  selector: 'app-register-dialog',
  templateUrl: './register-dialog.component.html',
  styleUrls: ['./register-dialog.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class RegisterDialogComponent {

  password: string = '';

  constructor(
    public dialogRef: MatDialogRef<RegisterDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any // Recibe el nombre de usuario desde el login
  ) {}

  // Cierra el diálogo sin devolver datos
  onNoClick(): void {
    this.dialogRef.close();
  }

  // Cierra el diálogo y devuelve la contraseña introducida
  onLogin() {
    this.dialogRef.close(this.password);
  }
}
