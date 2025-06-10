import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SharedModule } from './shared/shared.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

import { CredentialsInterceptor } from './interceptors/credentials.interceptor';

@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,            // Módulo de rutas principal de la aplicación
    SharedModule,                // Módulo compartido con componentes reutilizables
    BrowserAnimationsModule,     // Requerido para animaciones de Angular Material
    HttpClientModule             // Permite realizar peticiones HTTP al backend
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: CredentialsInterceptor,
      multi: true
    }
  ],
  bootstrap: [AppComponent]      // Componente raíz que se carga al iniciar la aplicación
})
export class AppModule { }
