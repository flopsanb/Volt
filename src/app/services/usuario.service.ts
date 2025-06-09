// Servicio encargado de gestionar las operaciones relacionadas con usuarios
// incluyendo obtención, creación, actualización y eliminación mediante peticiones HTTP.

import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { URL_API } from 'src/environments/environments';
import { Observable } from 'rxjs';
import { ApiResponse } from '../auth/interfaces/api-response';
import { Usuario } from '../enterprises/interfaces/usuario';

const ENDPOINT = 'usuario';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  usuarios!: Usuario[]; // Lista de usuarios cargada desde el backend

  constructor(private http: HttpClient) {}

  // Devuelve los encabezados HTTP necesarios para incluir el token de autenticación
  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      'Authorization': `Bearer ${token || ''}`
    });
  }

  // Obtiene todos los usuarios (solo accesible para administradores)
  getAllUsuarios(): Observable<ApiResponse> {
    return this.http.get<ApiResponse>(`${URL_API}/${ENDPOINT}.php`, {
      headers: this.getAuthHeaders()
    });
  }

  // Obtiene los usuarios filtrados por empresa
  getUsuariosByEmpresa(id_empresa: number): Observable<ApiResponse> {
    return this.http.get<ApiResponse>(
      `${URL_API}/${ENDPOINT}.php?id_empresa=${id_empresa}`,
      { headers: this.getAuthHeaders() }
    );
  }

  // Crea un nuevo usuario
  addUsuario(data: Usuario): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(`${URL_API}/${ENDPOINT}.php`, data, {
      headers: this.getAuthHeaders()
    });
  }

  // Actualiza un usuario existente
  updateUsuario(data: Usuario): Observable<ApiResponse> {
    return this.http.put<ApiResponse>(`${URL_API}/${ENDPOINT}.php`, data, {
      headers: this.getAuthHeaders()
    });
  }

  // Elimina un usuario por su ID
  deleteUsuario(id_usuario: number): Observable<ApiResponse> {
    return this.http.delete<ApiResponse>(`${URL_API}/${ENDPOINT}.php?id=${id_usuario}`, {
      headers: this.getAuthHeaders()
    });
  }
}
