# EcoRepair — Frontend
Interfaz web para la gestión de dispositivos y reparaciones de la plataforma EcoRepair.

## Tecnologías utilizadas

![React](https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB)
![TypeScript](https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/vite-%23646CFF.svg?style=for-the-badge&logo=vite&logoColor=white)
![React Router](https://img.shields.io/badge/React_Router-CA4245?style=for-the-badge&logo=react-router&logoColor=white)
![Docker](https://img.shields.io/badge/docker-%230db7ed.svg?style=for-the-badge&logo=docker&logoColor=white)
![Nginx](https://img.shields.io/badge/nginx-%23009639.svg?style=for-the-badge&logo=nginx&logoColor=white)
![AWS](https://img.shields.io/badge/AWS-%23FF9900.svg?style=for-the-badge&logo=amazon-aws&logoColor=white)
![GitHub Actions](https://img.shields.io/badge/github%20actions-%232671E5.svg?style=for-the-badge&logo=githubactions&logoColor=white)
![Git](https://img.shields.io/badge/git-%23F05033.svg?style=for-the-badge&logo=git&logoColor=white)
![GitHub](https://img.shields.io/badge/github-%23121011.svg?style=for-the-badge&logo=github&logoColor=white)

## Requisitos previos

Antes de ejecutar el proyecto, asegúrate de tener instalado:

- **Node.js 24+**
- **npm**
- **Git**

## Estructura del proyecto

- **/src/auth**: Contexto de autenticación, guards y llamadas a la API de auth
- **/src/components**: Componentes reutilizables (Header, Navigation, Footer…)
- **/src/pages**: Vistas de la aplicación organizadas por funcionalidad
- **/src/services**: Clientes HTTP para cada recurso de la API (devices, repairs, users)
- **/src/types**: Interfaces TypeScript compartidas (Device, Repair, AuthUser…)
- **/src/utils**: Utilidades genéricas
- **/k8s**: Manifiestos de Kubernetes para el despliegue en EKS

## Rutas principales

| Ruta | Acceso | Descripción |
|---|---|---|
| `/` | Público | Página de inicio |
| `/login` | Público | Inicio de sesión |
| `/register` | Público | Registro de usuario |
| `/dashboard` | Autenticado | Redirige según rol |
| `/devices` | Autenticado | Listado de dispositivos |
| `/devices/:id` | Autenticado | Detalle de dispositivo |
| `/devices/new` | Admin / Editor | Crear dispositivo |
| `/repairs` | Autenticado | Listado de reparaciones |
| `/repairs/:id` | Autenticado | Detalle de reparación |
| `/repairs/new` | Admin / Editor | Crear reparación |
| `/me` | Autenticado | Perfil del usuario |
| `/admin` | Admin | Gestión de usuarios |

## Roles de usuario

- **USER** — acceso de solo lectura a dispositivos y reparaciones
- **EDITOR** — puede crear y editar dispositivos y reparaciones
- **ADMIN** — acceso completo, incluida la gestión de usuarios

## Instalación y arranque

1. **Clonar el repositorio**
   ```bash
   git clone https://github.com/EcoRepair-DAM/EcoRepair-React
   cd EcoRepair-React
   ```

2. **Instalar dependencias**
   ```bash
   npm install
   ```

3. **Configurar la URL de la API**

   Crea un archivo `.env` en la raíz del proyecto:
   ```env
   VITE_API_URL=http://localhost:8080
   ```
   > Apunta a la URL donde tengas corriendo la [EcoRepair API](https://github.com/EcoRepair-DAM/EcoRepiar-API).

4. **Ejecutar en modo desarrollo**
   ```bash
   npm run dev
   ```

La aplicación estará disponible en `http://localhost:5173`

## CI/CD

El proyecto incluye un pipeline de GitHub Actions (`.github/workflows/deploy-front.yaml`) que, al hacer push a `main`:

1. Construye la imagen Docker y la publica en Docker Hub
2. Configura las credenciales de AWS
3. Despliega la imagen en un clúster de **Amazon EKS** mediante `kubectl`

---

Proyecto escolar — Curso 2025–2026 
