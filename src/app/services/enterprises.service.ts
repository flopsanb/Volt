import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { URL_API } from 'src/environments/environments';
import { CommonService } from './common.service';
import { ApiResponse } from '../auth/interfaces/api-response';

const ENDPOINT = 'empresa';

/**
 * Servicio encargado de gestionar las empresas (crear, actualizar, eliminar, consultar).
 * Incluye métodos tanto para admins (todas las empresas) como para usuarios normales (su propia empresa).
 */
@Injectable({
  providedIn: 'root'
})
export class EnterprisesService {

  constructor(
    private http: HttpClient,
    private commonService: CommonService
  ) {}

  /** ========================
   *      MÉTODOS GENERALES
   *  ======================== */

  // Obtener todas las empresas (uso exclusivo de admins/superadmins)
  getAllEmpresas(): Observable<ApiResponse> {
    return this.http.get<ApiResponse>(`${URL_API}/${ENDPOINT}.php`, {
      headers: this.commonService.headers
    });
  }

  // Obtener una empresa por ID (modo admin)
  getEmpresaById(id_empresa: number): Observable<ApiResponse> {
    return this.http.get<ApiResponse>(`${URL_API}/${ENDPOINT}.php?id=${id_empresa}`, {
      headers: this.commonService.headers
    });
  }

  // Crear una nueva empresa
  addEmpresa(data: any): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(`${URL_API}/${ENDPOINT}.php`, data, {
      headers: this.commonService.headers
    });
  }

  // Actualizar una empresa (modo admin)
  updateEmpresa(data: any): Observable<ApiResponse> {
    return this.http.put<ApiResponse>(`${URL_API}/${ENDPOINT}.php`, data, {
      headers: this.commonService.headers
    });
  }

  // Eliminar una empresa por su ID
  deleteEmpresa(id_empresa: number): Observable<ApiResponse> {
    return this.http.delete<ApiResponse>(`${URL_API}/${ENDPOINT}.php?id=${id_empresa}`, {
      headers: this.commonService.headers
    });
  }

  /** ========================
   *    MÉTODOS MI EMPRESA
   *  ======================== */

  // Obtener los datos de la empresa del usuario autenticado
  getMyEmpresas(): Observable<ApiResponse> {
    return this.http.get<ApiResponse>(`${URL_API}/mi_empresa.php`, {
      headers: this.commonService.headers
    });
  }

  // Actualizar los datos de la empresa del usuario autenticado
  updateMyEmpresa(data: any): Observable<ApiResponse> {
    return this.http.put<ApiResponse>(`${URL_API}/mi_empresa.php`, data, {
      headers: this.commonService.headers
    });
  }
}
