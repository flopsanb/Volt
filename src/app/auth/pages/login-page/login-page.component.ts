import { HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { AuthService } from '../../../services/auth.service';
import { CommonService } from '../../../services/common.service';
import { MatDialog } from '@angular/material/dialog';
import { RegisterDialogComponent } from '../../components/register-dialog/register-dialog.component';
import { ViewEncapsulation } from '@angular/core';

/**
 * Componente de página de login.
 * Gestiona el acceso del usuario validando su existencia y contraseña.
 */
@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class LoginPageComponent implements OnInit {

  loginForm: FormGroup = new FormGroup({});
  alerta: string = '';
  showSpinner: boolean = false;
  error: string = '';
  titulo = 'VoltFencerApp';

  constructor(
    private authService: AuthService,
    private router: Router,
    private snackBar: MatSnackBar,
    private commonService: CommonService,
    private dialog: MatDialog
  ){}

  ngOnInit() {
    this.setForm();
  }

  // Inicializa el formulario con campo de usuario obligatorio
  setForm() {
    this.loginForm = new FormGroup({
      username: new FormControl('', Validators.required)
    });
  }

  /**
   * Verifica si el usuario existe. Si existe, abre el diálogo de contraseña.
   */
  async acceder() {
    if (this.loginForm.valid) {
      const username = this.loginForm.value.username;

      try {
        const userExists = await this.authService.checkUser(username).toPromise();
        console.log('[✅ LOGIN] Respuesta del backend (checkUser):', userExists);
        if (userExists) {
          const dialogRef = this.dialog.open(RegisterDialogComponent, {
            width: '400px',
            data: { username },
            disableClose: true,
            autoFocus: true,
          });

          dialogRef.afterClosed().subscribe(result => {
            console.log('[📦 LOGIN] Resultado del modal RegisterDialog:', result); 
            if (result) {
              this.doLogin(username, result);
            }
          });

        } else {
          console.warn('[⚠️ LOGIN] Usuario no encontrado');
          this.error = 'El usuario no está registrado';
          this.snackBar.open('No hay ningún usuario con ese nombre', 'Cerrar', { duration: 5000 });
        }

      } catch (error) {
        console.error('[❌ LOGIN] Error al conectar con el servidor:', error);
        this.snackBar.open('Error al conectar con el servidor', 'Cerrar', { duration: 5000 });
      }
    }
  }

  /**
   * Intenta iniciar sesión con el usuario y contraseña proporcionados.
   * Si la autenticación es correcta, guarda los datos necesarios en localStorage.
   */
  async doLogin(username: string, password: string) {
    try {
      const data = { username, password };
      const RESPONSE = await this.authService.doLogin(data).toPromise();

      if (!RESPONSE || !RESPONSE.ok) {
        if (RESPONSE?.data?.habilitado === 0) {
          this.snackBar.open('Usuario inhabilitado', 'Cerrar', { duration: 5000 });
        } else {
          this.snackBar.open(RESPONSE?.message ?? 'Error en la respuesta del servidor', 'Cerrar', { duration: 5000 });
        }
        return;
      }

      if (RESPONSE.data?.token) {
        localStorage.setItem('token', RESPONSE.data.token);
        localStorage.setItem('usuario', RESPONSE.data.usuario ?? '');
        localStorage.setItem('nombre_publico', RESPONSE.data.nombre_publico ?? '');
        localStorage.setItem('id_usuario', RESPONSE.data.id_usuario ?? '');
        localStorage.setItem('id_rol', RESPONSE.data.id_rol ?? '');
        localStorage.setItem('id_empresa', RESPONSE.data.id_empresa ?? '');
        localStorage.setItem('email', RESPONSE.data.email ?? '');

        this.commonService.headers = new HttpHeaders({
          'Content-Type': 'application/json',
          Authorization: `Bearer ${RESPONSE.data.token}`
        });

        this.router.navigate(['/enterprises/main']);

      } else if (RESPONSE.data?.habilitado === 0) {
        this.snackBar.open('Usuario inhabilitado', 'Cerrar', { duration: 5000 });

      } else if (RESPONSE.data?.habilitado === 1) {
        this.snackBar.open('Usuario o contraseña incorrectas', 'Cerrar', { duration: 5000 });
      }

    } catch (_) {
      this.snackBar.open('No se pudo establecer conexión. Inténtalo de nuevo en unos segundos.', 'Cerrar', { duration: 5000 });
    }
  }
}