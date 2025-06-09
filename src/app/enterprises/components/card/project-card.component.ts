import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Project } from '../../interfaces/project.interface';
import { Router } from '@angular/router';

/**
 * Componente reutilizable que representa una tarjeta visual para un proyecto.
 * Muestra su estado, nombre y acciones posibles según los permisos definidos por Input().
 */
@Component({
  selector: 'project-card',
  templateUrl: './project-card.component.html',
  styleUrls: ['./project-card.component.scss']
})
export class ProjectCardComponent {

  // Proyecto que se va a mostrar en la tarjeta
  @Input() proyecto!: Project;

  // Permisos controlados desde el componente padre
  @Input() canEdit: boolean = false;
  @Input() canDelete: boolean = false;
  @Input() canToggleVisibility: boolean = false;
  @Input() canToggleEnabled: boolean = false;

  // Eventos emitidos al componente padre según las acciones del usuario
  @Output() edit = new EventEmitter<Project>();
  @Output() delete = new EventEmitter<Project>();
  @Output() toggleVisibility = new EventEmitter<Project>();
  @Output() toggleEnabled = new EventEmitter<Project>();

  constructor(private router: Router) {}

  // Navega al informe del proyecto
  verInforme(id: number) {
    this.router.navigate([`/enterprises/proyectos/ver/${id}`]);
  }
}