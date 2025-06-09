import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { URL_API } from 'src/environments/environments';
import { Project } from '../enterprises/interfaces/project.interface';
import { Observable } from 'rxjs';
import { CommonService } from './common.service';
import { ApiResponse } from '../auth/interfaces/api-response';

const ENDPOINT = 'proyecto';

/**
 * Servicio para gestionar la información de proyectos.
 * Realiza operaciones CRUD mediante peticiones HTTP al backend.
 */
@Injectable({
  providedIn: 'root'
})
export class ProjectService {

  proyectos!: Project[]; // Lista local de proyectos

  constructor(
    private http: HttpClient,
    private commonService: CommonService // Provee los headers de autenticación
  ) {}

  // Obtiene todos los proyectos desde el backend
  getAllProyectos(): Observable<ApiResponse> {
    return this.http.get<ApiResponse>(
      `${URL_API}/${ENDPOINT}.php`,
      { headers: this.commonService.headers }
    );
  }

  // Envía una solicitud para añadir un nuevo proyecto
  addProyecto(proyecto: Project) {
    const body = JSON.stringify(proyecto);
    return this.http.post<ApiResponse>(`${URL_API}/${ENDPOINT}.php`, body, {
      headers: this.commonService.headers
    });
  }

  // Envía una solicitud para actualizar un proyecto existente
  editProyecto(proyecto: Project) {
    const body = JSON.stringify(proyecto);
    return this.http.put<ApiResponse>(`${URL_API}/${ENDPOINT}.php`, body, {
      headers: this.commonService.headers
    });
  }

  // Envía una solicitud para eliminar un proyecto por su ID
  deleteProyecto(idProyecto: string | number) {
    return this.http.delete<ApiResponse>(`${URL_API}/${ENDPOINT}.php?id=${idProyecto}`, {
      headers: this.commonService.headers
    });
  }

  // Elimina un proyecto de la lista local mediante filtrado
  removeProyecto(idProyecto: number) {
    this.proyectos = this.proyectos.filter(proyecto => {
      return Number(proyecto.id_proyecto) !== Number(idProyecto);
    });
  }

  // Actualiza un proyecto en la lista local, identificándolo por su ID
  updateProyecto(proyecto: Project) {
    let index = null;
    this.proyectos.filter((proyectoFilter, indexFilter) => {
      if (proyecto.id_proyecto === proyectoFilter.id_proyecto) {
        index = indexFilter;
      }
    });

    if (index !== null) {
      this.proyectos[index] = proyecto;
    }
  }
}
