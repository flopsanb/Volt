import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ProjectService } from 'src/app/services/projects.service';
import { EnterprisesService } from 'src/app/services/enterprises.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Project } from 'src/app/enterprises/interfaces/project.interface';

@Component({
  selector: 'app-edit-proyecto',
  templateUrl: './edit-proyecto.component.html',
  styleUrls: ['./edit-proyecto.component.scss']
})
export class EditProyectoComponent implements OnInit {

  form: FormGroup;
  empresas: any[] = [];
  isGlobalAdmin = false;

  constructor(
    public dialogRef: MatDialogRef<EditProyectoComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Project,
    private fb: FormBuilder,
    private projectService: ProjectService,
    private enterpriseService: EnterprisesService,
    private snackBar: MatSnackBar
  ) {
    // Inicializamos el formulario con los valores del proyecto a editar
    this.form = this.fb.group({
      nombre_proyecto: [data.nombre_proyecto, [Validators.required, Validators.minLength(4)]],
      iframe_proyecto: [data.iframe_proyecto, [Validators.required]],
      visible: [!!data.visible],
      habilitado: [!!data.habilitado],
      id_empresa: [data.id_empresa, Validators.required]
    });
  }

  ngOnInit(): void {
    const id_rol = Number(localStorage.getItem('id_rol'));
    this.isGlobalAdmin = id_rol === 1 || id_rol === 2;

    if (this.isGlobalAdmin) {
      this.enterpriseService.getAllEmpresas().subscribe((res) => {
        this.empresas = res.data;
      });
    }
  }

  saveChanges(): void {
    const proyectoActualizado: Project = {
      ...this.data,
      ...this.form.value,
      visible: this.form.value.visible ? 1 : 0,
      habilitado: this.form.value.habilitado ? 1 : 0
    };

    this.projectService.editProyecto(proyectoActualizado).subscribe({
      next: (res) => {
        this.snackBar.open('✅ Proyecto actualizado con éxito.', 'Cerrar', { duration: 3000 });
        this.dialogRef.close({ ok: true, data: res.data });
      },
      error: () => {
        this.snackBar.open('❌ Error al actualizar el proyecto.', 'Cerrar', { duration: 3000 });
      }
    });
  }

  cancel(): void {
    this.dialogRef.close({ ok: false });
  }
}

