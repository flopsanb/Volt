import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { URL_API } from 'src/environments/environments';
import { Observable } from 'rxjs';
import { ApiResponse } from '../auth/interfaces/api-response';
import { Usuario } from '../enterprises/interfaces/usuario';

const ENDPOINT = 'usuario';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  constructor(private http: HttpClient) {}

  getAllUsuarios(): Observable<ApiResponse> {
    return this.http.get<ApiResponse>(`${URL_API}/${ENDPOINT}.php`);
  }

  getUsuariosByEmpresa(id_empresa: number): Observable<ApiResponse> {
    return this.http.get<ApiResponse>(`${URL_API}/${ENDPOINT}.php?id_empresa=${id_empresa}`);
  }

  addUsuario(data: Usuario): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(`${URL_API}/${ENDPOINT}.php`, data);
  }

  updateUsuario(data: Usuario): Observable<ApiResponse> {
    return this.http.put<ApiResponse>(`${URL_API}/${ENDPOINT}.php`, data);
  }

  deleteUsuario(id_usuario: number): Observable<ApiResponse> {
    return this.http.delete<ApiResponse>(`${URL_API}/${ENDPOINT}.php?id=${id_usuario}`);
  }
}
