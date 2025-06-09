import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatDialog } from '@angular/material/dialog';
import { Overlay } from '@angular/cdk/overlay';
import { FormControl } from '@angular/forms';
import { Permises } from 'src/app/auth/interfaces/api-response';

import { Enterprise } from '../../interfaces/enterprise.interface';
import { EnterprisesService } from 'src/app/services/enterprises.service';

import { SelectionModel } from '@angular/cdk/collections';

import { AddEnterpriseComponent } from './add-enterprise/add-enterprise.component';
import { DeleteEnterpriseComponent } from './delete-enterprise/delete-enterprise.component';
import { EnterprisesDetailsComponent } from './enterprises-details/enterprises-details.component';

/**
 * Componente para gestionar todas las empresas del sistema.
 * 
 * - Lista de empresas con paginación, ordenación y filtros.
 * - Permite añadir, editar, eliminar y ver detalles de una empresa.
 * - Usa Angular Material (mat-table) para la UI.
 */
@Component({
  selector: 'app-all-enterprises',
  templateUrl: './all-enterprises.component.html',
  styleUrls: ['./all-enterprises.component.css']
})
export class AllEnterprisesComponent implements OnInit {
  // Referencias a paginador y ordenación de la tabla
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator | null = null;
  @ViewChild(MatSort, { static: true }) sort: MatSort | null = null;

  // Fuente de datos de la tabla
  dataSource: MatTableDataSource<Enterprise> = new MatTableDataSource();

  // Permisos del usuario logueado
  permises: Permises | undefined;

  // Filtros individuales por cada campo
  idEmpresaFilter = new FormControl('');
  nombreEmpresaFilter = new FormControl('');
  empleadosTotalesFilter = new FormControl('');
  proyectosTotalesFilter = new FormControl('');

  // Para selección de filas (aunque solo se permite una a la vez)
  selection: SelectionModel<Enterprise> = new SelectionModel<Enterprise>(false, []);

  // Columnas mostradas en la tabla
  displayedColumns: string[] = ['id_empresa', 'logo_url', 'nombre_empresa', 'empleados_totales', 'proyectos_totales', 'actions'];

  // Valores actuales de los filtros para la tabla
  private filterValues = {
    id_empresa: '',
    nombre_empresa: '',
    empleados_totales: '',
    proyectos_totales: ''
  };

  constructor(
    public dialog: MatDialog, // Servicio de diálogos de Angular Material
    private enterpriseService: EnterprisesService, // Servicio para operaciones con empresas
    private overlay: Overlay // Usado para controlar el scroll en los modales
  ) {}

  /**
   * Al inicializar el componente se cargan todas las empresas.
   */
  ngOnInit(): void {
    this.getEnterprises();
  }

  /**
   * Obtiene todas las empresas desde el backend y configura la tabla.
   */
  async getEnterprises() {
    const RESPONSE = await this.enterpriseService.getAllEmpresas().toPromise();
    this.permises = RESPONSE?.permises;

    if (RESPONSE?.ok) {
      this.dataSource.data = RESPONSE.data as Enterprise[];
      if (this.sort) this.dataSource.sort = this.sort;
      if (this.paginator) this.dataSource.paginator = this.paginator;
      this.dataSource.filterPredicate = this.createFilter();
      this.onChanges();
    }
  }

  /**
   * Abre el modal para añadir una nueva empresa.
   * Si se confirma, recarga la lista.
   */
  async addEnterprise() {
    const dialogRef = this.dialog.open(AddEnterpriseComponent, {
      scrollStrategy: this.overlay.scrollStrategies.noop()
    });
    const RESULT = await dialogRef.afterClosed().toPromise();
    if (RESULT?.ok) {
      this.ngOnInit();
    }
  }

  /**
   * Abre el modal de edición para una empresa.
   */
  async editEnterprise(empresa: Enterprise) {
    const dialogRef = this.dialog.open(EnterprisesDetailsComponent, {
      data: empresa,
      scrollStrategy: this.overlay.scrollStrategies.noop()
    });
    const RESULT = await dialogRef.afterClosed().toPromise();
    if (RESULT?.ok) {
      this.ngOnInit();
    }
  }

  /**
   * Abre el modal de confirmación para eliminar una empresa.
   */
  async deleteEnterprise(empresa: Enterprise) {
    const dialogRef = this.dialog.open(DeleteEnterpriseComponent, {
      data: empresa,
      scrollStrategy: this.overlay.scrollStrategies.noop()
    });
    const RESULT = await dialogRef.afterClosed().toPromise();
    if (RESULT?.ok) {
      this.ngOnInit();
    }
  }

  /**
   * Define el comportamiento personalizado del filtro múltiple de la tabla.
   */
  createFilter(): (empresa: Enterprise, filter: string) => boolean {
    return (empresa: Enterprise, filter: string): boolean => {
      const searchTerms = JSON.parse(filter);
      return empresa.id_empresa.toString().includes(searchTerms.id_empresa)
        && empresa.nombre_empresa.toLowerCase().includes(searchTerms.nombre_empresa.toLowerCase())
        && empresa.empleados_totales.toString().includes(searchTerms.empleados_totales)
        && empresa.proyectos_totales.toString().includes(searchTerms.proyectos_totales);
    };
  }

  /**
   * Escucha los cambios en los campos de filtro y actualiza la tabla.
   */
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

  /**
   * Abre el modal con los detalles completos de una empresa.
   */
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
