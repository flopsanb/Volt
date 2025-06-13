import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { URL_API } from 'src/environments/environments';
import { Observable } from 'rxjs';
import { ApiResponse } from '../auth/interfaces/api-response';
import { Usuario } from '../enterprises/interfaces/usuario';
import { CommonService } from './common.service'; // Asegúrate de importar esto

const ENDPOINT = 'usuario';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  usuarios!: Usuario[];

  constructor(
    private http: HttpClient,
    private commonService: CommonService
  ) {}

  getAllUsuarios(): Observable<ApiResponse> {
    return this.http.get<ApiResponse>(`${URL_API}/${ENDPOINT}.php`, {
      headers: this.commonService.headers,
      withCredentials: true
    });
  }

  getUsuariosByEmpresa(id_empresa: number): Observable<ApiResponse> {
    return this.http.get<ApiResponse>(
      `${URL_API}/${ENDPOINT}.php?id_empresa=${id_empresa}`,
      {
        headers: this.commonService.headers,
        withCredentials: true
      }
    );
  }

  addUsuario(data: Usuario): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(`${URL_API}/${ENDPOINT}.php`, data, {
      headers: this.commonService.headers,
      withCredentials: true
    });
  }

  updateUsuario(data: Usuario): Observable<ApiResponse> {
    return this.http.put<ApiResponse>(`${URL_API}/${ENDPOINT}.php`, data, {
      headers: this.commonService.headers,
      withCredentials: true
    });
  }

  deleteUsuario(id_usuario: number): Observable<ApiResponse> {
    return this.http.delete<ApiResponse>(`${URL_API}/${ENDPOINT}.php?id=${id_usuario}`, {
      headers: this.commonService.headers,
      withCredentials: true
    });
  }

  checkUsernameExists(username: string): Observable<{ exists: boolean }> {
    return this.http.get<{ exists: boolean }>(`${URL_API}/${ENDPOINT}.php?check_usuario=${username}`,{
        headers: this.commonService.headers,
        withCredentials: true
      }
    );
  }

  checkEmailExists(email: string): Observable<{ exists: boolean }> {
    return this.http.get<{ exists: boolean }>(`${URL_API}/${ENDPOINT}.php?check_email=${email}`,{
        headers: this.commonService.headers,
        withCredentials: true
      }
    );
  }
}
