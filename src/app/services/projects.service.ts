import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { URL_API } from 'src/environments/environments';
import { Project } from '../enterprises/interfaces/project.interface';
import { Observable } from 'rxjs';
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

  proyectos: Project[] = [];

  constructor(private http: HttpClient) {}

  getAllProyectos(): Observable<ApiResponse> {
    return this.http.get<ApiResponse>(`${URL_API}/${ENDPOINT}.php`);
  }

  addProyecto(proyecto: Project): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(`${URL_API}/${ENDPOINT}.php`, proyecto);
  }

  editProyecto(proyecto: Project): Observable<ApiResponse> {
    return this.http.put<ApiResponse>(`${URL_API}/${ENDPOINT}.php`, proyecto);
  }

  deleteProyecto(idProyecto: string | number): Observable<ApiResponse> {
    return this.http.delete<ApiResponse>(`${URL_API}/${ENDPOINT}.php?id=${idProyecto}`);
  }

  removeProyecto(idProyecto: number): void {
    this.proyectos = this.proyectos.filter(p => p.id_proyecto !== idProyecto);
  }

  updateProyecto(proyecto: Project): void {
    const index = this.proyectos.findIndex(p => p.id_proyecto === proyecto.id_proyecto);
    if (index !== -1) {
      this.proyectos[index] = proyecto;
    }
  }
}
