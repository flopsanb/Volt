/**
 * Modelo base de un rol de usuario.
 * Se usa para definir permisos y control de acceso en la aplicación.
 */
export interface Rol {
  id_rol: number;                  // ID del rol (1: superadmin, 2: admin, etc.)
  nombre_rol: string;              // Descripción del rol (ej. 'Admin empresa')
}
