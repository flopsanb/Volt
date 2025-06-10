import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CookieService } from 'ngx-cookie-service';
import { map, Observable, of, catchError } from 'rxjs';
import { URL_API } from 'src/environments/environments';
import { CommonService } from './common.service';
import { ApiResponse } from '../auth/interfaces/api-response';
import { EstadoConexionService } from './estado-conexion.service';

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
    private commonService: CommonService,
    private estadoConexionService: EstadoConexionService
  ) {}

  /** ========= LOGIN ========= */

  doLogin(data: any) {
    const body = JSON.stringify(data);
    return this.http.post<ApiResponse>(`${URL_API}/login.php`, body, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    });
  }

  /** ========= LOGOUT ========= */

  doLogout(): Observable<any> {
    const body = new FormData();
    body.append('user', localStorage.getItem('usuario') || '');
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
      { token },
      { headers: this.commonService.headers }
    ).pipe(
      map(res => res.ok),
      catchError(() => of(false))
    );
  }

  /** ========= RECUPERAR CONTRASEÑA ========= */

  resetPassword(data: { email: string }): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(
      `${URL_API}/olvidar_pwd.php`,
      JSON.stringify(data),
      {
        headers: this.commonService.headers,
        withCredentials: true
      }
    );
  }

  checkPassToken(tokenPasswd: string): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(
      `${URL_API}/check_token_passwd.php`,
      JSON.stringify({ token: tokenPasswd })
    );
  }

  generateNewPass(data: any): Observable<ApiResponse> {
    return this.http.put<ApiResponse>(
      `${URL_API}/reset_pass.php`,
      JSON.stringify(data)
    );
  }

  /** ========= VALIDAR USUARIO ========= */

  checkUser(usuario: string): Observable<boolean> {
    if (!usuario) return of(false);

    return this.http.post<ApiResponse>(
      `${URL_API}/check_user.php`,
      { usuario },
      { headers: this.commonService.headers }
    ).pipe(
      map(res => res.ok),
      catchError(() => of(false))
    );
  }

  /** ========= HEARTBEAT (conexión activa) ========= */  
  public startHeartbeat(): void {
    this.stopHeartbeat(); // Limpia cualquier intervalo previo

    const tryStart = () => {
      const id_usuario = localStorage.getItem('id_usuario');
      const token = localStorage.getItem('token');

      if (!id_usuario || !token) {
        setTimeout(tryStart, 500); // Reintenta en 500ms si aún no está disponible
        return;
      }

      this.sendHeartbeat(parseInt(id_usuario), token, true); // Primer heartbeat
      this.heartbeatIntervalId = setInterval(() => {
        this.sendHeartbeat(parseInt(id_usuario), token);
      }, 60 * 1000);
    };

    tryStart();
  }

  // Envía un heartbeat al backend para mantener el estado de conexión
  private sendHeartbeat(id_usuario: number, token: string, inicial: boolean = false): void {
    const mensaje = inicial ? "Primer heartbeat" : "Heartbeat regular";

    fetch(`${URL_API}/estado_conexion.php?action=registrar`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token
      },
      body: JSON.stringify({ id_usuario })
    })
      .then(res => {
        if (!res.ok) throw new Error(`Respuesta NO OK → status: ${res.status}`);
        return res.json();
      })
      .catch(err => {
      });
  }

  // Detiene el envío automático de heartbeats
  public stopHeartbeat(): void {
    if (this.heartbeatIntervalId) {
      clearInterval(this.heartbeatIntervalId);
      this.heartbeatIntervalId = null;
    }
  }

  /**
   * Envía un "heartbeat final" al cerrar la pestaña o salir de la app.
   * Usa `sendBeacon` para asegurar que la solicitud se envía incluso si la página se está cerrando.
   */
  public sendFinalHeartbeat(): void {
    const id_usuario = localStorage.getItem('id_usuario');
    if (!id_usuario) {
      return;
    }

    const blob = new Blob(
      [JSON.stringify({ id_usuario: parseInt(id_usuario) })],
      { type: 'application/json' }
    );

    navigator.sendBeacon(`${URL_API}/estado_conexion.php?action=logout`, blob);
  }
}