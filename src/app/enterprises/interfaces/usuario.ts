/**
 * Representa un usuario del sistema.
 * Incluye su empresa, rol, estado y datos adicionales para gestión interna.
 */
export interface Usuario {
  id_usuario?: number;             // ID del usuario (autogenerado)
  usuario: string;                 // Nombre de usuario para login
  nombre_publico: string;          // Nombre visible en la interfaz
  id_rol: number | null;           // Rol asignado (permite controlar permisos)
  id_empresa: number | null;       // Empresa a la que pertenece
  habilitado: number;              // Estado del usuario (1: activo, 0: deshabilitado)
  nombre_empresa?: string;         // Nombre de la empresa (opcional para vistas combinadas)
  pass_user?: string;              // Contraseña (usada solo en creación o edición)
  observaciones?: string;          // Notas internas
  email: string;                   // Correo electrónico (requerido para recuperación y notificaciones)
}
