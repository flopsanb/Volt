import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ProjectService } from 'src/app/services/projects.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { EnterprisesService } from 'src/app/services/enterprises.service';

@Component({
  selector: 'app-add-proyecto',
  templateUrl: './add-proyecto.component.html',
  styleUrls: ['./add-proyecto.component.scss']
})
export class AddProyectoComponent implements OnInit {
  form: FormGroup;
  empresas: any[] = [];

  constructor(
    public dialogRef: MatDialogRef<AddProyectoComponent>,
    private fb: FormBuilder,
    private projectService: ProjectService,
    private snackBar: MatSnackBar,
    private enterprisesService: EnterprisesService
  ) {
    this.form = this.fb.group({
      nombre_proyecto: ['', [Validators.required, Validators.minLength(3)]],
      iframe_proyecto: ['', Validators.required],
      visible: [true],
      habilitado: [true],
      id_empresa: [null, Validators.required]
    });
  }

  ngOnInit(): void {
    this.enterprisesService.getAllEmpresas().subscribe({
      next: (res) => {
        this.empresas = res.data ?? [];
      },
      error: () => {
        this.snackBar.open('❌ Error al cargar empresas.', 'Cerrar', { duration: 3000 });
      }
    });
  }

  saveChanges(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const values = {
      ...this.form.value,
      visible: this.form.value.visible ? 1 : 0,
      habilitado: this.form.value.habilitado ? 1 : 0
    };

    this.projectService.addProyecto(values).subscribe({
      next: (res) => {
        this.snackBar.open('✅ Proyecto creado correctamente.', 'Cerrar', { duration: 3000 });
        this.dialogRef.close({ ok: true, data: res.data });
      },
      error: () => {
        this.snackBar.open('❌ Error al crear el proyecto.', 'Cerrar', { duration: 3000 });
      }
    });
  }

  cancel(): void {
    this.dialogRef.close({ ok: false });
  }
}
