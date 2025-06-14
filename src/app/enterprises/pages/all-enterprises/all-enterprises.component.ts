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

  dataSource: MatTableDataSource<Enterprise> = new MatTableDataSource();
  rawPermises: { [key: string]: number } = {};

  idEmpresaFilter = new FormControl('');
  nombreEmpresaFilter = new FormControl('');
  empleadosTotalesFilter = new FormControl('');
  proyectosTotalesFilter = new FormControl('');

  selection: SelectionModel<Enterprise> = new SelectionModel<Enterprise>(false, []);
  displayedColumns: string[] = ['id_empresa', 'logo_url', 'nombre_empresa', 'empleados_totales', 'proyectos_totales'];

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

  ngOnInit(): void {
    this.getEnterprises();
  }

  tienePermisos(clave: string): boolean {
    const permiso = this.rawPermises?.[clave] === 1;
    console.log(`Permiso [${clave}]:`, permiso);
    return permiso;
  }

  async getEnterprises() {
    const RESPONSE = await this.enterpriseService.getAllEmpresas().toPromise();
    this.rawPermises = RESPONSE?.permises ?? {};
    console.log('📦 Permisos recibidos del backend:', this.rawPermises);

    if (RESPONSE?.ok) {
      this.dataSource.data = RESPONSE.data as Enterprise[];

      if (this.sort) this.dataSource.sort = this.sort;
      if (this.paginator) this.dataSource.paginator = this.paginator;

      this.dataSource.filterPredicate = this.createFilter();
      this.onChanges();

      console.log('🔍 Evaluando condiciones para añadir columna de acciones...');
      const puedeEditar = this.tienePermisos('editar_empresas');
      const puedeBorrar = this.tienePermisos('borrar_empresas');
      const puedeCrear = this.tienePermisos('crear_empresas');

      console.log('📝 crear_empresas:', puedeCrear);
      console.log('✏️ editar_empresas:', puedeEditar);
      console.log('🗑️ borrar_empresas:', puedeBorrar);

      if (puedeCrear && puedeEditar && puedeBorrar) {
        console.log('✅ Añadiendo columna "acciones"');
        this.displayedColumns.push('acciones');
      } else {
        console.warn('🚫 No se cumplen todos los permisos para mostrar "acciones".');
      }
    } else {
      console.error('❌ Error cargando empresas:', RESPONSE?.message);
    }
  }

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

  async editEnterprise(empresa: Enterprise) {
    if (!this.tienePermisos('editar_empresas')) return;

    const dialogRef = this.dialog.open(EnterprisesDetailsComponent, {
      data: empresa,
      scrollStrategy: this.overlay.scrollStrategies.noop()
    });
    const RESULT = await dialogRef.afterClosed().toPromise();
    if (RESULT?.ok) {
      this.ngOnInit();
    }
  }

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
