import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { ProjectService } from 'src/app/services/projects.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Project } from 'src/app/enterprises/interfaces/project.interface';
import { EnterprisesService } from 'src/app/services/enterprises.service';

/**
 * Componente para añadir un nuevo proyecto.
 * 
 * - Se abre como modal desde la lista de proyectos.
 * - Permite introducir nombre, iframe, visibilidad y empresa asociada.
 * - Envia la solicitud al backend para registrar el nuevo proyecto.
 */
@Component({
  selector: 'app-add-proyecto',
  templateUrl: './add-proyecto.component.html',
  styleUrls: ['./add-proyecto.component.scss']
})
export class AddProyectoComponent implements OnInit {

  // Estructura inicial del nuevo proyecto
  proyecto: Project = {
    nombre_proyecto: '',
    iframe_proyecto: '',
    visible: 1,
    habilitado: 1,
    id_empresa: null
  } as unknown as Project;

  // Lista de empresas para el select
  empresas: any[] = [];

  constructor(
    public dialogRef: MatDialogRef<AddProyectoComponent>,
    private projectService: ProjectService,
    private snackBar: MatSnackBar,
    private enterprisesService: EnterprisesService
  ) {}

  ngOnInit(): void {
    // Cargar empresas disponibles al abrir el modal
    this.enterprisesService.getAllEmpresas().subscribe(res => {
      this.empresas = res.data;
    });
  }

  /**
   * Guarda el nuevo proyecto enviando los datos al backend.
   */
  saveChanges(): void {
    this.projectService.addProyecto(this.proyecto).subscribe({
      next: (res) => {
        this.snackBar.open('Proyecto creado correctamente.', 'Cerrar', { duration: 3000 });
        this.dialogRef.close({ ok: true, data: res.data });
      },
      error: () => {
        this.snackBar.open('Error al crear el proyecto.', 'Cerrar', { duration: 3000 });
      }
    });
  }

  /**
   * Cierra el diálogo sin realizar cambios.
   */
  cancel(): void {
    this.dialogRef.close({ ok: false });
  }
}
