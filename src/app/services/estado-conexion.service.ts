import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiResponse } from '../auth/interfaces/api-response';
import { URL_API } from 'src/environments/environments';
import { CommonService } from './common.service';

const ENDPOINT = 'estado_conexion';

// Servicio que gestiona el estado de conexión de los usuarios.
// Permite registrar actividad y consultar usuarios conectados.

@Injectable({ 
  providedIn: 'root' 
})

export class EstadoConexionService {

  constructor(private http: HttpClient, private common: CommonService) {}

  /**
   * Registra actividad del usuario para mantener su estado como conectado.
   * @param id_usuario ID del usuario activo
   * @returns Observable con la respuesta del servidor
   */
  registrarActividad(id_usuario: number): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(
      `${URL_API}/${ENDPOINT}.php?action=registrar`,
      { id_usuario },
      { headers: this.common.headers }
    );
  }

  /**
   * Obtiene la lista de usuarios actualmente conectados.
   * @returns Observable con el listado de usuarios conectados
   */
  getConectados(): Observable<ApiResponse> {
    return this.http.get<ApiResponse>(
      `${URL_API}/${ENDPOINT}.php?action=conectados`,
      { headers: this.common.headers }
    );
  }
}
