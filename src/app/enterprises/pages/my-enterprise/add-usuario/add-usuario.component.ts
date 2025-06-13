import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UsuarioService } from 'src/app/services/usuario.service';
import { RolesService } from 'src/app/services/roles.service';
import { Usuario } from 'src/app/enterprises/interfaces/usuario';
import { Rol } from 'src/app/enterprises/interfaces/rol';

@Component({
  selector: 'app-add-usuario',
  templateUrl: './add-usuario.component.html',
  styleUrls: ['./add-usuario.component.css']
})
export class AddUsuarioComponent implements OnInit {

  usuario: Usuario = {
    usuario: '',
    nombre_publico: '',
    id_rol: null,
    id_empresa: null,
    habilitado: 1,
    email: '',
    observaciones: ''
  };

  password: string = '';
  roles: Rol[] = [];

  usuarioDuplicado: boolean = false;
  emailDuplicado: boolean = false;

  constructor(
    public dialogRef: MatDialogRef<AddUsuarioComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { id_empresa: number },
    private usuarioService: UsuarioService,
    private rolesService: RolesService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.usuario.id_empresa = this.data.id_empresa;
    console.log('🟡 INIT: ID Empresa recibida:', this.usuario.id_empresa);

    const rolActual = parseInt(localStorage.getItem('id_rol') || '0', 10);
    console.log('🟡 Rol actual desde localStorage:', rolActual);

    this.rolesService.getAllRoles().subscribe({
      next: (res) => {
        this.roles = res.data ?? [];
        console.log('✅ Roles cargados:', this.roles);

        if (rolActual === 3) {
          this.roles = this.roles.filter(r => r.id_rol !== 1 && r.id_rol !== 2);
        }
        if (rolActual === 2) {
          this.roles = this.roles.filter(r => r.id_rol !== 1);
        }

        console.log('🔹 Roles visibles tras filtro:', this.roles);
      },
      error: (err) => {
        console.error('❌ Error al cargar roles:', err);
        this.snackBar.open('Error al cargar los roles', 'Cerrar', { duration: 3000 });
      }
    });
  }

  validarUsuario(): void {
    if (this.usuario.usuario?.trim()) {
      this.usuarioService.checkUsernameExists(this.usuario.usuario).subscribe({
        next: (res) => {
          this.usuarioDuplicado = res.exists;
        },
        error: () => this.usuarioDuplicado = false
      });
    } else {
      this.usuarioDuplicado = false;
    }
  }

  validarEmail(): void {
    if (this.usuario.email?.trim()) {
      this.usuarioService.checkEmailExists(this.usuario.email).subscribe({
        next: (res) => {
          this.emailDuplicado = res.exists;
        },
        error: () => this.emailDuplicado = false
      });
    } else {
      this.emailDuplicado = false;
    }
  }

  saveChanges(): void {
    console.log('📥 Intentando guardar usuario:', this.usuario);

    if (
      !this.usuario.usuario.trim() ||
      !this.password.trim() ||
      !this.usuario.nombre_publico.trim() ||
      !this.usuario.email.trim() ||
      !this.usuario.id_rol ||
      !this.usuario.id_empresa
    ) {
      console.warn('⚠️ Campos incompletos:', this.usuario);
      this.snackBar.open('❌ Todos los campos obligatorios deben estar completos.', 'Cerrar', { duration: 3000 });
      return;
    }

    if (this.usuarioDuplicado || this.emailDuplicado) {
      console.warn('⚠️ Campos duplicados: usuarioDuplicado=', this.usuarioDuplicado, 'emailDuplicado=', this.emailDuplicado);
      this.snackBar.open('❌ Corrige los errores antes de guardar.', 'Cerrar', { duration: 3000 });
      return;
    }

    this.usuario.habilitado = this.usuario.habilitado ? 1 : 0;

    const payload = {
      ...this.usuario,
      password: this.password
    };

    console.log('📤 Payload enviado al backend:', payload);

    this.usuarioService.addUsuario(payload).subscribe({
      next: (res) => {
        console.log('✅ Respuesta del backend:', res);
        if (res.ok) {
          this.snackBar.open('✅ Usuario creado correctamente.', 'Cerrar', { duration: 3000 });
          this.dialogRef.close({ ok: true, data: res.data });
        } else {
          this.snackBar.open('❌ Error: ' + res.message, 'Cerrar', { duration: 3000 });
        }
      },
      error: (err) => {
        console.error('❌ Error inesperado en el servidor:', err);
        this.snackBar.open('❌ Error inesperado en el servidor.', 'Cerrar', { duration: 3000 });
      }
    });
  }

  cancel(): void {
    console.log('🔙 Cancelado por el usuario');
    this.dialogRef.close({ ok: false });
  }
}
