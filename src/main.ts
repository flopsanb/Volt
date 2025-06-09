// Importamos el módulo principal de Angular
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

// Importamos el módulo raíz de la aplicación
import { AppModule } from './app/app.module';

// Iniciamos la aplicación Angular
platformBrowserDynamic().bootstrapModule(AppModule)
  .catch(() => {
    // No mostramos detalles de error por seguridad
    alert('Error crítico al iniciar la aplicación.');
  });

