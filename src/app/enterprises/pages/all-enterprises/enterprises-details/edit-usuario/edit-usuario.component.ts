import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Usuario } from 'src/app/enterprises/interfaces/usuario';
import { UsuarioService } from 'src/app/services/usuario.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { RolesService } from 'src/app/services/roles.service';
import { CustomValidators } from 'src/app/validators/custom-validators';

@Component({
  selector: 'app-edit-usuario',
  templateUrl: './edit-usuario.component.html',
  styleUrls: ['./edit-usuario.component.css']
})
export class EditUsuarioComponent implements OnInit {

  form: FormGroup;
  roles: any[] = [];

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
      password: ['', [CustomValidators.strongPassword]], // opcional, solo si se quiere cambiar
      nombre_publico: [data.nombre_publico, [CustomValidators.publicName]],
      email: [data.email ?? '', [Validators.required, CustomValidators.strictEmail]],
      observaciones: [data.observaciones ?? ''],
      id_rol: [data.id_rol, Validators.required],
      id_empresa: [data.id_empresa],
      habilitado: [data.habilitado === 1]
    });
  }

  ngOnInit(): void {
    const rolActual = parseInt(localStorage.getItem('id_rol') || '0', 10);

    this.rolesService.getAllRoles(rolActual).subscribe({
      next: (res) => {
        this.roles = res.data ?? [];
        if (rolActual === 2) {
          this.roles = this.roles.filter(r => r.id_rol !== 1);
        }
      },
    });
  }

  save(): void {
    if (this.form.invalid) {
      this.snackBar.open('❌ Revisa los campos. Hay errores.', 'Cerrar', { duration: 3000 });
      return;
    }

    const usuarioData = {
      ...this.form.value,
      habilitado: this.form.value.habilitado ? 1 : 0
    };

    // Eliminar el campo password si no se modifica
    if (!usuarioData.password) delete usuarioData.password;

    this.usuarioService.updateUsuario(usuarioData).subscribe(res => {
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
