import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ProjectService } from 'src/app/services/projects.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Project } from 'src/app/enterprises/interfaces/project.interface';

/**
 * Componente para confirmar y eliminar un proyecto.
 * 
 * - Se abre como modal desde el listado de proyectos.
 * - Muestra advertencia antes de borrar definitivamente.
 * - Envía la solicitud DELETE al backend.
 */
@Component({
  selector: 'app-delete-proyecto',
  templateUrl: './delete-proyecto.component.html',
  styleUrls: ['./delete-proyecto.component.scss']
})
export class DeleteProyectoComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<DeleteProyectoComponent>,
    @Inject(MAT_DIALOG_DATA) public proyecto: Project, // Proyecto recibido desde el diálogo
    private servicioProject: ProjectService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit() {
    // No requiere carga de datos adicional
  }

  /**
   * Llama al servicio para eliminar el proyecto por ID.
   * Muestra mensajes según resultado y cierra el diálogo con estado.
   */
  async deleteProject() {
    try {
      const RESP = await this.servicioProject.deleteProyecto(this.proyecto.id_proyecto).toPromise();

      if (RESP && RESP.message) {
        this.snackBar.open(RESP.message, 'Cerrar', { duration: 5000 });
        this.dialogRef.close({ ok: RESP.ok, data: RESP.data });
      } else {
        this.snackBar.open('Hubo un problema al eliminar el proyecto.', 'Cerrar', { duration: 5000 });
      }

    } catch {
      // Eliminamos el log del error para no exponer detalles al usuario
      this.snackBar.open('Error al realizar la solicitud. Intenta más tarde.', 'Cerrar', { duration: 5000 });
    }
  }

  /**
   * Cierra el diálogo sin hacer cambios.
   */
  onNoClick() {
    this.dialogRef.close({ ok: false });
  }
}
