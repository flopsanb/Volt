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

  // Formulario reactivo que contiene todos los campos editables del usuario
  form: FormGroup;

  // Lista de roles disponibles para selección en el formulario
  roles: Rol[] = [];

  constructor(
    private fb: FormBuilder, // Constructor de formularios
    private dialogRef: MatDialogRef<EditUsuarioComponent>, // Referencia al modal para poder cerrarlo
    @Inject(MAT_DIALOG_DATA) public data: Usuario, // Datos del usuario a editar recibidos como input del modal
    private usuarioService: UsuarioService, // Servicio para actualizar el usuario
    private rolesService: RolesService, // Servicio para obtener los roles disponibles
    private snackBar: MatSnackBar // Componente para mostrar mensajes temporales
  ) {
    // Inicialización del formulario con los valores actuales del usuario recibido
    this.form = this.fb.group({
      id_usuario: [data.id_usuario],
      usuario: [data.usuario, Validators.required],
      password: [''], // campo vacío, sólo se modifica si se introduce uno nuevo
      nombre_publico: [data.nombre_publico],
      email: [data.email ?? '', [Validators.required, Validators.email]],
      observaciones: [data.observaciones ?? ''],
      id_rol: [data.id_rol, Validators.required],
      id_empresa: [data.id_empresa],
      habilitado: [data.habilitado === 1] // se transforma a booleano para el checkbox
    });
  }

  /**
   * Al iniciar el componente, carga los roles disponibles según el rol del usuario actual.
   * 
   * Superadmin (1): puede ver todos los roles.
   * Admin (2): no puede ver el rol 1.
   * Admin de empresa (3): sólo ve roles 3 y 4.
   */
  ngOnInit(): void {
    const rolActual = parseInt(localStorage.getItem('id_rol') || '0', 10);

    this.rolesService.getAllRoles().subscribe({
      next: (res) => {
        this.roles = res.data ?? [];

        // Filtros según rol actual
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
   * Guarda los cambios si el formulario es válido.
   * 
   * Convierte el campo `habilitado` a 0/1 y envía el payload al backend.
   * Si la operación es correcta, cierra el modal y muestra mensaje de éxito.
   */
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

  /**
   * Cierra el modal sin aplicar cambios.
   */
  cancelar(): void {
    this.dialogRef.close({ ok: false });
  }
}
