import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UsuarioService } from 'src/app/services/usuario.service';
import { RolesService } from 'src/app/services/roles.service';
import { Usuario } from 'src/app/enterprises/interfaces/usuario';
import { Rol } from 'src/app/enterprises/interfaces/rol';

/**
 * Componente para añadir un nuevo usuario.
 * 
 * - Se abre como un diálogo (modal) desde la vista de usuarios.
 * - Permite introducir datos básicos, contraseña y rol.
 * - Filtra roles según el rol del usuario actual.
 * - Al guardar, llama al servicio y cierra el modal.
 */
@Component({
  selector: 'app-add-usuario',
  templateUrl: './add-usuario.component.html',
  styleUrls: ['./add-usuario.component.css']
})
export class AddUsuarioComponent implements OnInit {

  // Objeto que representa al nuevo usuario
  usuario: Usuario = {
    usuario: '',
    nombre_publico: '',
    id_rol: null,
    id_empresa: null,
    habilitado: 1,
    email: '',
    observaciones: ''
  };

  // Contraseña del nuevo usuario
  password: string = '';

  // Lista de roles disponibles para el selector
  roles: Rol[] = [];

  constructor(
    public dialogRef: MatDialogRef<AddUsuarioComponent>, // Referencia al diálogo actual
    @Inject(MAT_DIALOG_DATA) public data: { id_empresa: number }, // ID de empresa recibido como dato
    private usuarioService: UsuarioService, // Servicio para operaciones de usuario
    private rolesService: RolesService,     // Servicio para cargar roles disponibles
    private snackBar: MatSnackBar           // Componente para mostrar mensajes temporales
  ) {}

  /**
   * Inicializa el componente:
   * - Asigna el ID de empresa al nuevo usuario.
   * - Carga y filtra los roles según el rol del usuario actual.
   */
  ngOnInit(): void {
    this.usuario.id_empresa = this.data.id_empresa;

    const rolActual = parseInt(localStorage.getItem('id_rol') || '0', 10);

    this.rolesService.getAllRoles().subscribe({
      next: (res) => {
        this.roles = res.data ?? [];

        // Los admin_empresa no pueden ver ni superadmin ni admin global
        if (rolActual === 3) {
          this.roles = this.roles.filter(r => r.id_rol !== 1 && r.id_rol !== 2);
        }

        // Los admin globales no pueden asignar superadmin
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
   * Guarda los cambios:
   * - Prepara el objeto con contraseña.
   * - Llama al servicio para registrar el nuevo usuario.
   * - Cierra el modal si todo va bien, muestra errores si falla.
   */
  saveChanges(): void {
    this.usuario.habilitado = this.usuario.habilitado ? 1 : 0;

    const payload = {
      ...this.usuario,
      password: this.password
    };

    this.usuarioService.addUsuario(payload).subscribe({
      next: (res) => {
        this.snackBar.open('✅ Usuario creado correctamente.', 'Cerrar', { duration: 3000 });
        this.dialogRef.close({ ok: true, data: res.data });
      },
      error: () => {
        this.snackBar.open('❌ Error al crear el usuario.', 'Cerrar', { duration: 3000 });
      }
    });
  }

  /**
   * Cierra el diálogo sin hacer ningún cambio.
   */
  cancel(): void {
    this.dialogRef.close({ ok: false });
  }
}
