// src/app/enterprises/pages/my-enterprise/my-enterprise.component.ts

import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { FormControl } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';

import { Usuario } from 'src/app/enterprises/interfaces/usuario';
import { Enterprise } from 'src/app/enterprises/interfaces/enterprise.interface';

import { UsuarioService } from 'src/app/services/usuario.service';
import { EnterprisesService } from 'src/app/services/enterprises.service';
import { EstadoConexionService } from 'src/app/services/estado-conexion.service';

import { AddUsuarioComponent } from './add-usuario/add-usuario.component';
import { EditUsuarioComponent } from './edit-usuario/edit-usuario.component';
import { DeleteUsuarioComponent } from './delete-usuario/delete-usuario.component';

@Component({
  selector: 'app-my-enterprise',
  templateUrl: './my-enterprise.component.html',
  styleUrls: ['./my-enterprise.component.css']
})
export class MyEnterpriseComponent implements OnInit {

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  empresa: Enterprise = {
    id_empresa: 0,
    nombre_empresa: '',
    logo_url: '',
    empleados_totales: 0,
    proyectos_totales: 0
  };

  dataSource: MatTableDataSource<Usuario> = new MatTableDataSource();
  usuariosConectados: number[] = [];
  editMode = false;
  displayedColumns: string[] = ['usuario', 'nombre_publico', 'observaciones', 'habilitado', 'conectado'];

  usuarioFilter = new FormControl('');
  nombrePublicoFilter = new FormControl('');
  observacionesFilter = new FormControl('');
  habilitadoFilter = new FormControl('');
  conectadoFilter = new FormControl('');

  private filterValues = {
    usuario: '',
    nombre_publico: '',
    observaciones: '',
    habilitado: '',
    conectado: ''
  };

  id_empresa: string | null = localStorage.getItem('id_empresa');
  id_rol: string | null = localStorage.getItem('id_rol');
  esGlobal: boolean = false;
  rawPermises: { [key: string]: number } = {};

  constructor(
    private usuarioService: UsuarioService,
    private enterpriseService: EnterprisesService,
    private estadoConexionService: EstadoConexionService,
    private snackBar: MatSnackBar,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    const id_empresa = parseInt(this.id_empresa || '0', 10);
    this.esGlobal = this.id_rol === '1' || this.id_rol === '2';

    if (id_empresa) {
      this.cargarEmpresa(id_empresa);
      this.cargarUsuarios(id_empresa);
      this.obtenerConectados();
      this.onFilterChanges();
    } else {
      this.snackBar.open('No se encontró el ID de la empresa', 'Cerrar', { duration: 3000 });
    }
  }

  tienePermisos(clave: string): boolean {
    return this.rawPermises?.[clave] === 1;
  }

  cargarEmpresa(id_empresa: number): void {
    this.enterpriseService.getEmpresaById(id_empresa).subscribe(res => {
      if (res.ok) {
        this.empresa = res.data;
      } else {
        this.snackBar.open(res.message ?? 'Error al cargar la empresa', 'Cerrar', { duration: 3000 });
      }
    });
  }

  cargarUsuarios(id_empresa: number): void {
    this.usuarioService.getUsuariosByEmpresa(id_empresa).subscribe(res => {
      if (res.ok) {
        this.dataSource.data = res.data;
        this.rawPermises = res.permises || {};
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        this.dataSource.filterPredicate = this.createFilter();

        if (this.tienePermisos('gestionar_mi_empresa')) {
          if (!this.displayedColumns.includes('acciones')) {
            this.displayedColumns.push('acciones');
          }
        }
      } else {
        this.snackBar.open(res.message ?? 'Error al cargar usuarios', 'Cerrar', { duration: 3000 });
      }
    });
  }

  toggleEdit(): void {
    if (!this.tienePermisos('gestionar_mi_empresa')) return;
    this.editMode = !this.editMode;
  }

  guardarCambios(): void {
    if (!this.tienePermisos('gestionar_mi_empresa')) return;

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

  addUsuario(): void {
    if (!this.tienePermisos('gestionar_mi_empresa')) return;

    const dialogRef = this.dialog.open(AddUsuarioComponent, {
      data: { id_empresa: this.empresa.id_empresa }
    });

    dialogRef.afterClosed().subscribe(res => {
      if (res?.ok) this.cargarUsuarios(this.empresa.id_empresa);
    });
  }

  editUsuario(usuario: Usuario): void {
    if (!this.tienePermisos('gestionar_mi_empresa')) return;

    const dialogRef = this.dialog.open(EditUsuarioComponent, {
      data: usuario
    });

    dialogRef.afterClosed().subscribe(res => {
      if (res?.ok) this.cargarUsuarios(this.empresa.id_empresa);
    });
  }

  deleteUsuario(usuario: Usuario): void {
    if (!this.tienePermisos('gestionar_mi_empresa')) return;

    const dialogRef = this.dialog.open(DeleteUsuarioComponent, {
      data: usuario
    });

    dialogRef.afterClosed().subscribe(res => {
      if (res?.ok) this.cargarUsuarios(this.empresa.id_empresa);
    });
  }

  obtenerConectados(): void {
    this.estadoConexionService.getConectados().subscribe(res => {
      if (res.ok) {
        this.usuariosConectados = res.data;
      }
    });
  }

  isUsuarioConectado(id: number): boolean {
    return this.usuariosConectados.includes(id);
  }

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
