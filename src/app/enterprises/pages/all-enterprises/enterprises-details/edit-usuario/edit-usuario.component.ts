import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Usuario } from 'src/app/enterprises/interfaces/usuario';
import { UsuarioService } from 'src/app/services/usuario.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { RolesService } from 'src/app/services/roles.service';

/**
 * Componente para editar un usuario existente.
 *
 * - Se abre como un modal desde el listado de usuarios.
 * - Muestra un formulario con los datos del usuario a editar.
 * - Permite actualizar campos clave y cambiar el rol.
 */
@Component({
  selector: 'app-edit-usuario',
  templateUrl: './edit-usuario.component.html',
  styleUrls: ['./edit-usuario.component.css']
})
export class EditUsuarioComponent implements OnInit {

  form: FormGroup;   // Formulario reactivo con validaciones
  roles: any[] = []; // Lista de roles disponibles para asignar

  constructor(
    private fb: FormBuilder, // Constructor del formulario
    private dialogRef: MatDialogRef<EditUsuarioComponent>, // Referencia para cerrar el modal
    @Inject(MAT_DIALOG_DATA) public data: Usuario, // Datos del usuario recibido
    private usuarioService: UsuarioService,        // Servicio para actualizar usuarios
    private rolesService: RolesService,            // Servicio para obtener roles disponibles
    private snackBar: MatSnackBar                  // Servicio para mostrar notificaciones
  ) {
    // Se inicializa el formulario con los datos actuales del usuario
    this.form = this.fb.group({
      id_usuario: [data.id_usuario],
      usuario: [data.usuario, Validators.required],
      password: [''], // Campo vacío para nueva contraseña (si se quiere cambiar)
      nombre_publico: [data.nombre_publico],
      email: [data.email ?? '', [Validators.required, Validators.email]],
      observaciones: [data.observaciones ?? ''],
      id_rol: [data.id_rol, Validators.required],
      id_empresa: [data.id_empresa],
      habilitado: [data.habilitado === 1] // Se adapta a checkbox booleano
    });
  }

  /**
   * Al iniciar el componente, se carga la lista de roles.
   * - Si el usuario actual es admin (rol 2), se filtra el rol de superadmin (1).
   */
  ngOnInit(): void {
    const rolActual = parseInt(localStorage.getItem('id_rol') || '0', 10);

    this.rolesService.getAllRoles().subscribe({
      next: (res) => {
        this.roles = res.data ?? [];
        if (rolActual === 2) {
          this.roles = this.roles.filter(r => r.id_rol !== 1); // Oculta superadmin para admins
        }
      },
    });
  }

  /**
   * Envía los cambios al backend si el formulario es válido.
   * Muestra notificación y cierra el modal según resultado.
   */
  save(): void {
    if (this.form.invalid) return;

    const usuarioData = {
      ...this.form.value,
      habilitado: this.form.value.habilitado ? 1 : 0 // Convierte booleano a entero
    };

    this.usuarioService.updateUsuario(usuarioData).subscribe(res => {
      if (res.ok) {
        this.snackBar.open('✅ Usuario actualizado correctamente', 'Cerrar', { duration: 3000 });
        this.dialogRef.close({ ok: true });
      } else {
        this.snackBar.open('❌ Error al actualizar usuario', 'Cerrar', { duration: 3000 });
      }
    });
  }

  /**
   * Cierra el modal sin realizar cambios.
   */
  cancelar(): void {
    this.dialogRef.close({ ok: false });
  }
}
