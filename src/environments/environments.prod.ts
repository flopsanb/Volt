// Archivo de configuración de entorno para el modo producción

// Indica que la aplicación se ejecuta en modo producción
export const environments = {
  production: true,
};

// URL base del backend desplegado en producción (Railway)
export const URL_BASE = 'https://voltfencerbackend-production.up.railway.app';

// Ruta base para las llamadas a la API privada desde el frontend
export const URL_API = `${URL_BASE}/private`;
