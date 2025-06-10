import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiResponse } from '../auth/interfaces/api-response';
import { URL_API } from 'src/environments/environments';
import { CommonService } from './common.service';

const ENDPOINT = 'logs';

/**
 * Servicio para la gestión y recuperación de registros de actividad (logs).
 * Permite consultar acciones realizadas en la plataforma por usuarios.
 */
@Injectable({
  providedIn: 'root'
})
export class LogsService {

  constructor(
    private http: HttpClient,
    private commonService: CommonService
  ) {}

  /**
   * Recupera todos los logs del sistema (visible según permisos del usuario).
   */
  getLogs(): Observable<ApiResponse> {
    return this.http.get<ApiResponse>(`${URL_API}/${ENDPOINT}.php`, {
      headers: this.commonService.headers,
      withCredentials: true
    });
  }

  /**
   * Obtiene logs filtrados por empresa.
   */
  getLogsByEmpresa(id_empresa: number): Observable<ApiResponse> {
    return this.http.get<ApiResponse>(`${URL_API}/${ENDPOINT}.php?id_empresa=${id_empresa}`, {
      headers: this.commonService.headers,
      withCredentials: true
    });
  }

  /**
   * Obtiene logs por acción (crear, editar, borrar, login, etc).
   */
  getLogsByAction(accion: string): Observable<ApiResponse> {
    return this.http.get<ApiResponse>(`${URL_API}/${ENDPOINT}.php?accion=${accion}`, {
      headers: this.commonService.headers,
      withCredentials: true
    });
  }

  /**
   * Obtiene logs por usuario.
   */
  getLogsByUsuario(id_usuario: number): Observable<ApiResponse> {
    return this.http.get<ApiResponse>(`${URL_API}/${ENDPOINT}.php?id_usuario=${id_usuario}`, {
      headers: this.commonService.headers,
      withCredentials: true
    });
  }

  /**
   * Obtiene logs por rango de fechas.
   */
  getLogsByFecha(desde: string, hasta: string): Observable<ApiResponse> {
    return this.http.get<ApiResponse>(
      `${URL_API}/${ENDPOINT}.php?desde=${desde}&hasta=${hasta}`,
      {
        headers: this.commonService.headers,
        withCredentials: true
      }
    );
  }
}
