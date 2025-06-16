# ⚡ VoltFencerApp

VoltFencerApp es una aplicación web desarrollada con **Angular 16**, **Angular Material** y **PHP** que permite a empresas de todos los tamaños visualizar sus informes de **Power BI embebidos**, gestionar usuarios y proyectos, y monitorizar riesgos climáticos de forma eficiente, segura y personalizada.

> Este sistema está diseñado para entornos **multiempresa**, con gestión por roles, control de accesos y permisos, autenticación mediante token, y un diseño profesional basado en **gris, blanco y amarillo**, colores que representan energía, tecnología y solidez.

---

## 📂 Repositorios del proyecto

- **Frontend (Angular)**  
  🔗 https://github.com/flopsanb/VoltFencerFrontend

- **Backend (PHP + MySQL)**  
  🔗 https://github.com/flopsanb/VoltFencerBackend

---

## 🧰 Tecnologías utilizadas

- Angular 16 + Angular Material  
- SCSS personalizado (tema corporativo gris/blanco/amarillo)  
- PHP 8.x (API RESTful)  
- MySQL (estructura relacional optimizada)  
- Power BI embebido con iframe  
- Autenticación por token  
- Control de roles y permisos  
- Sistema heartbeat y conexión en tiempo real  
- Librerías: `concurrently`, `ngx-cookie-service`, `primeflex`

---

## 🚀 Instrucciones de instalación y ejecución

### 1. Clonar los repositorios

# Clonar frontend
git clone https://github.com/flopsanb/VoltFencerFrontend.git
cd VoltFencerFrontend

# Clonar backend en el mismo nivel
git clone https://github.com/flopsanb/VoltFencerBackend.git

---

## Estructura resultante:

TuCarpeta/
├── VoltFencerFrontend/
└── VoltFencerBackend/

---

## 🗂️ 2. Instalar dependencias del frontend

npm install

---

## ⚙️ 3. Iniciar el backend (PHP)

npm run backend

---

## 🅰️ 4. Iniciar la aplicación Angular

npm start
# o bien
ng serve -o

---

## 🔁 5. (Opcional) Iniciar frontend + backend a la vez

npm run start-all

---

## ✅ Requisitos previos

Node.js (v18 o superior)
Angular CLI instalado globalmente: npm install -g @angular/cli
PHP 8.x
Servidor MySQL
Base de datos gestion_proyectos correctamente importada y configurada

```bash
