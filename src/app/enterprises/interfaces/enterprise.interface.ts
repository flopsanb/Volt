/**
 * Representa los datos clave de una empresa registrada en el sistema.
 * Se utiliza para mostrar información y estadísticas por empresa.
 */
export interface Enterprise {
  id_empresa: number;              // Identificador único de la empresa
  nombre_empresa: string;          // Nombre visible de la empresa
  empleados_totales: number;       // Cantidad total de empleados registrados
  proyectos_totales: number;       // Número de proyectos vinculados
  logo_url?: string;               // URL del logotipo (opcional)
}
