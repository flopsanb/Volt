// Configuración del entorno de desarrollo.
// Angular utilizará este archivo cuando se ejecute con `ng serve`.
export const environments = {
  production: false, // Indica que se trata de un entorno de desarrollo.
};

// Dirección base del backend PHP local.
export const URL_BASE = 'http://localhost:8000';

// Ruta base para acceder a los endpoints de la API privada.
export const URL_API = `${URL_BASE}/api/private`;
