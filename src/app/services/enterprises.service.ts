import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { URL_API } from 'src/environments/environments';
import { Observable } from 'rxjs';
import { CommonService } from './common.service';
import { ApiResponse } from '../auth/interfaces/api-response';

const ENDPOINT = 'empresa';

/**
 * Servicio encargado de gestionar las operaciones relacionadas con empresas.
 * Incluye funciones CRUD generales y métodos específicos para la empresa del usuario autenticado.
 */

@Injectable({
  providedIn: 'root'
})
export class EnterprisesService {

  constructor(
    private http: HttpClient,
    private commonService: CommonService // Proporciona los headers de autenticación
  ) {}

  // Obtiene todas las empresas (solo para administradores)
  getAllEmpresas(): Observable<ApiResponse> {
    return this.http.get<ApiResponse>(
      `${URL_API}/${ENDPOINT}.php`,
      { headers: this.commonService.headers }
    );
  }

  // Crea una nueva empresa
  addEmpresa(data: any): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(
      `${URL_API}/${ENDPOINT}.php`,
      data,
      { headers: this.commonService.headers }
    );
  }

  // Actualiza los datos de una empresa existente
  updateEmpresa(data: any): Observable<ApiResponse> {
    return this.http.put<ApiResponse>(
      `${URL_API}/${ENDPOINT}.php`,
      data,
      { headers: this.commonService.headers }
    );
  }

  // Elimina una empresa por ID
  deleteEmpresa(id_empresa: number): Observable<ApiResponse> {
    return this.http.delete<ApiResponse>(
      `${URL_API}/${ENDPOINT}.php?id=${id_empresa}`,
      { headers: this.commonService.headers }
    );
  }

  // Obtiene una empresa específica por su ID
  getEmpresaById(id_empresa: number): Observable<ApiResponse> {
    return this.http.get<ApiResponse>(
      `${URL_API}/${ENDPOINT}.php?id=${id_empresa}`,
      { headers: this.commonService.headers }
    );
  }

  // Obtiene los datos de la empresa del usuario autenticado
  getMyEmpresas(): Observable<ApiResponse> {
    return this.http.get<ApiResponse>(
      `${URL_API}/mi_empresa.php`,
      { headers: this.commonService.headers }
    );
  }

  // Actualiza los datos de la empresa del usuario autenticado
  updateMyEmpresa(data: any): Observable<ApiResponse> {
    return this.http.put<ApiResponse>(
      `${URL_API}/mi_empresa.php`,
      data,
      { headers: this.commonService.headers }
    );
  }
}