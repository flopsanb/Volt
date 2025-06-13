import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';

import { Usuario } from 'src/app/enterprises/interfaces/usuario';
import { UsuarioService } from 'src/app/services/usuario.service';
import { RolesService } from 'src/app/services/roles.service';
import { Rol } from 'src/app/enterprises/interfaces/rol';

@Component({
  selector: 'app-edit-usuario',
  templateUrl: './edit-usuario.component.html',
  styleUrls: ['./edit-usuario.component.css']
})
export class EditUsuarioComponent implements OnInit {

  form: FormGroup;
  roles: Rol[] = [];

  usuarioDuplicado: boolean = false;
  emailDuplicado: boolean = false;

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
      usuario: [data.usuario, Validators.required],
      password: [''],
      nombre_publico: [data.nombre_publico, Validators.required],
      email: [data.email ?? '', [Validators.required, Validators.email]],
      observaciones: [data.observaciones ?? ''],
      id_rol: [data.id_rol, Validators.required],
      id_empresa: [data.id_empresa, Validators.required],
      habilitado: [data.habilitado === 1]
    });
  }

  ngOnInit(): void {
    const rolActual = parseInt(localStorage.getItem('id_rol') || '0', 10);

    this.rolesService.getAllRoles().subscribe({
      next: (res) => {
        this.roles = res.data ?? [];
        if (rolActual === 3) {
          this.roles = this.roles.filter(r => r.id_rol !== 1 && r.id_rol !== 2);
        }
        if (rolActual === 2) {
          this.roles = this.roles.filter(r => r.id_rol !== 1);
        }
      },
      error: () => {
        this.snackBar.open('Error al cargar roles', 'Cerrar', { duration: 3000 });
      }
    });

    // Validación en tiempo real
    this.form.get('usuario')?.valueChanges.subscribe(value => {
      this.validarUsuario(value);
    });

    this.form.get('email')?.valueChanges.subscribe(value => {
      this.validarEmail(value);
    });
  }

  validarUsuario(value: string): void {
    const idActual = this.form.get('id_usuario')?.value;
    if (!value.trim()) return;

    this.usuarioService.checkUsernameExists(value).subscribe(res => {
      this.usuarioDuplicado = res.exists && value !== this.data.usuario;
    });
  }

  validarEmail(value: string): void {
    const idActual = this.form.get('id_usuario')?.value;
    if (!value.trim()) return;

    this.usuarioService.checkEmailExists(value).subscribe(res => {
      this.emailDuplicado = res.exists && value !== this.data.email;
    });
  }

  save(): void {
    if (this.form.invalid || this.usuarioDuplicado || this.emailDuplicado) return;

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
