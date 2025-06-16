import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FormControl } from '@angular/forms';
import { SelectionModel } from '@angular/cdk/collections';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { Usuario } from 'src/app/enterprises/interfaces/usuario';
import { Enterprise } from 'src/app/enterprises/interfaces/enterprise.interface';

import { UsuarioService } from 'src/app/services/usuario.service';
import { EnterprisesService } from 'src/app/services/enterprises.service';
import { EstadoConexionService } from 'src/app/services/estado-conexion.service';

import { AddUsuarioComponent } from './add-usuario/add-usuario.component';
import { EditUsuarioComponent } from './edit-usuario/edit-usuario.component';
import { DeleteUsuarioComponent } from './delete-usuario/delete-usuario.component';

/**
 * Componente para mostrar y editar los detalles de una empresa.
 * 
 * - Permite ver los usuarios de la empresa.
 * - Permite editar los datos de la empresa (nombre/logo).
 * - Gestiona usuarios: añadir, editar y eliminar.
 * - Muestra usuarios conectados en tiempo real.
 */
@Component({
  selector: 'app-enterprises-details',
  templateUrl: './enterprises-details.component.html',
  styleUrls: ['./enterprises-details.component.css']
})
export class EnterprisesDetailsComponent implements OnInit {

  // Empresa actual que se está mostrando
  empresa: Enterprise;

  // Lista completa de usuarios y lista filtrada por búsqueda
  usuarios: Usuario[] = [];
  filteredUsuarios: Usuario[] = [];

  // Modo de edición activado/desactivado
  editMode = false;

  // Valor actual del filtro de búsqueda
  filterValue: string = '';

  // Columnas que se muestran en la tabla
  displayedColumns: string[] = ['usuario', 'nombre_publico', 'observaciones', 'habilitado', 'conectado', 'acciones'];

  // Control de selección (no se usa actualmente, pero puede ampliarse)
  selection = new SelectionModel<Usuario>(false, []);

  // Control del input de búsqueda
  searchControl = new FormControl('');

  // IDs de usuarios actualmente conectados (revisado por el backend)
  usuariosConectados: number[] = [];

  form!: FormGroup;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { empresa: Enterprise }, // Empresa recibida desde el diálogo
    private usuarioService: UsuarioService,
    private enterpriseService: EnterprisesService,
    private estadoConexionService: EstadoConexionService,
    private snackBar: MatSnackBar,
    private dialog: MatDialog,
    private dialogRef: MatDialogRef<EnterprisesDetailsComponent>,
    private fb: FormBuilder
  ) {
    this.empresa = data.empresa;
  }

  /**
   * Al iniciar el componente:
   * - Carga los usuarios de la empresa.
   * - Consulta los usuarios conectados.
   * - Configura el filtro de búsqueda.
   */
  ngOnInit(): void {
    // Inicializar formulario con los mismos validadores del AddEnterpriseComponent
    this.form = this.fb.group({
      nombre_empresa: [this.empresa.nombre_empresa, [Validators.required, Validators.minLength(4)]],
      logo_url: [this.empresa.logo_url || '']
    });

    this.getUsuarios();
    this.obtenerConectados();

    this.searchControl.valueChanges.subscribe(value => {
      this.applyFilter(value ?? '');
    });
  }

  // Activa o desactiva el modo edición del nombre/logo.
  toggleEdit(): void {
    this.editMode = !this.editMode;
  }

  // Obtiene todos los usuarios de la empresa desde el backend.
  getUsuarios(): void {
    this.usuarioService.getUsuariosByEmpresa(this.empresa.id_empresa).subscribe(res => {
      if (res.ok) {
        this.usuarios = res.data;
        this.filteredUsuarios = res.data;
      }
    });
  }

  // Aplica el filtro de búsqueda sobre la lista de usuarios.
  applyFilter(value: string): void {
    this.filterValue = value;
    const filterValueLower = value.toLowerCase();
    this.filteredUsuarios = this.usuarios.filter(usuario =>
      usuario.usuario.toLowerCase().includes(filterValueLower) ||
      (usuario.nombre_publico?.toLowerCase() ?? '').includes(filterValueLower)
    );
  }

  // Consulta al backend qué usuarios están actualmente conectados.
  obtenerConectados(): void {
    this.estadoConexionService.getConectados().subscribe(res => {
      if (res.ok) {
        this.usuariosConectados = res.data;
      }
    });
  }

  /**
   * Verifica si un usuario está actualmente conectado.
   */
  isUsuarioConectado(id: number): boolean {
    return this.usuariosConectados.includes(id);
  }

  // Abre el diálogo para añadir un nuevo usuario a la empresa.
  addUsuario(): void {
    const dialogRef = this.dialog.open(AddUsuarioComponent, {
      data: { id_empresa: this.empresa.id_empresa }
    });

    dialogRef.afterClosed().subscribe(res => {
      if (res?.ok) this.getUsuarios();
    });
  }


  // Abre el diálogo para editar un usuario existente.
  editUsuario(usuario: Usuario): void {
    const dialogRef = this.dialog.open(EditUsuarioComponent, {
      data: usuario
    });

    dialogRef.afterClosed().subscribe(res => {
      if (res?.ok) this.getUsuarios();
    });
  }

  // Abre el diálogo de confirmación para eliminar un usuario.
  deleteUsuario(usuario: Usuario): void {
    const dialogRef = this.dialog.open(DeleteUsuarioComponent, {
      data: usuario
    });

    dialogRef.afterClosed().subscribe(res => {
      if (res?.ok) this.getUsuarios();
    });
  }

  // Guarda los cambios en el nombre o logo de la empresa.
  async save() {
    if (this.form.invalid) {
      this.snackBar.open('Corrige los errores del formulario antes de guardar.', 'Cerrar', { duration: 4000 });
      return;
    }

    const empresaUpdate = {
      id_empresa: this.empresa.id_empresa,
      nombre_empresa: this.form.value.nombre_empresa,
      logo_url: this.form.value.logo_url
    };

    const RESPONSE = await this.enterpriseService.updateEmpresa(empresaUpdate).toPromise();

    if (RESPONSE?.ok) {
      this.snackBar.open(RESPONSE.message ?? 'Empresa actualizada', 'Cerrar', { duration: 5000 });
      this.dialogRef.close({ ok: true, empresa: empresaUpdate });
    } else {
      this.snackBar.open(RESPONSE?.message ?? 'Error al actualizar empresa', 'Cerrar', { duration: 5000 });
    }
  }

  // Cierra el diálogo sin guardar.
  onNoClick() {
    this.dialogRef.close({ ok: false });
  }

  // Activa el modo de edición con los datos de la empresa proporcionada.
  editEnterprise(enterprise: Enterprise) {
    this.empresa = enterprise;
    this.toggleEdit();
  }
}
