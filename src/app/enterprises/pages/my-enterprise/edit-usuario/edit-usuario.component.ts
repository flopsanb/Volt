import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';

import { Usuario } from 'src/app/enterprises/interfaces/usuario';
import { UsuarioService } from 'src/app/services/usuario.service';
import { RolesService } from 'src/app/services/roles.service';
import { Rol } from 'src/app/enterprises/interfaces/rol';

import { CustomValidators } from 'src/app/validators/custom-validators';

@Component({
  selector: 'app-edit-usuario',
  templateUrl: './edit-usuario.component.html',
  styleUrls: ['./edit-usuario.component.css']
})
export class EditUsuarioComponent implements OnInit {

  form: FormGroup;
  roles: Rol[] = [];

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<EditUsuarioComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Usuario,
    private usuarioService: UsuarioService,
    private rolesService: RolesService,
    private snackBar: MatSnackBar
  ) {
    this.form = this.fb.group({
      id_usuario: [data.id_usuario],
      usuario: [data.usuario, [Validators.required, CustomValidators.username]],
      password: ['', [CustomValidators.strongPassword]],
      nombre_publico: [data.nombre_publico, [Validators.required, CustomValidators.publicName]],
      email: [data.email ?? '', [Validators.required, CustomValidators.strictEmail]],
      observaciones: [data.observaciones ?? ''],
      id_rol: [data.id_rol, Validators.required],
      id_empresa: [data.id_empresa, Validators.required],
      habilitado: [data.habilitado === 1]
    });
  }

  ngOnInit(): void {
    const rolActual = parseInt(localStorage.getItem('id_rol') || '0', 10);

    if (rolActual === 1 || rolActual === 2) {
      this.rolesService.getAllRoles(rolActual).subscribe({
        next: (res) => {
          this.roles = res.data ?? [];
        },
        error: () => {
          this.snackBar.open('❌ Error al cargar todos los roles', 'Cerrar', { duration: 3000 });
        }
      });
    } else {
      this.rolesService.getRolesMiEmpresa().subscribe({
        next: (res) => {
          this.roles = res.data ?? [];
        },
        error: () => {
          this.snackBar.open('❌ Error al cargar roles disponibles para tu empresa', 'Cerrar', { duration: 3000 });
        }
      });
    }
  }

  save(): void {
    if (this.form.invalid) return;

    const payload = {
      ...this.form.value,
      habilitado: this.form.value.habilitado ? 1 : 0
    };

    this.usuarioService.updateUsuario(payload).subscribe(res => {
      if (res.ok) {
        this.snackBar.open('✅ Usuario actualizado correctamente', 'Cerrar', { duration: 3000 });
        this.dialogRef.close({ ok: true });
      } else {
        this.snackBar.open('❌ Error al actualizar usuario', 'Cerrar', { duration: 3000 });
      }
    });
  }

  cancelar(): void {
    this.dialogRef.close({ ok: false });
  }
}
