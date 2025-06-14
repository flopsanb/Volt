import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { URL_API } from 'src/environments/environments';
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

  constructor(private http: HttpClient) {}

  /** ========================
   *      MÉTODOS GENERALES
   *  ======================== */

  getAllEmpresas(): Observable<ApiResponse> {
    return this.http.get<ApiResponse>(`${URL_API}/${ENDPOINT}.php`);
  }

  getEmpresaById(id_empresa: number): Observable<ApiResponse> {
    return this.http.get<ApiResponse>(`${URL_API}/${ENDPOINT}.php?id=${id_empresa}`);
  }

  addEmpresa(data: any): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(`${URL_API}/${ENDPOINT}.php`, data);
  }

  updateEmpresa(data: any): Observable<ApiResponse> {
    return this.http.put<ApiResponse>(`${URL_API}/${ENDPOINT}.php`, data);
  }

  deleteEmpresa(id_empresa: number): Observable<ApiResponse> {
    return this.http.delete<ApiResponse>(`${URL_API}/${ENDPOINT}.php?id=${id_empresa}`);
  }

  /** ========================
   *    MÉTODOS MI EMPRESA
   *  ======================== */

  getMyEmpresas(): Observable<ApiResponse> {
    return this.http.get<ApiResponse>(`${URL_API}/mi_empresa.php`);
  }

  updateMyEmpresa(data: any): Observable<ApiResponse> {
    return this.http.put<ApiResponse>(`${URL_API}/mi_empresa.php`, data);
  }
}
