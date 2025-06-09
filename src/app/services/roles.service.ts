import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { URL_API } from 'src/environments/environments';
import { Rol } from '../enterprises/interfaces/rol';
import { Observable } from 'rxjs';
import { CommonService } from './common.service';
import { ApiResponse } from '../auth/interfaces/api-response';

const ENDPOINT = 'rol';

/**
 * Servicio que gestiona las operaciones CRUD sobre los roles de usuario.
 * Se comunica con el backend y mantiene una lista local de roles en memoria.
 */
@Injectable({
  providedIn: 'root'
})
export class RolesService {

  roles!: Rol[]; // Lista local de roles utilizada por componentes que necesiten acceso directo

  constructor(private http: HttpClient, private commonService: CommonService) {}

  // Obtiene todos los roles desde el backend
  getAllRoles(): Observable<ApiResponse> {
    return this.http.get<ApiResponse>(`${URL_API}/${ENDPOINT}.php`, { headers: this.commonService.headers });
  }

  // Envía un nuevo rol al backend para su creación
  addRol(rol: Rol) {
    const body = JSON.stringify(rol);
    return this.http.post<ApiResponse>(`${URL_API}/${ENDPOINT}.php`, body, { headers: this.commonService.headers });
  }

  // Actualiza los datos de un rol existente en el backend
  editRol(rol: Rol) {
    const body = JSON.stringify(rol);
    return this.http.put<ApiResponse>(`${URL_API}/${ENDPOINT}.php`, body, { headers: this.commonService.headers });
  }

  // Elimina un rol del backend por su ID
  deleteRol(idRol: string | number) {
    return this.http.delete<ApiResponse>(`${URL_API}/${ENDPOINT}.php?id=${idRol}`, { headers: this.commonService.headers });
  }

  // Elimina un rol de la lista local de roles
  removeRol(idRol: number) {
    this.roles = this.roles.filter(rol => {
      return Number(rol.id_rol) !== Number(idRol);
    });
  }

  // Actualiza un rol en la lista local
  updateRol(rol: Rol) {
    let index = null;
    this.roles.filter((rolFilter, indexFilter) => {
      if (rol.id_rol === rolFilter.id_rol) {
        index = indexFilter;
      }
    });

    if (index) {
      this.roles[index] = rol;
    }
  }
}
