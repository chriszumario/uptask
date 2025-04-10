# Administrador de Tareas y Proyectos (MERN Stack) 🚀

Este proyecto es un **Administrador de Tareas y Proyectos** construido con el stack **MERN** (MongoDB, Express, React, Node.js). Está diseñado para gestionar equipos, tareas y proyectos de manera eficiente, priorizando la seguridad y escalabilidad.


## 🔑 Características Principales

-   **Autenticación robusta**: Sistema de registro, inicio de sesión, confirmación de cuentas por correo y recuperación de contraseña.
-   **REST API avanzada**: Endpoints para la gestión de proyectos, tareas, notas y equipos.
-   **Interfaces dinámicas**: Dashboards interactivos con funcionalidades de drag-and-drop para gestión de tareas.
-   **Optimización**: Integración de React Query para caching y gestión eficiente de estados.
-   **Diseño responsive**: Interfaz adaptable a diferentes dispositivos.

## 💻 Tecnologías Utilizadas

### Frontend
-   **Framework**: React 18 con TypeScript
-   **Estilos**: Tailwind CSS 4.0
-   **Routing**: React Router 7
-   **Estado y Fetching**: React Query (TanStack Query)
-   **Formularios**: React Hook Form
-   **Drag & Drop**: DND Kit
-   **Componentes UI**: Headless UI, Heroicons
-   **Notificaciones**: React Toastify
-   **Bundler**: Vite 6

### Backend
-   **Runtime**: Node.js con Bun
-   **Framework**: Express
-   **Base de datos**: MongoDB con Mongoose
-   **Autenticación**: JWT
-   **Validación**: Express Validator, Valibot
-   **Seguridad**: Bcrypt para hashing de contraseñas
-   **Email**: Nodemailer
-   **Logging**: Morgan

## 🛠️ Instalación y Configuración

### Requisitos Previos
-   Node.js (v18 o superior)
-   MongoDB
-   Bun (opcional, pero recomendado)

### Pasos para Instalación

1. **Clonar el repositorio**
   ```bash
   git clone [url_del_repositorio]
   cd uptask
   ```

2. **Configurar variables de entorno**
   
   Crea un archivo `.env` en la carpeta `api` con las siguientes variables:
   ```
   APPLICATION_NAME=Uptask
   APPLICATION_VERSION=v1.0.1
   ENVIRONMENT=development
   PORT=4000
   BASE_URL=http://localhost
   DATABASE_URL=mongodb://localhost:27017/uptask
   ALLOWED_ORIGINS=http://localhost:3000
   SMTP_HOST=smtp.mailtrap.io
   SMTP_PORT=2525
   SMTP_USER=tu_usuario
   SMTP_PASS=tu_contraseña
   JWT_SECRET=tu_secreto_jwt
   JWT_ACCESS_EXPIRATION_MINUTES=15m
   JWT_REFRESH_EXPIRATION_DAYS=30d
   FRONTEND_URL=http://localhost:3000
   ```

   Crea un archivo `.env` en la carpeta `website` con:
   ```
   VITE_API_URL=http://localhost:4000/api
   ```

3. **Instalar dependencias y ejecutar**

   **Backend (API)**
   ```bash
   cd api
   bun install
   bun run dev
   ```

   **Frontend (Website)**
   ```bash
   cd website
   bun install
   bun run dev
   ```

4. **Acceder a la aplicación**
   - Frontend: http://localhost:3000
   - API: http://localhost:4000

## 📂 Estructura del Proyecto

El proyecto está organizado en dos carpetas principales:

### API (Backend)
```
api/
├── src/
│   ├── config/       # Configuración (DB, CORS, Email)
│   ├── controllers/  # Controladores de la API
│   ├── emails/       # Plantillas de correo
│   ├── middlewares/  # Middlewares personalizados
│   ├── models/       # Modelos de datos (Mongoose)
│   ├── routes/       # Rutas de la API
│   ├── utils/        # Utilidades (JWT, Bcrypt)
│   └── index.ts      # Punto de entrada
└── package.json
```

### Website (Frontend)
```
website/
├── public/          # Archivos estáticos
├── src/
│   ├── components/   # Componentes reutilizables
│   ├── hooks/        # Custom hooks
│   ├── layouts/      # Layouts de la aplicación
│   ├── lib/          # Configuración de librerías
│   ├── locales/      # Archivos de internacionalización
│   ├── services/     # Servicios para API
│   ├── types/        # Definiciones de TypeScript
│   ├── utils/        # Utilidades
│   ├── views/        # Vistas/Páginas
│   └── main.tsx      # Punto de entrada
└── package.json
```

## 🚀 Despliegue

El proyecto está diseñado para ser desplegado fácilmente en plataformas como:

- **Frontend**: Vercel, Netlify, GitHub Pages
- **Backend**: Render, Railway, Heroku, AWS
- **Base de datos**: MongoDB Atlas

### Pasos para Despliegue

1. **Backend**
   - Configura las variables de entorno en tu plataforma de despliegue
   - Despliega el código desde el repositorio

2. **Frontend**
   - Configura la variable `VITE_API_URL` con la URL de tu API desplegada
   - Ejecuta `bun run build` para generar los archivos estáticos
   - Sube los archivos de la carpeta `dist` a tu plataforma de hosting

## 🌟 Contribuciones

Las contribuciones son bienvenidas. Para colaborar, sigue estos pasos:

1. Haz un fork del repositorio.
2. Crea una rama con tu feature o fix (`git checkout -b feature/nueva-funcionalidad`).
3. Realiza tus cambios y asegúrate de seguir las convenciones de código.
4. Envía un pull request con una descripción detallada de los cambios.

## 📄 Licencia

Este proyecto está bajo la licencia **MIT**.

**¡Gracias por visitar este proyecto!** 😊
