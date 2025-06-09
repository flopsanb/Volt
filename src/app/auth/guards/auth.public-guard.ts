import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { Observable } from 'rxjs';
import { tap, map } from 'rxjs/operators';

/**
 * Guarda que protege rutas públicas como el login.
 * Si el usuario ya está autenticado, lo redirige automáticamente a /enterprises/main.
 */
export const PublicGuard: CanActivateFn = (): Observable<boolean> => {
  const authService = inject(AuthService);
  const router = inject(Router);

  return authService.checkAuthentication().pipe(
    tap((isAuthenticated: boolean) => {
      if (isAuthenticated) {
        router.navigate(['/enterprises/main']);
      }
    }),
    map((isAuthenticated: boolean) => !isAuthenticated)
  );
};
