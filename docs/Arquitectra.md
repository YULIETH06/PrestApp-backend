# Documentación Técnica del Backend — Presta App

## Descripción

Este documento describe la arquitectura actual del backend de **Presta App** después de la migración a la nueva estructura modular.

El backend está desarrollado con **Node.js, Express, TypeScript, Prisma, MySQL, JWT y Socket.IO**.

Actualmente el backend está organizado en los siguientes módulos:

- Autenticación.
- Usuarios.
- PQR.
- Notificaciones.
- Catálogo común de tipos de identificación.
- Chat de PQR en tiempo real.

---

# Estructura general

```txt
PrestApp-backend/
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

| Archivo / Carpeta | Descripción |
| --- | --- |
| `docs/` | Documentación técnica del backend |
| `prisma/` | Configuración, esquema y migraciones de Prisma |
| `prisma/migrations/` | Historial de cambios de base de datos |
| `prisma/schema.prisma` | Modelos, enums y relaciones de la base de datos |
| `src/` | Código fuente del backend |
| `.env` | Variables de entorno |
| `package.json` | Dependencias y scripts |
| `prisma.config.ts` | Configuración de Prisma |
| `tsconfig.json` | Configuración de TypeScript |

---

# Estructura interna de `src`

```txt
src/
│
├── app.ts
├── server.ts
│
├── config/
│   ├── client.ts
│   └── socket.ts
│
├── controllers/
│   ├── auth/
│   │   └── auth.controller.ts
│   ├── common/
│   │   └── identificationType.controller.ts
│   ├── notifications/
│   │   └── notification.controller.ts
│   ├── pqrs/
│   │   ├── pqr.controller.ts
│   │   └── pqrMessage.controller.ts
│   └── users/
│       ├── profile.controller.ts
│       ├── user.controller.ts
│       └── userBulk.controller.ts
│
├── helpers/
│
├── interfaces/
│   ├── auth/
│   │   └── auth.interface.ts
│   ├── notifications/
│   │   └── notification.interface.ts
│   ├── pqrs/
│   │   ├── pqr.interface.ts
│   │   └── pqrMessage.interface.ts
│   ├── sockets/
│   │   └── socket.interface.ts
│   └── users/
│       └── userBulk.interface.ts
│
├── middlewares/
│   ├── auth/
│   │   ├── auth.middleware.ts
│   │   ├── role.middleware.ts
│   │   └── socketAuth.middleware.ts
│   ├── errors/
│   ├── uploads/
│   │   └── pqrs/
│   │       └── pqrAttachmentUpload.middleware.ts
│   ├── validation/
│   └── index.ts
│
├── routes/
│   ├── auth/
│   │   └── auth.routes.ts
│   ├── common/
│   │   └── identificationType.routes.ts
│   ├── notifications/
│   │   └── notification.routes.ts
│   ├── pqrs/
│   │   ├── pqr.routes.ts
│   │   └── pqrMessage.routes.ts
│   ├── users/
│   │   ├── profile.routes.ts
│   │   └── user.routes.ts
│   └── index.ts
│
├── services/
│   ├── auth/
│   │   └── auth.service.ts
│   ├── common/
│   │   └── identificationType.service.ts
│   ├── notifications/
│   │   ├── pqrs/
│   │   │   └── pqrNotification.service.ts
│   │   └── notification.service.ts
│   ├── pqrs/
│   │   ├── pqr.service.ts
│   │   ├── pqrAttachment.service.ts
│   │   └── pqrMessage.service.ts
│   └── users/
│       ├── user.service.ts
│       └── userBulk.service.ts
│
├── sockets/
│   ├── notifications/
│   │   └── notification.socket.ts
│   ├── pqrs/
│   │   └── pqr.socket.ts
│   └── index.socket.ts
│
└── utils/
    └── validators.ts
```

---

# Arquitectura utilizada

Para peticiones HTTP:

```txt
Route -> Controller -> Service -> Prisma
```

Para funcionalidades en tiempo real:

```txt
Socket.IO -> Socket Middleware JWT -> Socket Event -> Service -> Prisma
```

---

# Responsabilidad de carpetas

| Carpeta | Responsabilidad |
| --- | --- |
| `config` | Prisma Client y Socket.IO |
| `controllers` | Recibir solicitudes HTTP y construir respuestas |
| `interfaces` | Tipos TypeScript reutilizables |
| `middlewares` | Autenticación, roles y carga de archivos |
| `routes` | Definición y agrupación de endpoints |
| `services` | Lógica de negocio y acceso a Prisma |
| `sockets` | Eventos en tiempo real |
| `utils` | Funciones reutilizables y validaciones |

---

# Organización por módulos

## Autenticación

Responsabilidades principales:

- Registro individual.
- Login.
- Generación y validación de JWT.
- Cambio de contraseña del usuario autenticado.

## Usuarios

Responsabilidades principales:

- Obtener usuarios.
- Obtener agentes.
- Cambiar roles.
- Restablecer contraseña desde administración.
- Carga masiva mediante Excel.

La carga masiva se mantiene dentro de `users`:

```txt
routes/users/user.routes.ts
    ↓
controllers/users/userBulk.controller.ts
    ↓
services/users/userBulk.service.ts
    ↓
Prisma
```

## PQR

Responsabilidades principales:

- Crear solicitudes.
- Consultar PQR propias, disponibles, asignadas y administrativas.
- Asignar, reasignar agentes.
- Cambiar estado y prioridad.
- Calificar solicitudes cerradas.
- Administrar chat, lectura y adjuntos.

## Notificaciones

Responsabilidades principales:

- Crear notificaciones derivadas del flujo de PQR.
- Consultar notificaciones del usuario autenticado.
- Consultar cantidad de no leídas.
- Marcar una o todas como leídas.
- Emitir nuevas notificaciones mediante Socket.IO.

## Common

Actualmente conserva únicamente el catálogo:

```txt
IdentificationType
```

Su endpoint permite consultar tipos de identificación activos.

---

# Archivos principales

## `src/app.ts`

Encargado de:

- Inicializar Express.
- Configurar middlewares.
- Configurar CORS.
- Registrar rutas.
- Servir recursos necesarios.
- Exportar la aplicación.

## `src/server.ts`

Encargado de:

- Crear el servidor HTTP.
- Inicializar Socket.IO.
- Definir el puerto.
- Levantar el backend.

## `src/config/client.ts`

Crea y exporta la instancia de Prisma Client.

## `src/config/socket.ts`

Inicializa Socket.IO, configura autenticación JWT para sockets y registra los eventos del sistema.

---

# Variables de entorno

```env
PORT=4000
DATABASE_URL=
JWT_SECRET=
```

| Variable | Descripción |
| --- | --- |
| `PORT` | Puerto del backend |
| `DATABASE_URL` | URL de conexión MySQL usada por Prisma |
| `JWT_SECRET` | Clave para firmar y validar JWT |

---

# Base de datos

El backend utiliza **MySQL** mediante Prisma.

El esquema actual contiene los modelos:

```txt
IdentificationType
User
PQR
PqrMessage
PqrChatRead
PqrMessageAttachment
Notification
```
