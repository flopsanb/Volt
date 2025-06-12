/**
 * Estructura estándar de respuesta del backend.
 * Se utiliza para interpretar respuestas exitosas o con error, y cargar datos y permisos.
 */
export interface ApiResponse {
  ok: boolean;                             // Indica si la respuesta fue exitosa
  message?: string;                        // Mensaje de error o información
  data?: any;                              // Datos devueltos por la operación
  permises?: { [key: string]: number };    // Permisos específicos si se incluyen en la respuesta
}