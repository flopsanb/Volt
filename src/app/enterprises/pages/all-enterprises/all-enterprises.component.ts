import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatDialog } from '@angular/material/dialog';
import { Overlay } from '@angular/cdk/overlay';
import { FormControl } from '@angular/forms';

import { Enterprise } from '../../interfaces/enterprise.interface';
import { EnterprisesService } from 'src/app/services/enterprises.service';

import { SelectionModel } from '@angular/cdk/collections';

import { AddEnterpriseComponent } from './add-enterprise/add-enterprise.component';
import { DeleteEnterpriseComponent } from './delete-enterprise/delete-enterprise.component';
import { EnterprisesDetailsComponent } from './enterprises-details/enterprises-details.component';

@Component({
  selector: 'app-all-enterprises',
  templateUrl: './all-enterprises.component.html',
  styleUrls: ['./all-enterprises.component.css']
})
export class AllEnterprisesComponent implements OnInit {
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator | null = null;
  @ViewChild(MatSort, { static: true }) sort: MatSort | null = null;

  // Fuente de datos para la tabla de empresas
  dataSource: MatTableDataSource<Enterprise> = new MatTableDataSource();

  // Permisos del usuario actual cargados desde el backend
  rawPermises: { [key: string]: number } = {};

  // Controles para filtros individuales por columna
  idEmpresaFilter = new FormControl('');
  nombreEmpresaFilter = new FormControl('');
  empleadosTotalesFilter = new FormControl('');
  proyectosTotalesFilter = new FormControl('');

  // Modelo de selección de filas (solo una a la vez)
  selection: SelectionModel<Enterprise> = new SelectionModel<Enterprise>(false, []);

  // Columnas visibles en la tabla
  displayedColumns: string[] = [];

  private filterValues = {
    id_empresa: '',
    nombre_empresa: '',
    empleados_totales: '',
    proyectos_totales: ''
  };

  constructor(
    public dialog: MatDialog,
    private enterpriseService: EnterprisesService,
    private overlay: Overlay
  ) {}

  // Método que se ejecuta al iniciar el componente
  ngOnInit(): void {
    this.getEnterprises();
  }

  // Verifica si el usuario tiene un permiso específico
  tienePermisos(clave: string): boolean {
    return this.rawPermises?.[clave] === 1;
  }

  // Carga la lista de empresas desde el backend y configura la tabla
  async getEnterprises() {
    const RESPONSE = await this.enterpriseService.getAllEmpresas().toPromise();
    this.rawPermises = RESPONSE?.permises ?? {};

    if (RESPONSE?.ok) {
      this.dataSource.data = RESPONSE.data as Enterprise[];
      if (this.sort) this.dataSource.sort = this.sort;
      if (this.paginator) this.dataSource.paginator = this.paginator;
      this.dataSource.filterPredicate = this.createFilter();
      this.onChanges();

      this.displayedColumns = ['id_empresa', 'logo_url', 'nombre_empresa', 'empleados_totales', 'proyectos_totales'];

      // Añade la columna de acciones si el usuario tiene los permisos correspondientes
      if (
        this.tienePermisos('gestionar_empresas') &&
        this.tienePermisos('borrar_empresas')
      ) {
        this.displayedColumns.push('acciones');
      }
    }
  }

  // Abre el diálogo para añadir una nueva empresa
  async addEnterprise() {
    if (!this.tienePermisos('crear_empresas')) return;

    const dialogRef = this.dialog.open(AddEnterpriseComponent, {
      scrollStrategy: this.overlay.scrollStrategies.noop()
    });
    const RESULT = await dialogRef.afterClosed().toPromise();
    if (RESULT?.ok) {
      this.ngOnInit();
    }
  }

  // Abre el diálogo para editar una empresa existente
  async editEnterprise(empresa: Enterprise) {
    if (!this.tienePermisos('gestionar_empresas')) return;

    const dialogRef = this.dialog.open(EnterprisesDetailsComponent, {
      data: empresa,
      scrollStrategy: this.overlay.scrollStrategies.noop()
    });
    const RESULT = await dialogRef.afterClosed().toPromise();
    if (RESULT?.ok) {
      this.ngOnInit();
    }
  }

  // Abre el diálogo para eliminar una empresa existente
  async deleteEnterprise(empresa: Enterprise) {
    if (!this.tienePermisos('borrar_empresas')) return;

    const dialogRef = this.dialog.open(DeleteEnterpriseComponent, {
      data: empresa,
      scrollStrategy: this.overlay.scrollStrategies.noop()
    });
    const RESULT = await dialogRef.afterClosed().toPromise();
    if (RESULT?.ok) {
      this.ngOnInit();
    }
  }

  createFilter(): (empresa: Enterprise, filter: string) => boolean {
    return (empresa: Enterprise, filter: string): boolean => {
      const searchTerms = JSON.parse(filter);
      return empresa.id_empresa.toString().includes(searchTerms.id_empresa)
        && empresa.nombre_empresa.toLowerCase().includes(searchTerms.nombre_empresa.toLowerCase())
        && empresa.empleados_totales.toString().includes(searchTerms.empleados_totales)
        && empresa.proyectos_totales.toString().includes(searchTerms.proyectos_totales);
    };
  }

  // Configura los filtros reactivos para cada campo de búsqueda
  onChanges() {
    this.idEmpresaFilter.valueChanges.subscribe(value => {
      this.filterValues.id_empresa = value ?? '';
      this.dataSource.filter = JSON.stringify(this.filterValues);
    });

    this.nombreEmpresaFilter.valueChanges.subscribe(value => {
      this.filterValues.nombre_empresa = value ?? '';
      this.dataSource.filter = JSON.stringify(this.filterValues);
    });

    this.empleadosTotalesFilter.valueChanges.subscribe(value => {
      this.filterValues.empleados_totales = value ?? '';
      this.dataSource.filter = JSON.stringify(this.filterValues);
    });

    this.proyectosTotalesFilter.valueChanges.subscribe(value => {
      this.filterValues.proyectos_totales = value ?? '';
      this.dataSource.filter = JSON.stringify(this.filterValues);
    });
  }

  // Abre el diálogo con los detalles de la empresa seleccionada
  async openEnterpriseDetails(empresa: Enterprise) {
    const dialogRef = this.dialog.open(EnterprisesDetailsComponent, {
      width: '70em',
      maxWidth: '70em',
      scrollStrategy: this.overlay.scrollStrategies.noop(),
      disableClose: true,
      data: { empresa }
    });
    await dialogRef.afterClosed().toPromise();
    this.getEnterprises();
  }
}
