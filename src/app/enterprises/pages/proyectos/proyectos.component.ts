import { Component, OnInit } from '@angular/core';
import { ProjectService } from 'src/app/services/projects.service';
import { Project } from '../../interfaces/project.interface';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { EditProyectoComponent } from './edit-proyecto/edit-proyecto.component';
import { DeleteProyectoComponent } from './delete-proyecto/delete-proyecto.component';
import { AddProyectoComponent } from './add-proyecto/add-proyecto.component';

@Component({
  selector: 'app-proyectos',
  templateUrl: './proyectos.component.html',
  styleUrls: ['./proyectos.component.scss']
})
export class ProyectosComponent implements OnInit {

  proyectos: Project[] = [];
  proyectosEmpresa: Project[] = [];
  proyectosOtrasEmpresas: Project[] = [];
  proyectosOtrasEmpresasPorEmpresa: { nombre_empresa: string; proyectos: Project[] }[] = [];

  id_empresa: string | null = localStorage.getItem('id_empresa');
  id_rol: string | null = localStorage.getItem('id_rol');
  esGlobal: boolean = false;

  rawPermises: { [key: string]: number } = {};

  constructor(
    private projectService: ProjectService,
    private router: Router,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.projectService.getAllProyectos().subscribe((response) => {
      console.log('🔓 Permisos recibidos del backend:', response.permises);
      const projects = response.data as Project[];
      this.rawPermises = response.permises || {};
      this.esGlobal = this.id_rol === '1' || this.id_rol === '2';

      this.proyectosEmpresa = projects.filter(p => this.puedeVerProyecto(p));
      this.proyectosOtrasEmpresas = this.esGlobal ? projects.filter(p => p.id_empresa.toString() !== this.id_empresa) : [];
      this.proyectosOtrasEmpresasPorEmpresa = this.agruparPorEmpresa(this.proyectosOtrasEmpresas);
    });
  }

  tienePermisos(key: string): boolean {
    return this.rawPermises?.[key] === 1;
  }

  puedeVerProyecto(p: Project): boolean {
    const mismaEmpresa = p.id_empresa.toString() === this.id_empresa;
    if (!mismaEmpresa) return false;

    if (this.esGlobal) return true;
    if (this.id_rol === '3') return p.habilitado === 1;
    if (this.id_rol === '4') return p.habilitado === 1 && p.visible === 1;

    return false;
  }

  agruparPorEmpresa(proyectos: Project[]): { nombre_empresa: string; proyectos: Project[] }[] {
    const agrupado: { [key: string]: Project[] } = {};
    proyectos.forEach(p => {
      const nombre = p.nombre_empresa || `Empresa ${p.id_empresa}`;
      if (!agrupado[nombre]) agrupado[nombre] = [];
      agrupado[nombre].push(p);
    });

    return Object.entries(agrupado).map(([nombre_empresa, proyectos]) => ({ nombre_empresa, proyectos }));
  }

  async addProject() {
    console.log('🆕 Intentando abrir modal de añadir proyecto');
    if (!this.tienePermisos('crear_proyectos')) {
      console.warn('🚫 No tienes permisos para crear proyectos');
      return;
    }

    const dialogRef = this.dialog.open(AddProyectoComponent, { width: '600px' });
    dialogRef.afterClosed().subscribe((result) => {
      console.log('📥 Modal de añadir cerrado con:', result);
      if (result?.ok) {
        console.log('✅ Proyecto creado correctamente, recargando lista');
        this.showSnackbar('Proyecto creado con éxito');
        this.ngOnInit();
      } else {
        console.log('❌ Proyecto no creado o cancelado');
      }
    });
  }

  async editProject(proyecto: Project) {
    console.log('✏️ Editar proyecto llamado:', proyecto);
    if (!this.tienePermisos('gestionar_proyectos')) {
      console.warn('🚫 Sin permisos para editar');
      return;
    }

    const dialogRef = this.dialog.open(EditProyectoComponent, {
      width: '600px',
      autoFocus: false,
      disableClose: false,
      data: proyecto
    });

    dialogRef.afterClosed().subscribe((result) => {
      console.log('📥 Diálogo cerrado con resultado:', result);
      if (result?.ok) {
        this.showSnackbar('Proyecto actualizado');
        this.ngOnInit();
      }
    });
  }


  async deleteProject(proyecto: Project) {
    console.log('🗑️ Eliminar proyecto llamado:', proyecto);
    if (!this.tienePermisos('borrar_proyectos')) {
      console.warn('🚫 Sin permisos para borrar');
      return;
    }

    const dialogRef = this.dialog.open(DeleteProyectoComponent, {
      width: '400px',
      data: proyecto
    });

    dialogRef.afterClosed().subscribe((result) => {
      console.log('📥 Diálogo de borrado cerrado con:', result);
      if (result?.ok) {
        console.log('✅ Proyecto eliminado, actualizando lista');
        this.proyectosEmpresa = this.proyectosEmpresa.filter(p => p.id_proyecto !== proyecto.id_proyecto);
        this.showSnackbar('Proyecto eliminado correctamente');
        this.ngOnInit();
      } else {
        console.log('❌ Proyecto no eliminado o cancelado');
      }
    });
  }


  /**
   * Cambia la visibilidad de un proyecto (ocultar/mostrar).
   * @param proyecto Proyecto a modificar
   */
  toggleVisibility(proyecto: Project) {
    console.log('👁️ Toggle Visibilidad llamado:', proyecto);
    if (!this.tienePermisos('ocultar_proyectos')) {
      console.warn('🚫 Sin permisos para ocultar proyectos');
      return;
    }

    proyecto.visible = proyecto.visible === 1 ? 0 : 1;
    console.log(`↔️ Cambiando visibilidad a: ${proyecto.visible}`);

    this.projectService.editProyecto(proyecto).subscribe({
      next: () => {
        console.log('✅ Visibilidad cambiada exitosamente');
        this.showSnackbar('Visibilidad cambiada');
      },
      error: (err) => {
        console.error('❌ Error al cambiar visibilidad:', err);
        this.showSnackbar('Error al cambiar visibilidad');
      }
    });
  }

  /**
   * Cambia el estado de habilitación del proyecto.
   * @param proyecto Proyecto a modificar
   */
  toggleEnabled(proyecto: Project) {
    console.log('🔌 Toggle Habilitado llamado:', proyecto);
    if (!this.tienePermisos('deshabilitar_proyectos')) {
      console.warn('🚫 Sin permisos para deshabilitar proyectos');
      return;
    }

    proyecto.habilitado = proyecto.habilitado === 1 ? 0 : 1;
    console.log(`↔️ Cambiando habilitado a: ${proyecto.habilitado}`);

    this.projectService.editProyecto(proyecto).subscribe({
      next: () => {
        console.log('✅ Estado de habilitación cambiado exitosamente');
        this.showSnackbar('Estado de habilitación cambiado');
      },
      error: (err) => {
        console.error('❌ Error al cambiar habilitación:', err);
        this.showSnackbar('Error al cambiar habilitación');
      }
    });
  }

  showSnackbar(message: string): void {
    this.snackBar.open(message, 'Cerrar', {
      duration: 3000,
      horizontalPosition: 'center',
      verticalPosition: 'bottom',
    });
  }
}