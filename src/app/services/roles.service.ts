import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { URL_API } from 'src/environments/environments';
import { Rol } from '../enterprises/interfaces/rol';
import { Observable } from 'rxjs';
import { CommonService } from './common.service';
import { ApiResponse } from '../auth/interfaces/api-response';

const ENDPOINT = 'rol';

/**
 * Servicio que gestiona las operaciones CRUD sobre los roles de usuario.
 */
@Injectable({
  providedIn: 'root'
})
export class RolesService {

  roles: Rol[] = [];

  constructor(
    private http: HttpClient,
    private commonService: CommonService
  ) {}

  getAllRoles(): Observable<ApiResponse> {
    return this.http.get<ApiResponse>(`${URL_API}/${ENDPOINT}.php`, {
      headers: this.commonService.headers,
      withCredentials: true
    });
  }

  addRol(rol: Rol): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(`${URL_API}/${ENDPOINT}.php`, rol, {
      headers: this.commonService.headers,
      withCredentials: true
    });
  }

  editRol(rol: Rol): Observable<ApiResponse> {
    return this.http.put<ApiResponse>(`${URL_API}/${ENDPOINT}.php`, rol, {
      headers: this.commonService.headers,
      withCredentials: true
    });
  }

  deleteRol(idRol: number | string): Observable<ApiResponse> {
    return this.http.delete<ApiResponse>(`${URL_API}/${ENDPOINT}.php?id=${idRol}`, {
      headers: this.commonService.headers,
      withCredentials: true
    });
  }

  getRolesMiEmpresa(): Observable<ApiResponse> {
    return this.http.get<ApiResponse>(`${URL_API}/roles_empresa.php`, {
      headers: this.commonService.headers,
      withCredentials: true
    });
  }
}
