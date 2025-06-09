import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, Observable, of } from 'rxjs';
import { URL_API } from 'src/environments/environments';
import { ApiResponse } from '../auth/interfaces/api-response';
import { CommonService } from './common.service';

/**
 * Servicio que gestiona el envío de tickets de soporte desde el frontend hacia el backend.
 */
@Injectable({
  providedIn: 'root'
})
export class SoporteService {

  constructor(
    private http: HttpClient,
    private commonService: CommonService // Proporciona los headers con token de autenticación
  ) {}

  /**
   * Envía un ticket de soporte con los datos del usuario.
   * @param data Objeto con asunto, mensaje y email del usuario.
   * @returns Observable con la respuesta del servidor.
   */
  enviarTicket(data: { asunto: string, mensaje: string, email: string }): Observable<ApiResponse> {
    const body = JSON.stringify(data);

    return this.http.post<ApiResponse>(`${URL_API}/soporte.php`, body, {
      headers: this.commonService.headers
    }).pipe(
      map(res => {
        return res; // Devuelve la respuesta tal cual
      }),
      catchError(error => {
        // Maneja errores devolviendo una respuesta estándar
        return of({
          ok: false,
          message: 'Error al enviar el ticket de soporte',
          data: null
        } as ApiResponse);
      })
    );
  }
}
