import { Observable, tap } from 'rxjs';
import {
  ActivatedRouteSnapshot,
  CanActivateFn,
  CanMatchFn,
  Route,
  Router,
  RouterStateSnapshot,
  UrlSegment
} from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { inject } from '@angular/core';

/**
 * Guarda que protege rutas privadas (CanActivate).
 * Se ejecuta al intentar acceder directamente a una ruta protegida.
 */
export const CanActivateGuard: CanActivateFn = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
) => {
  return checkAuthStatus();
};

/**
 * Guarda que protege la carga de módulos (CanMatch).
 * Se ejecuta antes de que se cargue un módulo de rutas si se usan lazy modules.
 */
export const CanMatchGuard: CanMatchFn = (
  route: Route,
  segments: UrlSegment[]
) => {
  return checkAuthStatus();
};

/**
 * Comprueba si el usuario está autenticado.
 * Si no lo está, lo redirige al login.
 */
const checkAuthStatus = (): Observable<boolean> => {
  const authService: AuthService = inject(AuthService);
  const router: Router = inject(Router);

  return authService.checkAuthentication().pipe(
    tap(isAuthenticated => {
      if (!isAuthenticated) {
        router.navigate(['/auth/login']);
      }
    })
  );
};