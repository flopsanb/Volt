import { Component, OnInit } from '@angular/core';
import { ProjectService } from 'src/app/services/projects.service';
import { Project } from '../../interfaces/project.interface';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { EditProyectoComponent } from './edit-proyecto/edit-proyecto.component';
import { DeleteProyectoComponent } from './delete-proyecto/delete-proyecto.component';
import { AddProyectoComponent } from './add-proyecto/add-proyecto.component';

/**
 * Componente principal de gestión de proyectos.
 * 
 * Se encarga de:
 * - Cargar todos los proyectos y clasificarlos según empresa y permisos.
 * - Permitir añadir, editar, eliminar, deshabilitar u ocultar proyectos.
 * - Mostrar la interfaz en función del rol del usuario (global o empresa).
 */
@Component({
  selector: 'app-proyectos',
  templateUrl: './proyectos.component.html',
  styleUrls: ['./proyectos.component.scss']
})

export class ProyectosComponent implements OnInit {

  // Listados de proyectos según origen
  proyectos: Project[] = [];
  proyectosEmpresa: Project[] = [];
  proyectosOtrasEmpresas: Project[] = [];
  proyectosOtrasEmpresasPorEmpresa: { nombre_empresa: string; proyectos: Project[] }[] = [];

  // Datos del usuario logueado
  id_empresa: string | null = localStorage.getItem('id_empresa');
  id_rol: string | null = localStorage.getItem('id_rol');
  esGlobal: boolean = false;

  // Permisos según backend
  permises: any = {
    add: false,
    edit: false,
    delete: false,
    ocultar: false
  };

  constructor(
    private projectService: ProjectService,
    private router: Router,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {}

  /**
   * Carga inicial de proyectos y permisos personalizados.
   * Aplica filtros según el tipo de rol para mostrar datos específicos.
   */
  ngOnInit(): void {
    this.projectService.getAllProyectos().subscribe((response) => {
      const projects = response.data as Project[];
      const rawPermises = response.permises;

      const id_rol = Number(this.id_rol);
      const id_empresa = this.id_empresa;

      this.permises = {
        add: rawPermises?.crear_proyectos === 1,
        edit: rawPermises?.crear_proyectos === 1 || rawPermises?.gestionar_usuarios_globales === 1,
        delete: rawPermises?.borrar_proyectos === 1,
        ocultar: rawPermises?.gestionar_usuarios_empresa === 1 || rawPermises?.gestionar_usuarios_globales === 1,
        deshabilitar: rawPermises?.deshabilitar_proyectos === 1 || rawPermises?.gestionar_usuarios_globales === 1,
      };

      this.esGlobal = id_rol === 1 || id_rol === 2;

      // Proyectos visibles para el usuario actual
      this.proyectosEmpresa = projects.filter(p => {
        const mismaEmpresa = p.id_empresa.toString() === id_empresa;
        if (!mismaEmpresa) return false;

        if (this.esGlobal) return true;
        if (id_rol === 3) return p.habilitado === 1;
        if (id_rol === 4) return p.habilitado === 1 && p.visible === 1;
        return false;
      });

      // Proyectos de otras empresas (solo visibles para roles globales)
      this.proyectosOtrasEmpresas = this.esGlobal
        ? projects.filter(p => p.id_empresa.toString() !== id_empresa)
        : [];

      // Agrupar proyectos de otras empresas por nombre
      const agrupado: { [key: string]: Project[] } = {};
      this.proyectosOtrasEmpresas.forEach(p => {
        const nombre = p.nombre_empresa || `Empresa ${p.id_empresa}`;
        if (!agrupado[nombre]) agrupado[nombre] = [];
        agrupado[nombre].push(p);
      });

      this.proyectosOtrasEmpresasPorEmpresa = Object.entries(agrupado).map(([nombre_empresa, proyectos]) => ({
        nombre_empresa,
        proyectos
      }));
    });
  }

  /**
   * Abre el diálogo para crear un nuevo proyecto.
   */
  async addProject() {
    const dialogRef = this.dialog.open(AddProyectoComponent, {
      width: '600px'
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result?.ok) {
        this.showSnackbar('Proyecto creado con éxito');
        this.ngOnInit();
      }
    });
  }

  /**
   * Abre el diálogo para editar un proyecto existente.
   * @param proyecto Proyecto a editar
   */
  async editProject(proyecto: Project) {
    const dialogRef = this.dialog.open(EditProyectoComponent, {
      width: '600px',
      autoFocus: false,
      disableClose: false,
      data: proyecto
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result?.ok) {
        this.showSnackbar('Proyecto actualizado');
        this.ngOnInit();
      }
    });
  }

  /**
   * Abre el diálogo de confirmación para eliminar un proyecto.
   * @param proyecto Proyecto a eliminar
   */
  async deleteProject(proyecto: Project) {
    const dialogRef = this.dialog.open(DeleteProyectoComponent, {
      panelClass: 'custom-dialog-container',
      data: proyecto
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result?.ok) {
        this.proyectos = this.proyectos.filter(p => p.id_proyecto !== proyecto.id_proyecto);
        this.showSnackbar('Proyecto eliminado correctamente');
      }
    });
  }

  /**
   * Muestra un mensaje temporal en pantalla.
   * @param message Texto a mostrar
   */
  showSnackbar(message: string): void {
    this.snackBar.open(message, 'Cerrar', {
      duration: 3000,
      horizontalPosition: 'center',
      verticalPosition: 'bottom',
    });
  }

  /**
   * Cambia la visibilidad de un proyecto (ocultar/mostrar).
   * @param proyecto Proyecto a modificar
   */
  toggleVisibility(proyecto: Project) {
    if (!this.permises.ocultar) return;
    proyecto.visible = proyecto.visible === 1 ? 0 : 1;
    this.projectService.editProyecto(proyecto).subscribe(() => {
      this.showSnackbar('Visibilidad cambiada');
    });
  }

  /**
   * Cambia el estado de habilitación del proyecto.
   * @param proyecto Proyecto a modificar
   */
  toggleEnabled(proyecto: Project) {
    if (!this.permises.deshabilitar) return;
    proyecto.habilitado = proyecto.habilitado === 1 ? 0 : 1;
    this.projectService.editProyecto(proyecto).subscribe(() => {
      this.showSnackbar('Estado de habilitación cambiado');
    });
  }
}