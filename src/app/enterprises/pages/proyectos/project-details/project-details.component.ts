import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ProjectService } from 'src/app/services/projects.service';
import { Project } from 'src/app/enterprises/interfaces/project.interface';

/**
 * Componente para mostrar el detalle de un proyecto.
 * Carga el iframe asociado al proyecto seleccionado por ID.
 * 
 * - Obtiene el ID desde la ruta.
 * - Busca el proyecto en la lista general.
 * - Extrae el `src` del iframe para renderizarlo de forma segura.
 */
@Component({
  selector: 'app-project-details',
  templateUrl: './project-details.component.html',
  styleUrls: ['./project-details.component.css']
})
export class ProjectDetailsComponent implements OnInit {

  iframeSrc: string = ''; // URL limpia extraída del iframe del proyecto

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private projectService: ProjectService
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');

    this.projectService.getAllProyectos().subscribe(res => {
      const proyectos = res.data as Project[];
      const proyecto = proyectos.find(p => p.id_proyecto.toString() === id);

      if (proyecto) {
        const extracted = this.extractIframeSrc(proyecto.iframe_proyecto);
        this.iframeSrc = extracted;
      } else {
        // Aquí ya no se muestra error por consola para evitar exposición
        // Podrías redirigir o mostrar un snackBar si quieres avisar al usuario
        this.goBack();
      }
    });
  }

  /**
   * Extrae el valor del atributo `src` desde un string HTML con iframe.
   * @param iframeHtml HTML que contiene un iframe completo
   * @returns solo el valor del src o una cadena vacía
   */
  extractIframeSrc(iframeHtml: string): string {
    const match = iframeHtml.match(/src="([^"]+)"/);
    return match ? match[1] : '';
  }

  /**
   * Redirige al listado general de proyectos.
   */
  goBack(): void {
    this.router.navigate(['/enterprises/proyectos']);
  }
}
