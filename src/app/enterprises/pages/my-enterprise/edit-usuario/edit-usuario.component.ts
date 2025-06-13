// Importaciones necesarias para el funcionamiento del componente: formularios, diálogos, servicios y modelos.
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

/**
 * Componente para editar usuarios dentro de la empresa.
 * 
 * Permite modificar datos como usuario, contraseña, email, nombre público, rol y estado (habilitado).
 * Usa ReactiveForms y se muestra dentro de un MatDialog.
 */
export class EditUsuarioComponent implements OnInit {

  form: FormGroup;
  roles: Rol[] = [];

  // Errores si el usuario o email están duplicados
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
  }

  /**
   * Comprueba si usuario/email están duplicados antes de guardar.
   */
  checkDuplicadosYGuardar(): void {
    const { usuario, email } = this.form.value;

    this.usuarioService.checkUsernameExists(usuario).subscribe(respuestaUsuario => {
      this.usuarioDuplicado = respuestaUsuario.exists;

      this.usuarioService.checkEmailExists(email).subscribe(respuestaEmail => {
        this.emailDuplicado = respuestaEmail.exists;

        if (this.usuarioDuplicado) {
          this.snackBar.open('❌ El nombre de usuario ya están en uso.', 'Cerrar', { duration: 3000 });
          return;
        }

        if (this.emailDuplicado) {
          this.snackBar.open('❌ El email ya están en uso.', 'Cerrar', { duration: 3000 });
          return;
        }

        this.save(); // Si no hay duplicados, se guarda
      });
    });
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