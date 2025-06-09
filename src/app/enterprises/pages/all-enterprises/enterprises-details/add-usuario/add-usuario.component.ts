import { Component, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Inject } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UsuarioService } from 'src/app/services/usuario.service';
import { RolesService } from 'src/app/services/roles.service';
import { Usuario } from 'src/app/enterprises/interfaces/usuario';
import { Rol } from 'src/app/enterprises/interfaces/rol';

/**
 * Componente para añadir un nuevo usuario.
 * 
 * - Se lanza como un diálogo desde la vista de usuarios.
 * - Carga los roles disponibles (según el rol actual).
 * - Envía la solicitud al backend para crear el usuario.
 */
@Component({
  selector: 'app-add-usuario',
  templateUrl: './add-usuario.component.html',
  styleUrls: ['./add-usuario.component.css']
})
export class AddUsuarioComponent implements OnInit {

  // Objeto de usuario que se enviará al backend
  usuario: Usuario = {
    usuario: '',
    nombre_publico: '',
    id_rol: null,
    id_empresa: null,
    habilitado: 1,
    email: '',
    observaciones: ''
  };

  password: string = '';     // Contraseña del nuevo usuario
  roles: Rol[] = [];         // Lista de roles disponibles

  constructor(
  public dialogRef: MatDialogRef<AddUsuarioComponent>,
  @Inject(MAT_DIALOG_DATA) public data: { id_empresa: number },
  private usuarioService: UsuarioService,
  private rolesService: RolesService,
  private snackBar: MatSnackBar
) {}


  /**
   * Inicializa el componente:
   * - Obtiene la empresa desde localStorage.
   * - Carga roles según el rol actual del usuario autenticado.
   */
  ngOnInit(): void {
    this.usuario.id_empresa = this.data.id_empresa;

    const rolActual = parseInt(localStorage.getItem('id_rol') || '0', 10);

    this.rolesService.getAllRoles().subscribe({
      next: (res) => {
        this.roles = res.data ?? [];

        // Si el rol actual es admin, filtra el rol superadmin
        if (rolActual === 2) {
          this.roles = this.roles.filter(r => r.id_rol !== 1);
        }
      },
      error: () => {
        this.snackBar.open('Error al cargar los roles', 'Cerrar', { duration: 3000 });
      }
    });
  }

  /**
   * Envia los datos del nuevo usuario al backend.
   * - Valida estado de habilitado (1 o 0).
   * - Incluye la contraseña como `pass_user`.
   * - Cierra el diálogo si se creó correctamente.
   */
  saveChanges(): void {
    this.usuario.habilitado = this.usuario.habilitado ? 1 : 0;

    const payload = {
      ...this.usuario,
      password: this.password // Se enviará como pass_user en el backend
    };

    this.usuarioService.addUsuario(payload).subscribe({
      next: (res) => {
        this.snackBar.open('Usuario creado correctamente.', 'Cerrar', { duration: 3000 });
        this.dialogRef.close({ ok: true, data: res.data });
      },
      error: () => {
        this.snackBar.open('Error al crear el usuario.', 'Cerrar', { duration: 3000 });
      }
    });
  }

  /**
   * Cancela la operación y cierra el diálogo sin guardar.
   */
  cancel(): void {
    this.dialogRef.close({ ok: false });
  }
}
