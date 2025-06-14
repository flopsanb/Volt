import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, Observable, of } from 'rxjs';
import { URL_API } from 'src/environments/environments';
import { ApiResponse } from '../auth/interfaces/api-response';

/**
 * Servicio que gestiona el envío de tickets de soporte desde el frontend hacia el backend.
 */
@Injectable({
  providedIn: 'root'
})
export class SoporteService {

  constructor(private http: HttpClient) {}

  /**
   * Envía un ticket de soporte con los datos del usuario.
   * @param data Objeto con asunto, mensaje y email del usuario.
   * @returns Observable con la respuesta del servidor.
   */
  enviarTicket(data: { asunto: string, mensaje: string, email: string }): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(`${URL_API}/soporte.php`, data).pipe(
      map(res => res),
      catchError(() => of({
        ok: false,
        message: 'Error al enviar el ticket de soporte',
        data: null
      } as ApiResponse))
    );
  }
}
