import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Project } from 'src/app/enterprises/interfaces/project.interface';
import { ProjectService } from 'src/app/services/projects.service';
import { EnterprisesService } from 'src/app/services/enterprises.service';
import { MatSnackBar } from '@angular/material/snack-bar';

/**
 * Componente para editar un proyecto existente.
 * Se utiliza como modal en el sistema.
 * 
 * - Permite modificar los campos básicos del proyecto (nombre, iframe, empresa, estado).
 * - Los usuarios con rol global (superadmin o admin) pueden cambiar la empresa asignada.
 * - Al guardar, se envía la actualización al backend y se muestra una notificación.
 */
@Component({
  selector: 'app-edit-proyecto',
  templateUrl: './edit-proyecto.component.html',
  styleUrls: ['./edit-proyecto.component.scss']
})
export class EditProyectoComponent implements OnInit {
  
  // Proyecto a editar
  proyecto: Project;

  // Lista de empresas disponibles (solo visible para roles globales)
  empresas: any[] = [];

  // Control de rol
  isGlobalAdmin: boolean = false;

  constructor(
    public dialogRef: MatDialogRef<EditProyectoComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Project, // Datos inyectados del proyecto original
    private projectService: ProjectService,
    private enterpriseService: EnterprisesService,
    private snackBar: MatSnackBar
  ) {
    // Creamos una copia del proyecto recibido para no mutar directamente
    this.proyecto = { ...data };
  }

  ngOnInit(): void {
    // Detectamos si el usuario tiene rol global
    const id_rol = Number(localStorage.getItem('id_rol'));
    this.isGlobalAdmin = id_rol === 1 || id_rol === 2;

    // Si es global, cargamos todas las empresas para poder reasignar el proyecto
    if (this.isGlobalAdmin) {
      this.enterpriseService.getAllEmpresas().subscribe((res) => {
        this.empresas = res.data;
        // Convertimos id_empresa a número para evitar errores de binding
        this.proyecto.id_empresa = Number(this.proyecto.id_empresa);
      });
    }
  }

  /**
   * Guarda los cambios realizados en el proyecto.
   * Normaliza campos booleanos como `visible` y `habilitado`.
   * En caso de éxito, cierra el modal y lanza notificación.
   */
  saveChanges(): void {
    this.proyecto.visible = this.proyecto.visible ? 1 : 0;
    this.proyecto.habilitado = this.proyecto.habilitado ? 1 : 0;

    this.projectService.editProyecto(this.proyecto).subscribe({
      next: (res) => {
        this.snackBar.open('Proyecto actualizado con éxito.', 'Cerrar', { duration: 3000 });
        this.dialogRef.close({ ok: true, data: res.data });
      },
      error: () => {
        this.snackBar.open('Error al actualizar el proyecto.', 'Cerrar', { duration: 3000 });
      }
    });
  }

  /**
   * Cierra el diálogo sin aplicar cambios.
   */
  cancel(): void {
    this.dialogRef.close({ ok: false });
  }
}
