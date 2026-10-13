# Base de datos

## Descripción general

Este documento describe la base de datos del backend de PrestApp: los modelos definidos en `prisma/schema.prisma`, sus campos, relaciones y restricciones, y la forma de hacer cambios mediante migraciones.

La base de datos es **MySQL** y se administra con **Prisma 6**. Toda la estructura se define en `schema.prisma`; **las tablas nunca se modifican a mano en MySQL**.

Actualmente el sistema tiene tres modelos:

| Modelo | Para qué sirve |
|---|---|
| `User` | Usuarios que inician sesión en la aplicación |
| `IdentificationType` | Catálogo de tipos de documento (CC, CE, NIT…) |
| `Notification` | Notificaciones internas de cada usuario |

---

# Conceptos básicos de Prisma

## Modelo

Un **modelo** representa una tabla de la base de datos. Por ejemplo, `model User` crea la tabla `User`.

## Campo

Un **campo** representa una columna. Por ejemplo:

```prisma
email String @unique
```

Crea la columna `email`, de tipo texto, sin valores repetidos.

## Tipos de datos usados

| Tipo | Descripción |
|---|---|
| `Int` | Números enteros |
| `String` | Texto |
| `Boolean` | Verdadero o falso |
| `DateTime` | Fecha y hora |
| Enum | Lista fija de valores permitidos |

Un `?` después del tipo (`String?`) indica que el campo es opcional.

## Atributos usados

| Atributo | Descripción |
|---|---|
| `@id` | Clave primaria de la tabla |
| `@default(autoincrement())` | El número aumenta solo en cada registro nuevo |
| `@default(valor)` | Valor por defecto si no se envía |
| `@default(now())` | Guarda la fecha y hora de creación |
| `@updatedAt` | Actualiza la fecha automáticamente cada vez que el registro cambia |
| `@unique` | No permite valores repetidos |
| `@db.VarChar(n)` | Texto con un máximo de `n` caracteres en MySQL |
| `@relation` | Define la relación con otra tabla |

---

# Enums

## Role

Define los roles del sistema.

```prisma
enum Role {
  USER
  ADMIN
}
```

| Valor | Descripción |
|---|---|
| `USER` | Persona que presta dinero y administra sus propios registros. Es el rol por defecto |
| `ADMIN` | Administra la plataforma y los usuarios (más adelante, las membresías) |

## NotificationType

Define los tipos de notificación.

```prisma
enum NotificationType {
  GENERAL
}
```

| Valor | Descripción |
|---|---|
| `GENERAL` | Notificación general. Es el tipo por defecto |

Prisma no permite enums vacíos, por eso existe `GENERAL`. Se agregarán tipos nuevos cuando existan préstamos y membresías, por ejemplo `INSTALLMENT_DUE` (cuota que vence) o `MEMBERSHIP_EXPIRING` (membresía por vencer).

---

# Modelo User

## Descripción

El modelo `User` representa a las personas que inician sesión en la aplicación.

Cada usuario tiene un rol (`USER` o `ADMIN`). La contraseña se guarda encriptada con bcrypt y nunca se devuelve en las respuestas del API.

## Campos principales

| Campo | Tipo | Descripción |
|---|---|---|
| `id` | Int | Identificador único del usuario |
| `name` | String | Nombre del usuario |
| `email` | String | Correo electrónico, único. Se guarda en minúsculas |
| `password` | String | Contraseña encriptada con bcrypt |
| `role` | Role | Rol del sistema. Por defecto `USER` |
| `createdAt` | DateTime | Fecha de creación |
| `updatedAt` | DateTime | Fecha de última actualización |
| `notifications` | Notification[] | Notificaciones recibidas por el usuario |

## Restricciones principales

```prisma
email String @unique
```

Evita registrar dos usuarios con el mismo correo.

---

# Modelo IdentificationType

## Descripción

El modelo `IdentificationType` representa el catálogo de tipos de documento de identidad.

Permite reutilizar los tipos de documento sin escribir su nombre en cada tabla: las demás tablas guardan solo el `id` del tipo. Cada tipo puede activarse o desactivarse con `isActive`; el API solo devuelve los activos.

Se usará en el módulo de clientes para el documento de cada persona a la que se le presta.

Los registros se cargan con SQL (ver `Instalacion.md`).

## Campos principales

| Campo | Tipo | Descripción |
|---|---|---|
| `id` | Int | Identificador único del tipo |
| `code` | String | Código único, máximo 20 caracteres. Ejemplo: `CC`, `CE`, `NIT` |
| `name` | String | Nombre único, máximo 100 caracteres. Ejemplo: `Cédula de ciudadanía` |
| `isActive` | Boolean | Indica si el tipo está disponible en los formularios. Por defecto `true` |
| `createdAt` | DateTime | Fecha de creación |
| `updatedAt` | DateTime | Fecha de última actualización |

## Restricciones principales

```prisma
code String @unique @db.VarChar(20)
name String @unique @db.VarChar(100)
```

Evitan registrar dos tipos con el mismo código o el mismo nombre.

---

# Modelo Notification

## Descripción

El modelo `Notification` representa las notificaciones internas de cada usuario.

Cuando se crea una notificación, además de guardarse en la base de datos, se envía en tiempo real por Socket.IO al usuario destinatario (ver `Arquitectura.md`).

## Campos principales

| Campo | Tipo | Descripción |
|---|---|---|
| `id` | Int | Identificador único de la notificación |
| `title` | String | Título |
| `message` | String | Texto de la notificación |
| `type` | NotificationType | Tipo de notificación. Por defecto `GENERAL` |
| `isRead` | Boolean | Indica si el usuario ya la leyó. Por defecto `false` |
| `userId` | Int | Id del usuario destinatario |
| `createdAt` | DateTime | Fecha de creación |
| `user` | User | Relación con el usuario destinatario |

---

# Relaciones

```txt
User 1 ─────── * Notification
```

| Relación | Tipo | Descripción |
|---|---|---|
| `User` → `Notification` | Uno a muchos | Un usuario puede tener muchas notificaciones; cada notificación pertenece a un solo usuario |

---

# Migraciones

## ¿Qué es una migración?

Una migración es el proceso mediante el cual Prisma convierte los cambios hechos en `schema.prisma` en cambios reales dentro de MySQL: crear tablas, agregar o quitar columnas, cambiar enums.

Cada migración queda guardada en una carpeta dentro de `prisma/migrations`, con un archivo `migration.sql` que contiene las instrucciones SQL que se ejecutaron. Así queda un historial de todos los cambios de la base de datos.

```txt
prisma/migrations/
├── 20260507150954_init/
│   └── migration.sql
├── ...
└── 20261008211926_remove_pqr/
    └── migration.sql
```

## Cómo hacer un cambio en la base de datos

1. Editar `prisma/schema.prisma`.
2. Crear y aplicar la migración con un nombre que describa el cambio:

   ```bash
   npx prisma migrate dev --name add_clients
   ```

   Este comando:

   1. Lee `schema.prisma` y detecta los cambios.
   2. Crea una carpeta nueva en `prisma/migrations` con su `migration.sql`.
   3. Aplica los cambios en MySQL.
   4. Regenera Prisma Client.

3. Si Prisma Client no se regeneró, ejecutar:

   ```bash
   npx prisma generate
   ```

4. Verificar que el código sigue compilando:

   ```bash
   npx tsc --noEmit
   ```

5. Hacer commit del `schema.prisma` **y** de la carpeta de la migración nueva.

## Reglas

* **No editar ni borrar migraciones ya aplicadas.** Si algo quedó mal, se corrige con una migración nueva.
* **Hacer respaldo de la base de datos antes de migraciones que borran** tablas, columnas o valores de un enum.
* **Antes de quitar un valor de un enum**, actualizar o borrar las filas que lo usan; de lo contrario la migración falla (ver `Problemas-comunes.md`).
* Nombres de migración en inglés y en `snake_case`, describiendo el cambio: `add_clients`, `remove_pqr`, `add_membership_to_user`.

## Comandos útiles

| Comando | Para qué |
|---|---|
| `npx prisma migrate dev --name <nombre>` | Crea y aplica una migración |
| `npx prisma migrate dev` | Aplica las migraciones pendientes (por ejemplo, después de clonar) |
| `npx prisma generate` | Regenera Prisma Client |
| `npx prisma studio` | Abre una vista web para ver y editar los datos |
| `npx prisma validate` | Revisa que `schema.prisma` no tenga errores |
| `npx prisma format` | Ordena el formato de `schema.prisma` |

## Prisma Client

Prisma Client es la herramienta que permite consultar la base de datos desde el código. Se usa siempre desde los **servicios**, importando la instancia única de `src/config/client.ts`:

```ts
import prisma from "../../config/client.js";

const user = await prisma.user.findUnique({
  where: {
    email,
  },
});
```

Métodos más usados: `findMany`, `findUnique`, `findFirst`, `create`, `createMany`, `update`, `updateMany`, `count`.

## Historial de migraciones

| Migración | Qué hizo |
|---|---|
| `20260507150954_init` | Crea la tabla `User` |
| `20260512143946_add_role_to_user` | Agrega el campo `role` a los usuarios |
| `20260512153537_create_pqr_model` a `20260903162019_actualizar_estructura_pqr` | Migraciones del proyecto anterior: módulo PQR, chat, adjuntos, rol `AGENT`, notificaciones y la tabla `IdentificationType` |
| `20261008211926_remove_pqr` | Elimina el módulo PQR y el rol `AGENT`. Deja solo `User`, `IdentificationType` y `Notification` |

Las migraciones del proyecto anterior se conservan porque forman parte del historial: Prisma las necesita para saber en qué estado está la base de datos. Al clonar el proyecto y ejecutar `npx prisma migrate dev`, se aplican todas en orden y el resultado final es el esquema actual.