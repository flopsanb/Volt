import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CookieService } from 'ngx-cookie-service';
import { map, Observable, of, catchError } from 'rxjs';
import { URL_API } from 'src/environments/environments';
import { ApiResponse } from '../auth/interfaces/api-response';

/**
 * Servicio de autenticación: gestiona login, logout, validación de token,
 * recuperación de contraseña y estado de conexión del usuario.
 */
@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private heartbeatIntervalId: any;

  constructor(
    private http: HttpClient,
    private cookieService: CookieService,
  ) {}

  /** ========= LOGIN ========= */

  doLogin(data: any): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(`${URL_API}/login.php`, data);
  }

  /** ========= LOGOUT ========= */

  doLogout(): Observable<any> {
    const body = {
      user: localStorage.getItem('usuario') || ''
    };

    this.cookieService.deleteAll();
    localStorage.clear();

    return this.http.post(`${URL_API}/logout.php`, body);
  }


  /** ========= TOKEN ========= */

  checkAuthentication(): Observable<boolean> {
    const token = localStorage.getItem('token');
    if (!token) return of(false);

    return this.http.post<ApiResponse>(
      `${URL_API}/check_token.php`,
      { token }
    ).pipe(
      map(res => res.ok),
      catchError(() => of(false))
    );
  }

  /** ========= VALIDAR USUARIO ========= */

  checkUser(usuario: string): Observable<boolean> {
    if (!usuario) return of(false);

    return this.http.post<ApiResponse>(
      `${URL_API}/check_user.php`,
      { usuario }
    ).pipe(
      map(res => res.ok),
      catchError(() => of(false))
    );
  }

  /** ========= HEARTBEAT (conexión activa) ========= */  
  public startHeartbeat(): void {
    this.stopHeartbeat();

    const waitForIdAndStart = () => {
      const id = localStorage.getItem('id_usuario');
      if (!id) {
        setTimeout(waitForIdAndStart, 500);
        return;
      }
      const id_usuario = +id;
      this.sendHeartbeat(id_usuario);
      this.heartbeatIntervalId = setInterval(() => this.sendHeartbeat(id_usuario), 60000);
    };

    waitForIdAndStart();
  }

  // Envía un heartbeat al backend para mantener el estado de conexión
  private sendHeartbeat(id_usuario: number): void {
    this.http.post<ApiResponse>(`${URL_API}/estado_conexion.php`, { id_usuario })
      .pipe(catchError(() => of(null)))
      .subscribe();
  }

  // Detiene el envío automático de heartbeats
  public stopHeartbeat(): void {
    clearInterval(this.heartbeatIntervalId);
    this.heartbeatIntervalId = null;
  }

  /**
   * Envía un "heartbeat final" al cerrar la pestaña o salir de la app.
   * Usa `sendBeacon` para asegurar que la solicitud se envía incluso si la página se está cerrando.
   */
  public sendFinalHeartbeat(): void {
    const id = localStorage.getItem('id_usuario');
    if (!id) return;

    navigator.sendBeacon(
      `${URL_API}/estado_conexion.php`,
      new Blob([JSON.stringify({ id_usuario: +id })], { type: 'application/json' })
    );
  }
}