import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiResponse } from '../auth/interfaces/api-response';
import { URL_API } from 'src/environments/environments';
import { CommonService } from './common.service';

const ENDPOINT = 'logs';

/**
 * Servicio destinado a gestionar el registro de logs del sistema.
 * Estaba previsto para almacenar información sobre acciones de usuarios,
 * accesos y cambios realizados en la plataforma.
 * 
 * Esta funcionalidad no fue implementada completamente en esta versión.
 */
@Injectable({
  providedIn: 'root'
})
export class LogsService {

  constructor(
    private http: HttpClient,
    private commonService: CommonService
  ) {}

  // Método previsto para obtener todos los logs (no implementado)
  getLogs(): Observable<ApiResponse> {
    return this.http.get<ApiResponse>(`${URL_API}/${ENDPOINT}.php`, {
      headers: this.commonService.headers
    });
  }
}
