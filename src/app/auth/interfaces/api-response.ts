/**
 * Estructura estándar de respuesta del backend.
 * Se utiliza para interpretar respuestas exitosas o con error, y cargar datos y permisos.
 */
export interface ApiResponse {
  ok: boolean;            // Indica si la respuesta fue exitosa
  message?: string;       // Mensaje de error o información
  data?: any;             // Datos devueltos por la operación
  permises?: Permises;    // Permisos específicos si se incluyen en la respuesta
}

/**
 * Representa el conjunto de permisos que puede tener un usuario.
 * Cada permiso se expresa como número (0 o 1).
 */
export interface Permises {
  borrar_proyectos?: number;
  crear_proyectos?: number;
  deshabilitar_proyectos?: number;
  gestionar_permisos_empresa?: number;
  gestionar_permisos_globales?: number;
  gestionar_usuarios_empresa?: number;
  gestionar_usuarios_globales?: number;
}
