import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';

import { UsuarioService } from 'src/app/services/usuario.service';
import { RolesService } from 'src/app/services/roles.service';
import { Rol } from 'src/app/enterprises/interfaces/rol';
import { CustomValidators } from 'src/app/validators/custom-validators';

@Component({
  selector: 'app-add-usuario',
  templateUrl: './add-usuario.component.html',
  styleUrls: ['./add-usuario.component.css']
})
export class AddUsuarioComponent implements OnInit {

  form: FormGroup;
  roles: Rol[] = [];

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<AddUsuarioComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { id_empresa: number },
    private usuarioService: UsuarioService,
    private rolesService: RolesService,
    private snackBar: MatSnackBar
  ) {
    // Inicializamos el formulario reactivo con validadores personalizados
    this.form = this.fb.group({
      usuario: ['', [Validators.required, CustomValidators.username]],
      password: ['', [Validators.required, CustomValidators.strongPassword]],
      nombre_publico: ['', [Validators.required, CustomValidators.publicName]],
      email: ['', [Validators.required, CustomValidators.strictEmail]],
      observaciones: [''],
      id_rol: [null, Validators.required],
      id_empresa: [data.id_empresa, Validators.required],
      habilitado: [true]
    });
  }

  ngOnInit(): void {
    const rolActual = parseInt(localStorage.getItem('id_rol') || '0', 10);

    const roles$ = (rolActual === 1 || rolActual === 2)
      ? this.rolesService.getAllRoles(rolActual)
      : this.rolesService.getRolesMiEmpresa();

    roles$.subscribe({
      next: (res) => {
        this.roles = res.data ?? [];
        // Si es admin (2), quitar superadmin (1)
        if (rolActual === 2) {
          this.roles = this.roles.filter(r => r.id_rol !== 1);
        }
      },
      error: () => {
        this.snackBar.open('❌ Error al cargar los roles.', 'Cerrar', { duration: 3000 });
      }
    });
  }

  saveChanges(): void {
    if (this.form.invalid) {
      this.snackBar.open('❌ Revisa los campos del formulario, hay errores.', 'Cerrar', { duration: 3000 });
      return;
    }

    const payload = {
      ...this.form.value,
      habilitado: this.form.value.habilitado ? 1 : 0
    };

    this.usuarioService.addUsuario(payload).subscribe({
      next: (res) => {
        if (res.ok) {
          this.snackBar.open('✅ Usuario creado correctamente.', 'Cerrar', { duration: 3000 });
          this.dialogRef.close({ ok: true, data: res.data });
        } else {
          this.snackBar.open('❌ Error: ' + res.message, 'Cerrar', { duration: 3000 });
        }
      },
      error: () => {
        this.snackBar.open('❌ Error inesperado en el servidor.', 'Cerrar', { duration: 3000 });
      }
    });
  }

  cancel(): void {
    this.dialogRef.close({ ok: false });
  }
}
