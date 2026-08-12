# Documentación Técnica

## Descripción

Documentación técnica inicial del backend desarrollado con Node.js, Express y TypeScript.

El backend permite gestionar usuarios, autenticación mediante JWT, roles, carga masiva de usuarios, creación y administración de PQR, asignación de agentes, cambio de estado, prioridad, calificación de PQR cerradas y chat en tiempo real para el seguimiento de cada solicitud mediante Socket.IO.

---

# Estructura general del backend

```txt
backend-inc/
│
├── docs/
├── node_modules/
├── prisma/
│   ├── migrations/
│   └── schema.prisma
├── src/
├── .env
├── .gitignore
├── package-lock.json
├── package.json
├── prisma.config.ts
└── tsconfig.json
```

---

# Descripción de la estructura

| Archivo / Carpeta    | Descripción                                                |
| -------------------- | ---------------------------------------------------------- |
| docs                 | Documentación técnica del proyecto                         |
| node_modules         | Dependencias instaladas del proyecto                       |
| prisma               | Configuración de Prisma y migraciones                      |
| prisma/migrations    | Historial de migraciones de base de datos                  |
| prisma/schema.prisma | Definición de modelos, enums, relaciones y conexión Prisma |
| src                  | Código fuente principal del backend                        |
| .env                 | Variables de entorno                                       |
| .gitignore           | Archivos ignorados por Git                                 |
| package.json         | Dependencias y scripts del proyecto                        |
| package-lock.json    | Control de versiones exactas de dependencias               |
| prisma.config.ts     | Configuración personalizada de Prisma                      |
| tsconfig.json        | Configuración de TypeScript                                |

---

# Estructura interna de src

Se organizó la estructura principal del backend dentro de la carpeta `src` para separar responsabilidades y mantener una arquitectura escalable.

### Estructura

```txt
src/
│
├── server.ts
├── app.ts
│
├── config/
│   ├── client.ts
│   └── socket.ts
│
├── controllers/
│   ├── auth
│   |   └── auth.controller.ts
│   ├── notifications
│   |   └── notification.controller.ts
│   ├── pqrs
|   |   ├── pqr.controller.ts
│   |   └── pqrMessage.controller.ts
│   └── users
│       ├── profile.controller.ts
|       └─ user.controller.ts
|
├── interfaces/
│   ├── auth
│   |   └── auth.interface.ts
│   ├── notifications
│   |   └── notification.interface.ts
│   ├── pqrs
|   |   ├── pqr.interface.ts
│   |   └── pqrMessage.interface.ts
│   └── sockets
|       └─ socket.interface.ts
│
├── middlewares/
│   ├── auth.middleware.ts
│   ├── role.middleware.ts
│   ├── socketAuth.middleware.ts
│   └── upload.middleware.ts
│
├── routes/
│   ├── auth
│   |   └── auth.routes.ts
│   ├── notifications
│   |   └── notification.routes.ts
│   ├── pqrs
|   |   ├── pqr.routes.ts
│   |   └── pqrMessage.routes.ts
│   ├── users
|   |   ├── profile.routes.ts
|   |   └── user.routes.ts
│   └── index.ts
│
├── services/
│   ├── auth
│   |   └── auth.service.ts
│   ├── notifications
│   |   └── notification.service.ts
│   ├── pqrs
|   |   ├── pqr.service.ts
|   |   ├── pqrAttachment.service.ts
│   |   └── pqrMessage.service.ts
│   └── users
|       └─ user.service.ts
│
├── sockets/
│   ├── index.socket.ts
│   ├── notification.socket.ts
│   └── pqr.socket.ts
│
└── Utils/
    └── validators.ts
```

---

# Descripción de carpetas

| Carpeta     | Descripción                                                                         |
| ----------- | ----------------------------------------------------------------------------------- |
| config      | Configuraciones generales del proyecto, cliente Prisma y configuración de Socket.IO |
| controllers | Controladores de las peticiones HTTP                                                |
| interfaces  | Interfaces y tipados TypeScript reutilizables                                       |
| middlewares | Middlewares personalizados para autenticación y validaciones                        |
| routes      | Definición y agrupación de rutas de la API                                          |
| services    | Lógica de negocio y conexión con Prisma                                             |
| sockets     | Eventos de Socket.IO para funcionalidades en tiempo real                            |
| utils       | Funciones reutilizables                                                             |

---

# Arquitectura utilizada

```txt
Route -> Controller -> Service -> Prisma
```

Para la funcionalidad de chat en tiempo real se utiliza la siguiente arquitectura:

```txt
Socket.IO -> Socket Middleware JWT -> Socket Event -> Service -> Prisma
```

---

# Archivos principales

## src/app.ts

Archivo encargado de:

* Inicializar Express.
* Configurar middlewares.
* Configurar CORS.
* Registrar rutas.
* Exportar la aplicación.

---

## src/server.ts

Archivo principal encargado de:

* Importar la aplicación.
* Crear el servidor HTTP.
* Definir puerto.
* Inicializar Socket.IO.
* Levantar el servidor.

---

## src/config/client.ts

Archivo encargado de crear y exportar la instancia de Prisma Client.


---

## src/config/socket.ts

Archivo encargado de inicializar Socket.IO dentro del servidor HTTP.

Funciones principales:

* Crear la instancia de Socket.IO.
* Configurar CORS para permitir conexión desde el frontend.
* Aplicar el middleware de autenticación por JWT para sockets.
* Registrar los eventos del chat de PQR.

---

# Variables de entorno

## Archivo

```txt
.env
```

## Variables

```env
PORT=4000
DATABASE_URL=
JWT_SECRET=
```

## Descripción

| Variable     | Descripción                                               |
| ------------ | --------------------------------------------------------- |
| PORT         | Puerto donde se ejecuta el backend                        |
| DATABASE_URL | URL de conexión a MySQL utilizada por Prisma              |
| JWT_SECRET   | Clave secreta utilizada para generar y validar tokens JWT |

---

# Configuración de Prisma

## Archivo `schema.prisma`

El archivo `schema.prisma` define:

* El proveedor de base de datos.
* Los modelos de Prisma.
* Los enums.
* Las relaciones entre tablas.
* La generación del cliente Prisma.

---
