// src/app/enterprises/pages/my-enterprise/my-enterprise.component.ts

// Importaciones necesarias desde Angular y librerías de Material
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { FormControl } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';

// Importación de interfaces necesarias para tipado
import { Usuario } from 'src/app/enterprises/interfaces/usuario';
import { Enterprise } from 'src/app/enterprises/interfaces/enterprise.interface';

// Importación de servicios para consumo de API
import { UsuarioService } from 'src/app/services/usuario.service';
import { EnterprisesService } from 'src/app/services/enterprises.service';
import { EstadoConexionService } from 'src/app/services/estado-conexion.service';

// Importación de componentes para diálogos CRUD
import { AddUsuarioComponent } from './add-usuario/add-usuario.component';
import { EditUsuarioComponent } from './edit-usuario/edit-usuario.component';
import { DeleteUsuarioComponent } from './delete-usuario/delete-usuario.component';

/**
 * Componente principal de gestión de Mi empresa.
 * 
 * Se encarga de:
 * - Cargar los datos de la empres y la gestión de usuarios.
 * - Permitir añadir, editar, eliminar o deshabilitar usuarios.
 * - Mostrar la interfaz en función del rol del usuario (admin de empresa o empleado).
 */
@Component({
  selector: 'app-my-enterprise',
  templateUrl: './my-enterprise.component.html',
  styleUrls: ['./my-enterprise.component.css']
})
export class MyEnterpriseComponent implements OnInit {

  // Referencias a paginador y ordenamiento de la tabla
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  // Datos de la empresa logueada
  empresa: Enterprise = {
    id_empresa: 0,
    nombre_empresa: '',
    logo_url: '',
    empleados_totales: 0,
    proyectos_totales: 0
  };

  // Fuente de datos y variables relacionadas con los usuarios
  dataSource: MatTableDataSource<Usuario> = new MatTableDataSource();
  usuariosConectados: number[] = [];
  editMode = false;
  displayedColumns: string[] = ['usuario', 'nombre_publico', 'observaciones', 'habilitado', 'conectado'];

  // Filtros por columna
  usuarioFilter = new FormControl('');
  nombrePublicoFilter = new FormControl('');
  observacionesFilter = new FormControl('');
  habilitadoFilter = new FormControl('');
  conectadoFilter = new FormControl('');

  // Valores de los filtros
  private filterValues = {
    usuario: '',
    nombre_publico: '',
    observaciones: '',
    habilitado: '',
    conectado: ''
  };

  // Rol del usuario actual
  rol: number = parseInt(localStorage.getItem('id_rol') || '0', 10);

  constructor(
    private usuarioService: UsuarioService,
    private enterpriseService: EnterprisesService,
    private estadoConexionService: EstadoConexionService,
    private snackBar: MatSnackBar,
    private dialog: MatDialog
  ) {}

  // Inicialización del componente: carga datos, filtros y añade columnas si corresponde
  ngOnInit(): void {
    const id_empresa = parseInt(localStorage.getItem('id_empresa') || '0', 10);
    if (id_empresa) {
      this.cargarEmpresa(id_empresa);
      this.cargarUsuarios(id_empresa);
      this.obtenerConectados();
      this.onFilterChanges();
      if (this.rol !== 4) {
        this.displayedColumns.push('acciones');
      }
    } else {
      this.snackBar.open('No se encontró el ID de la empresa', 'Cerrar', { duration: 3000 });
    }
  }

  // Carga la información de la empresa actual
  cargarEmpresa(id_empresa: number): void {
    this.enterpriseService.getEmpresaById(id_empresa).subscribe(res => {
      if (res.ok) {
        this.empresa = res.data;
      } else {
        this.snackBar.open(res.message ?? 'Error al cargar la empresa', 'Cerrar', { duration: 3000 });
      }
    });
  }

  // Carga los usuarios pertenecientes a la empresa
  cargarUsuarios(id_empresa: number): void {
    this.usuarioService.getUsuariosByEmpresa(id_empresa).subscribe(res => {
      if (res.ok) {
        this.dataSource.data = res.data;
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        this.dataSource.filterPredicate = this.createFilter();
      } else {
        this.snackBar.open(res.message ?? 'Error al cargar usuarios', 'Cerrar', { duration: 3000 });
      }
    });
  }

  // Activa/desactiva modo edición para el nombre y logo
  toggleEdit(): void {
    this.editMode = !this.editMode;
  }

  // Guarda los cambios realizados a la empresa
  guardarCambios(): void {
    if (!this.empresa.nombre_empresa) {
      this.snackBar.open('El nombre no puede estar vacío', 'Cerrar', { duration: 3000 });
      return;
    }

    this.enterpriseService.updateMyEmpresa(this.empresa).subscribe(res => {
      if (res.ok) {
        this.snackBar.open(res.message ?? 'Empresa actualizada correctamente', 'Cerrar', { duration: 3000 });
        this.editMode = false;
      } else {
        this.snackBar.open(res.message ?? 'Error al actualizar la empresa', 'Cerrar', { duration: 3000 });
      }
    });
  }

  // Abre modal para añadir usuario
  addUsuario(): void {
    if (this.rol === 4) return;
    const dialogRef = this.dialog.open(AddUsuarioComponent, {
      data: { id_empresa: this.empresa.id_empresa }
    });

    dialogRef.afterClosed().subscribe(res => {
      if (res?.ok) this.cargarUsuarios(this.empresa.id_empresa);
    });
  }

  // Abre modal para editar un usuario
  editUsuario(usuario: Usuario): void {
    if (this.rol === 4) return;
    const dialogRef = this.dialog.open(EditUsuarioComponent, {
      data: usuario
    });

    dialogRef.afterClosed().subscribe(res => {
      if (res?.ok) this.cargarUsuarios(this.empresa.id_empresa);
    });
  }

  // Abre modal para eliminar un usuario
  deleteUsuario(usuario: Usuario): void {
    if (this.rol === 4) return;
    const dialogRef = this.dialog.open(DeleteUsuarioComponent, {
      data: usuario
    });

    dialogRef.afterClosed().subscribe(res => {
      if (res?.ok) this.cargarUsuarios(this.empresa.id_empresa);
    });
  }

  // Obtiene lista de usuarios conectados
  obtenerConectados(): void {
    this.estadoConexionService.getConectados().subscribe(res => {
      if (res.ok) {
        this.usuariosConectados = res.data;
      }
    });
  }

  // Verifica si un usuario está en la lista de conectados
  isUsuarioConectado(id: number): boolean {
    return this.usuariosConectados.includes(id);
  }

  // Controla los cambios en los filtros para aplicar a la tabla
  onFilterChanges(): void {
    this.usuarioFilter.valueChanges.subscribe(val => {
      this.filterValues.usuario = val ?? '';
      this.dataSource.filter = JSON.stringify(this.filterValues);
    });

    this.nombrePublicoFilter.valueChanges.subscribe(val => {
      this.filterValues.nombre_publico = val ?? '';
      this.dataSource.filter = JSON.stringify(this.filterValues);
    });

    this.observacionesFilter.valueChanges.subscribe(val => {
      this.filterValues.observaciones = val ?? '';
      this.dataSource.filter = JSON.stringify(this.filterValues);
    });

    this.habilitadoFilter.valueChanges.subscribe(val => {
      this.filterValues.habilitado = val ?? '';
      this.dataSource.filter = JSON.stringify(this.filterValues);
    });

    this.conectadoFilter.valueChanges.subscribe(val => {
      this.filterValues.conectado = val ?? '';
      this.dataSource.filter = JSON.stringify(this.filterValues);
    });
  }

  // Crea la función personalizada para filtrar los usuarios
  createFilter(): (usuario: Usuario, filter: string) => boolean {
    return (usuario: Usuario, filter: string): boolean => {
      const searchTerms = JSON.parse(filter);
      const conectado = this.usuariosConectados.includes(usuario.id_usuario ?? -1) ? '1' : '0';

      return usuario.usuario.toLowerCase().includes(searchTerms.usuario)
        && (usuario.nombre_publico?.toLowerCase() ?? '').includes(searchTerms.nombre_publico)
        && (usuario.observaciones?.toLowerCase() ?? '').includes(searchTerms.observaciones)
        && usuario.habilitado.toString().includes(searchTerms.habilitado)
        && conectado.includes(searchTerms.conectado);
    };
  }
}
