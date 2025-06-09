import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { EnterprisesService } from 'src/app/services/enterprises.service';
import { MatSnackBar } from '@angular/material/snack-bar';

/**
 * Componente para añadir una nueva empresa.
 *
 * - Se presenta como un modal con un formulario reactivo.
 * - Valida que el nombre sea obligatorio.
 * - Llama al servicio para guardar la empresa y muestra mensajes.
 */
@Component({
  selector: 'app-add-enterprise',
  templateUrl: './add-enterprise.component.html',
  styleUrls: ['./add-enterprise.component.css']
})
export class AddEnterpriseComponent {

  form: FormGroup;  // Formulario reactivo para capturar datos de la empresa

  constructor(
    private dialogRef: MatDialogRef<AddEnterpriseComponent>, // Referencia para cerrar el modal
    private fb: FormBuilder,                                 // Servicio para construir el formulario
    private enterpriseService: EnterprisesService,           // Servicio que gestiona las empresas
    private snackBar: MatSnackBar                            // Servicio para mostrar notificaciones
  ) {
    // Definimos el formulario y sus validaciones
    this.form = this.fb.group({
      nombre_empresa: ['', [Validators.required]], // Campo obligatorio
      logo_url: ['']                               // Campo opcional
    });
  }

  /**
   * Envía los datos del formulario al backend para crear una nueva empresa.
   * Cierra el modal si la operación es exitosa o muestra un error si falla.
   */
  onSubmit(): void {
    if (this.form.invalid) return;

    const nuevaEmpresa = {
      nombre_empresa: this.form.value.nombre_empresa,
      logo_url: this.form.value.logo_url || null
    };

    this.enterpriseService.addEmpresa(nuevaEmpresa).subscribe({
      next: (res) => {
        this.snackBar.open('Empresa creada con éxito', 'Cerrar', { duration: 3000 });
        this.dialogRef.close({ ok: true, data: res.data });
      },
      error: () => {
        this.snackBar.open('Error al crear la empresa', 'Cerrar', { duration: 3000 });
      }
    });
  }

  /**
   * Cancela el diálogo sin hacer cambios.
   */
  cancel(): void {
    this.dialogRef.close({ ok: false });
  }
}
