/**
 * Modelo de datos de un proyecto, asociado a una empresa.
 * Incluye estado de visibilidad y habilitación para control de acceso.
 */
export interface Project {
  id_proyecto: number;             // Identificador único del proyecto
  nombre_proyecto: string;         // Título o nombre del proyecto
  id_empresa: number;              // ID de la empresa propietaria
  fecha_creacion: string;          // Fecha de creación del proyecto
  iframe_proyecto: string;         // URL embebida del informe (Power BI, etc.)
  visible: number;                 // Indica si el proyecto está visible (1) u oculto (0)
  habilitado: number;              // Indica si está habilitado (1) o deshabilitado (0)
  nombre_empresa?: string;         // Nombre de la empresa (usado en listados combinados)
}
