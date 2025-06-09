import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { map, Observable, of, catchError } from 'rxjs';
import { URL_API } from 'src/environments/environments';
import { CommonService } from './common.service';
import { ApiResponse } from '../auth/interfaces/api-response';
import { EstadoConexionService } from './estado-conexion.service';

/**
 * Servicio de autenticación principal de la aplicación.
 * Gestiona login, logout, validación de tokens, recuperación de contraseña y seguimiento de sesión (heartbeat).
 */

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private heartbeatIntervalId: any; // ID del intervalo para controlar el heartbeat

  constructor(
    private http: HttpClient, 
    private cookieService: CookieService,
    private commonService: CommonService,
    private estadoConexionService: EstadoConexionService
  ) {}

  // Inicia sesión con credenciales enviadas al backend
  doLogin(data: any) {
    const body = JSON.stringify(data);
    return this.http.post<ApiResponse>(`${URL_API}/login.php`, body);
  }

  // Verifica si el token de sesión es válido
  public checkAuthentication(): Observable<boolean> {
    const token = localStorage.getItem('token');
    if (!token) {
        return of(false);
    }

    return this.http.post<ApiResponse>(`${URL_API}/check_token.php`, { token }, { headers: this.commonService.headers })
        .pipe(
            map(response => response.ok),
            catchError(() => of(false))
        );
  }

  // Finaliza sesión: elimina cookies, borra localStorage y llama a logout.php
  doLogout() {
    const body = new FormData();
    const usuario = localStorage.getItem('usuario') || '';
    body.append('user', usuario);
    this.cookieService.deleteAll();
    localStorage.clear();
    return this.http.post(`${URL_API}/logout.php`, body);
  }

  // Envía email para recuperar contraseña
  resetPassword(formularioCorreo: { email: string }) {
    const body = JSON.stringify(formularioCorreo);
    return this.http.post<ApiResponse>(`${URL_API}/olvidar_pwd.php`, body, {
      headers: this.commonService.headers
    });
  }

  // Verifica el token enviado al correo para cambiar la contraseña
  checkPassToken(tokenPasswd: string) {
    const body = JSON.stringify({ token: tokenPasswd });
    return this.http.post<ApiResponse>(`${URL_API}/check_token_passwd.php`, body);
  }

  // Crea una nueva contraseña con el token válido
  generateNewPass(data: any) {
    const body = JSON.stringify(data);
    return this.http.put<ApiResponse>(`${URL_API}/reset_pass.php`, body);
  }

  // Comprueba si el nombre de usuario ya existe
  public checkUser(usuario: String): Observable<boolean> {
    if (!usuario) {
      return of(false);
    }

    return this.http.post<ApiResponse>(`${URL_API}/check_user.php`, { usuario }, {
      headers: this.commonService.headers
    }).pipe(
      map(response => response.ok),
      catchError(() => of(false))
    );
  }

  /**
   * Inicia el sistema de heartbeat, que registra actividad del usuario cada minuto.
   * Se usa para marcar al usuario como "conectado".
   */
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