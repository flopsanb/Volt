import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiResponse } from '../auth/interfaces/api-response';
import { URL_API } from 'src/environments/environments';

const ENDPOINT = 'estado_conexion';

@Injectable({ 
  providedIn: 'root' 
})
export class EstadoConexionService {

  constructor(private http: HttpClient) {}

  /**
   * Registra actividad para marcar al usuario como conectado.
   * @param id_usuario ID del usuario activo
   */
  registrarActividad(id_usuario: number): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(
      `${URL_API}/${ENDPOINT}.php?action=registrar`,
      { id_usuario }
    );
  }

  /**
   * Obtiene la lista de usuarios actualmente conectados.
   */
  getConectados(): Observable<ApiResponse> {
    return this.http.get<ApiResponse>(
      `${URL_API}/${ENDPOINT}.php?action=conectados`
    );
  }
}