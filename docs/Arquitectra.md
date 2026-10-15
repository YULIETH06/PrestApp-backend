# Arquitectura del backend

## Descripción

Este documento describe la arquitectura del backend de PrestApp: tecnologías utilizadas, organización de carpetas y archivos, recorrido de una petición, autenticación, notificaciones en tiempo real y la forma de agregar módulos nuevos.

---

# Tecnologías utilizadas

| Tecnología | Uso dentro del proyecto |
|---|---|
| Node.js | Entorno de ejecución |
| Express 5 | Servidor HTTP y rutas de la API |
| TypeScript | Tipado del código. El proyecto usa módulos ES, por eso los imports terminan en `.js` |
| Prisma 6 | ORM para trabajar con la base de datos |
| MySQL | Base de datos |
| jsonwebtoken | Generación y validación de tokens JWT |
| bcryptjs | Encriptación de contraseñas |
| Socket.IO | Notificaciones en tiempo real |
| Multer | Recepción de archivos en las peticiones |
| XLSX | Lectura de archivos Excel (carga masiva de usuarios) |
| tsx | Ejecución del servidor en desarrollo con reinicio automático |

---

# Estructura general del backend

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

---

# Descripción de la estructura

| Archivo / Carpeta | Descripción |
|---|---|
| `docs` | Documentación técnica del backend |
| `node_modules` | Dependencias instaladas (no se sube a git) |
| `prisma` | Configuración de Prisma y migraciones |
| `prisma/migrations` | Historial de cambios de la base de datos |
| `prisma/schema.prisma` | Modelos, enums, relaciones y conexión a la base de datos |
| `src` | Código fuente del backend |
| `.env` | Variables de entorno (no se sube a git) |
| `.gitignore` | Archivos y carpetas que git no debe seguir |
| `package.json` | Dependencias y scripts |
| `package-lock.json` | Versiones exactas de las dependencias instaladas |
| `prisma.config.ts` | Configuración de Prisma (carga el `.env` y la ruta del schema) |
| `tsconfig.json` | Configuración de TypeScript |

---

# Estructura interna de src

El código se organiza **por capa** (routes, controllers, services…) y dentro de cada capa **por módulo** (auth, users, notifications, clients, common). Así, todo lo de un módulo tiene el mismo nombre de carpeta en cada capa.

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
│   ├── auth/
│   │   └── auth.controller.ts
│   ├── clients/
│   │   └── client.controller.ts
│   ├── common/
│   │   └── identificationType.controller.ts
│   ├── notifications/
│   │   └── notification.controller.ts
│   └── users/
│       ├── profile.controller.ts
│       ├── user.controller.ts
│       └── userBulk.controller.ts
│
├── interfaces/
│   ├── auth/
│   │   └── auth.interface.ts
│   ├── clients/
│   │   └── client.interface.ts
│   ├── notifications/
│   │   └── notification.interface.ts
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
│   ├── uploads/
│   │   └── excelUpload.middleware.ts
│   ├── errors/          (vacía)
│   ├── validation/      (vacía)
│   └── index.ts
│
├── routes/
│   ├── auth/
│   │   └── auth.routes.ts
│   ├── clients/
│   │   └── client.routes.ts
│   ├── common/
│   │   └── identificationType.routes.ts
│   ├── notifications/
│   │   └── notification.routes.ts
│   ├── users/
│   │   ├── profile.routes.ts
│   │   └── user.routes.ts
│   └── index.ts
│
├── services/
│   ├── auth/
│   │   └── auth.service.ts
│   ├── clients/
│   │   └── client.service.ts
│   ├── common/
│   │   └── identificationType.service.ts
│   ├── notifications/
│   │   └── notification.service.ts
│   └── users/
│       ├── user.service.ts
│       └── userBulk.service.ts
│
├── sockets/
│   ├── notifications/
│   │   └── notification.socket.ts
│   └── index.socket.ts
│
├── helpers/             (vacía)
│
└── utils/
    ├── clients/
    │   └── client.validation.ts
    └── common/
        ├── textUtils.ts
        └── validators.ts
```

> Las carpetas `helpers`, `middlewares/errors` y `middlewares/validation` están vacías. Quedan reservadas para el manejador de errores y validaciones que se agreguen más adelante. Git no guarda carpetas vacías, así que pueden no aparecer al clonar el proyecto.

---

# Descripción de carpetas

| Carpeta | Descripción |
|---|---|
| `config` | Instancia de Prisma y configuración de Socket.IO |
| `routes` | Define las URL de cada módulo y qué middlewares y controlador usa cada una |
| `controllers` | Reciben la petición, validan los datos de entrada y deciden la respuesta HTTP |
| `services` | Lógica de negocio y consultas a la base de datos con Prisma |
| `middlewares` | Funciones que se ejecutan antes del controlador: autenticación, roles y carga de archivos |
| `interfaces` | Tipos de TypeScript compartidos por módulo |
| `sockets` | Eventos de Socket.IO organizados por funcionalidad |
| `helpers` | Funciones de apoyo específicas de un proceso de negocio (vacía por ahora) |
| `utils/common` | Funciones genéricas reutilizables en cualquier módulo (validar y limpiar textos) |
| `utils/<módulo>` | Validación de los datos de entrada de un módulo |

---

# Módulos actuales

| Módulo | Qué hace | Archivos |
|---|---|---|
| `auth` | Registro, login y cambio de contraseña propia | route, controller, service, interface |
| `users` | Perfil, administración de usuarios y carga masiva desde Excel | 2 routes, 3 controllers, 2 services, 1 interface |
| `notifications` | Notificaciones por usuario (HTTP y tiempo real) | route, controller, service, interface, socket |
| `clients` | Clientes de cada prestamista: listar, ver, crear, editar, activar y desactivar | route, controller, service, interface, validation |
| `common` | Catálogos compartidos: tipos de identificación | route, controller, service |

Las rutas de cada módulo están documentadas en `Endpoints.md`.

---

# Arquitectura utilizada

## Peticiones HTTP

```txt
Route → Middlewares → Controller → Service → Prisma → MySQL
```

| Capa | Responsabilidad | Ejemplo |
|---|---|---|
| Route | Define método, URL, middlewares y controlador | `router.patch("/:id/role", authMiddleware, roleMiddleware(["ADMIN"]), updateUserRole)` |
| Middleware | Verifica token, rol o archivo antes de continuar | `authMiddleware` |
| Controller | Lee `req`, valida los datos de entrada y responde con el código adecuado | `updateUserRole` valida el `id` y el `role` |
| Validación | Revisa el **formato** de los datos y los limpia. No consulta la base de datos | `validateClientData` en `utils/clients/client.validation.ts` |
| Service | Aplica las **reglas del negocio** y consulta la base de datos | `createClientService` revisa el documento repetido y guarda el cliente |

Reglas que se siguen:

* **El controlador no consulta la base de datos directamente**; llama a un servicio.
* **El servicio no conoce `req` ni `res`**; recibe datos y devuelve resultados o lanza errores.
* Las respuestas siempre incluyen un campo `message`.

## Notificaciones en tiempo real

```txt
Cliente Socket.IO → socketAuthMiddleware (JWT) → conexión → sala user_<id>
Service → createNotificationService → guarda en MySQL → emite new_notification a la sala
```

---

# Archivos principales

## src/server.ts

Punto de entrada del backend. Se encarga de:

* Importar la aplicación de Express.
* Crear el servidor HTTP.
* Inicializar Socket.IO sobre ese servidor.
* Escuchar en el puerto definido en `PORT` (por defecto `4000`).

---

## src/app.ts

Configura la aplicación de Express:

* Habilita CORS.
* Permite recibir JSON en el cuerpo de las peticiones.
* Publica la carpeta `uploads/` en la URL `/uploads`.
* Registra todas las rutas bajo el prefijo `/api`.

---

## src/routes/index.ts

Une las rutas de todos los módulos:

| Prefijo | Archivo de rutas |
|---|---|
| `/api/health` | Definida directamente en este archivo |
| `/api/auth` | `auth/auth.routes.ts` |
| `/api/users` | `users/user.routes.ts` |
| `/api/profile` | `users/profile.routes.ts` |
| `/api/notifications` | `notifications/notification.routes.ts` |
| `/api/clients` | `clients/client.routes.ts` |
| `/api/common/identification-types` | `common/identificationType.routes.ts` |

---

## src/config/client.ts

Crea y exporta **una única instancia** de Prisma Client. Todos los servicios la importan desde aquí para no abrir conexiones nuevas en cada consulta.

---

## src/config/socket.ts

Inicializa Socket.IO dentro del servidor HTTP:

* Crea la instancia de Socket.IO.
* Configura CORS con `FRONTEND_URL` para permitir la conexión desde el frontend.
* Aplica `socketAuthMiddleware` para exigir un token válido al conectarse.
* Registra los eventos definidos en `sockets/index.socket.ts`.
* Expone `getIo()` para que los servicios puedan emitir eventos.

---

## src/middlewares/index.ts

Exporta todos los middlewares desde un solo lugar. Las rutas los importan así:

```ts
import { authMiddleware, roleMiddleware, uploadExcel } from "../../middlewares/index.js";
```

---

# Autenticación y roles

## Token JWT

* Se genera en el login (`auth.service.ts`) y dura **1 día**.
* Contiene: `id`, `email` y `role` del usuario.
* Se firma con la variable `JWT_SECRET`.
* El frontend lo envía en cada petición: `Authorization: Bearer TOKEN`.

## Middlewares de autenticación

| Middleware | Archivo | Qué hace |
|---|---|---|
| `authMiddleware` | `auth/auth.middleware.ts` | Valida el token y guarda el usuario en `req.user`. Si falla, responde `401` |
| `roleMiddleware(roles)` | `auth/role.middleware.ts` | Permite continuar solo si el rol del usuario está en la lista. Si no, responde `403` |
| `socketAuthMiddleware` | `auth/socketAuth.middleware.ts` | Valida el token al conectarse por Socket.IO y guarda el usuario en `socket.user` |

`req.user` está tipado con la interfaz `AuthRequest` (`interfaces/auth/auth.interface.ts`) y `socket.user` con `AuthSocket` (`interfaces/sockets/socket.interface.ts`).

## Roles disponibles

| Rol | Descripción |
|---|---|
| `ADMIN` | Administra la plataforma y los usuarios (más adelante, las membresías) |
| `USER` | Persona que presta dinero y administra sus propios registros |

## Uso en las rutas

Ruta solo para ADMIN:

```ts
router.get(
  "/",
  authMiddleware,
  roleMiddleware(["ADMIN"]),
  getUsers
);
```

Ruta para cualquier usuario con sesión:

```ts
router.get("/", authMiddleware, getProfile);
```

---

# Notificaciones en tiempo real

## Funcionamiento

1. El frontend se conecta enviando el token: `io(URL, { auth: { token } })`.
2. `socketAuthMiddleware` valida el token; si no es válido, rechaza la conexión.
3. Al conectarse, cada usuario entra a su **sala personal** `user_<id>`.
4. Cuando un servicio llama a `createNotificationService`, la notificación se guarda en la base de datos y se emite el evento `new_notification` **solo** a la sala de ese usuario.

## Eventos

| Evento | Dirección | Contenido |
|---|---|---|
| `connection` | Cliente → servidor | Conexión autenticada |
| `new_notification` | Servidor → cliente | La notificación creada |
| `disconnect` | Cliente → servidor | Fin de la conexión |

## Archivos

| Archivo | Responsabilidad |
|---|---|
| `config/socket.ts` | Crea Socket.IO y expone `getIo()` |
| `sockets/index.socket.ts` | Maneja la conexión y une al usuario a su sala |
| `sockets/notifications/notification.socket.ts` | `emitNotificationToUser`: emite a la sala del usuario |
| `services/notifications/notification.service.ts` | Crea notificaciones y las emite |

> Actualmente ningún módulo crea notificaciones. La infraestructura queda lista para avisos futuros como "cuota que vence hoy" o "membresía por vencer".

---

# Carga de archivos

## src/middlewares/uploads/excelUpload.middleware.ts

Exporta `uploadExcel`, usado por la carga masiva de usuarios (`POST /api/users/bulk`):

* Guarda el archivo **en memoria** (no en disco); el servicio lo lee desde `req.file.buffer`.
* Solo acepta archivos Excel (`.xlsx` y `.xls`).
* Tamaño máximo: 2 MB.

## Carpeta uploads

`app.ts` publica la carpeta `uploads/` en la URL `/uploads`. Hoy no se guardan archivos ahí; queda disponible para futuros comprobantes o documentos.

---

# Utilidades

## Regla de organización

```txt
Si una función sirve para cualquier módulo, va en utils/common.
Si valida los datos de un solo módulo, va en utils/nombreModulo.
Las funciones de utils no consultan la base de datos.
```

## src/utils/common/validators.ts

Funciones que **validan**: responden `true` o `false`.

| Función | Valida | Se usa en |
|---|---|---|
| `containsOnlyLetters` | Solo letras, espacios, tildes y ñ | Nombre en registro, carga masiva y clientes |
| `containsOnlyNumbers` | Solo números | `isValidPhone` |
| `isValidEmail` | Formato básico de correo | Registro y carga masiva |
| `isValidPhone` | Solo números, entre 7 y 15 dígitos | Teléfonos de clientes |

## src/utils/common/textUtils.ts

Funciones que **limpian** un texto: devuelven el texto arreglado.

| Función | Qué hace | Ejemplo |
|---|---|---|
| `cleanText` | Quita espacios al inicio y al final, y deja un solo espacio entre palabras | `"  María   López "` → `"María López"` |
| `removeSpaces` | Quita todos los espacios | `"300 123 4567"` → `"3001234567"` |

Si el valor no es texto, ambas devuelven `""`.

## src/utils/clients/client.validation.ts

| Función | Qué hace | Se usa en |
|---|---|---|
| `validateClientData(body)` | Revisa el formato de los datos de un cliente y los limpia. Devuelve `{ isValid: false, message }` o `{ isValid: true, data }` | Crear y editar cliente |
| `parseClientStatus(value)` | Convierte `?status=` en `active`, `inactive` o `all`. Devuelve `null` si no es válido | Listar clientes |

---

# Variables de entorno

## Archivo

```txt
.env
```

## Variables

```env
DATABASE_URL="mysql://usuario:password@localhost:3306/prestaapp"
JWT_SECRET="una_clave_larga_y_secreta"
PORT=4000
FRONTEND_URL="http://localhost:5173"
```

## Descripción

| Variable | Descripción |
|---|---|
| `DATABASE_URL` | URL de conexión a MySQL utilizada por Prisma |
| `JWT_SECRET` | Clave secreta para generar y validar los tokens JWT |
| `PORT` | Puerto donde se ejecuta el backend (por defecto `4000`) |
| `FRONTEND_URL` | URL del frontend, usada en el CORS de Socket.IO |

La guía completa de instalación está en `Instalacion.md`.

---

# Configuración de Prisma

## Archivo schema.prisma

El archivo `prisma/schema.prisma` define:

* El proveedor de base de datos (MySQL) y la conexión mediante `DATABASE_URL`.
* La generación del cliente de Prisma.
* Los modelos: `User`, `IdentificationType`, `Notification` y `Client`.
* Los enums: `Role` y `NotificationType`.
* Las relaciones entre tablas.

El detalle de cada modelo y cómo hacer migraciones está en `Base-de-datos.md`.

---

# Cómo agregar un módulo nuevo

Se sigue el mismo orden con el que se construyó `clients`. Ejemplo con el próximo módulo, `loans`:

1. Agregar el modelo en `prisma/schema.prisma` y ejecutar `npx prisma migrate dev --name add_loans`.
2. Crear `src/interfaces/loans/loan.interface.ts` con los tipos de datos.
3. Crear `src/utils/loans/loan.validation.ts` con la validación y limpieza de los datos. Usar las funciones de `utils/common` antes de crear funciones nuevas.
4. Crear `src/services/loans/loan.service.ts` con las consultas y las reglas del negocio (`throw new Error("mensaje")`).
5. Crear `src/controllers/loans/loan.controller.ts`: revisa el usuario, el id y la validación, llama al servicio y responde.
6. Crear `src/routes/loans/loan.routes.ts` con las rutas y sus middlewares.
7. Registrar las rutas en `src/routes/index.ts`: `router.use("/loans", loanRoutes);`
8. Verificar con `npx tsc --noEmit` y probar en Postman.
9. Documentar las rutas en `Endpoints.md`, el modelo en `Base-de-datos.md` y actualizar este documento (estructura y módulos actuales).