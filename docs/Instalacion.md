# Instalación del backend

## Descripción

Este documento explica cómo instalar y ejecutar el backend de PrestApp en un equipo nuevo, qué dependencias usa el proyecto, cómo está configurado y cómo se creó desde cero.

---

# Requisitos previos

| Herramienta | Versión recomendada | Para qué |
|---|---|---|
| Node.js | 20 LTS o superior | Ejecutar el backend |
| npm | La que trae Node.js | Instalar dependencias |
| MySQL | 8 | Base de datos |
| Git | Cualquiera reciente | Clonar el repositorio |

> El proyecto usa **Prisma 6**. La versión 7 cambia la configuración y presentó errores (ver `Problemas-comunes.md`). No actualizar Prisma sin revisar antes.

---

# Instalación después de clonar el proyecto

## 1. Clonar el repositorio

```bash
git clone <url-del-repositorio>
cd PrestApp/PrestApp-backend
```

---

## 2. Instalar dependencias

```bash
npm install
```

Instala todas las dependencias definidas en `package.json` (ver [Dependencias del proyecto](#dependencias-del-proyecto)).

---

## 3. Configurar las variables de entorno

Crear el archivo `.env` en la raíz de `PrestApp-backend`:

```env
DATABASE_URL="mysql://usuario:password@localhost:3306/prestaapp"
JWT_SECRET="una_clave_larga_y_secreta"
PORT=4000
FRONTEND_URL="http://localhost:5173"
```

| Variable | Descripción |
|---|---|
| `DATABASE_URL` | Conexión a MySQL: `mysql://USUARIO:CONTRASEÑA@SERVIDOR:PUERTO/NOMBRE_BASE` |
| `JWT_SECRET` | Clave para firmar y validar los tokens de sesión. Debe ser larga y secreta |
| `PORT` | Puerto del servidor. Si no se define, usa `4000` |
| `FRONTEND_URL` | Dirección del frontend. Se usa en el CORS de Socket.IO para permitir las notificaciones en tiempo real |

> El archivo `.env` está en `.gitignore`: **nunca se sube al repositorio**. Cada equipo crea el suyo.

---

## 4. Crear la base de datos

En MySQL, crear una base de datos vacía con el mismo nombre que se puso en `DATABASE_URL`:

```sql
CREATE DATABASE prestaapp;
```

---

## 5. Ejecutar las migraciones

```bash
npx prisma migrate dev
```

Aplica en orden todas las migraciones de `prisma/migrations` y deja la base de datos igual al `schema.prisma` actual.

### Mensaje esperado

```txt
Your database is now in sync with your schema.
```

---

## 6. Generar Prisma Client

```bash
npx prisma generate
```

Crea el cliente de Prisma que usa el código para consultar la base de datos. Normalmente `migrate dev` ya lo genera, pero conviene ejecutarlo después de cada `npm install`.

### Mensaje esperado

```txt
✔ Generated Prisma Client
```

---

## 7. Cargar los tipos de identificación

La tabla `IdentificationType` se usa en los formularios. Si está vacía, cargar los tipos de documento:

```sql
INSERT INTO IdentificationType (code, name, isActive, createdAt, updatedAt) VALUES
('CC',  'Cédula de ciudadanía',            true, NOW(), NOW()),
('CE',  'Cédula de extranjería',           true, NOW(), NOW()),
('NIT', 'NIT',                             true, NOW(), NOW()),
('PP',  'Pasaporte',                       true, NOW(), NOW()),
('PPT', 'Permiso por protección temporal', true, NOW(), NOW());
```

---

## 8. Iniciar el servidor

```bash
npm run dev
```

### Mensaje esperado

```txt
Servidor corriendo en el puerto 4000
```

---

## 9. Verificar que funciona

Abrir en el navegador o en Postman:

```http
GET http://localhost:4000/api/health
```

### Respuesta esperada

```json
{
  "message": "API funcionando correctamente"
}
```

---

## 10. Crear el primer administrador

El registro (`POST /api/auth/register`) siempre crea usuarios con rol `USER`, y solo un `ADMIN` puede cambiar roles. Para tener el primer administrador:

1. Registrar el usuario desde la aplicación o desde Postman.
2. Cambiar su rol directamente en MySQL:

```sql
UPDATE User SET role = 'ADMIN' WHERE email = 'correo@ejemplo.com';
```

3. Cerrar sesión y volver a entrar para que el token tenga el rol nuevo.

Después, ese administrador puede cambiar los roles de los demás usuarios desde la aplicación.

---

# Scripts y comandos

| Comando | Para qué |
|---|---|
| `npm run dev` | Inicia el servidor en desarrollo y lo reinicia al guardar cambios |
| `npx tsc --noEmit` | Revisa errores de TypeScript sin ejecutar el servidor |
| `npx prisma migrate dev` | Aplica las migraciones pendientes |
| `npx prisma migrate dev --name <nombre>` | Crea y aplica una migración nueva después de cambiar `schema.prisma` |
| `npx prisma generate` | Regenera Prisma Client |
| `npx prisma studio` | Abre una vista web para ver y editar los datos |

El único script definido en `package.json` es `dev`. Los demás se ejecutan con `npx`.

---

# Dependencias del proyecto

## Dependencias principales

| Dependencia | Versión | Uso |
|---|---|---|
| `express` | 5 | Servidor HTTP y rutas de la API |
| `cors` | 2 | Permite que el frontend se comunique con el backend |
| `dotenv` | 17 | Carga las variables del archivo `.env` |
| `@prisma/client` | 6 | Cliente para consultar la base de datos |
| `prisma` | 6 | Herramienta de línea de comandos: migraciones y generación del cliente |
| `bcryptjs` | 3 | Encriptación de contraseñas |
| `jsonwebtoken` | 9 | Generación y validación de tokens JWT |
| `socket.io` | 4 | Notificaciones en tiempo real |
| `multer` | 2 | Recibir archivos enviados como `multipart/form-data` (carga masiva de Excel) |
| `xlsx` | 0.18 | Leer archivos Excel y convertir sus filas en datos |

## Dependencias de desarrollo

| Dependencia | Uso |
|---|---|
| `typescript` | Lenguaje del proyecto y verificación de tipos |
| `tsx` | Ejecuta TypeScript directamente y reinicia el servidor con cada cambio (`tsx watch`) |
| `@types/node` | Tipos de Node.js |
| `@types/express` | Tipos de Express |
| `@types/cors` | Tipos de cors |
| `@types/jsonwebtoken` | Tipos de jsonwebtoken |
| `@types/multer` | Tipos de multer. Permite usar `req.file` con TypeScript |
| `socket.io-client` | Cliente de Socket.IO para probar las notificaciones desde el backend (`test-socket.ts`) |
| `ts-node-dev` | Instalado al inicio del proyecto; ya no se usa porque se reemplazó por `tsx` |

---

# Configuraciones del proyecto

## package.json

### Módulos ECMAScript

```json
"type": "module"
```

Permite usar la sintaxis moderna `import` / `export`. Por esta configuración, **los imports de archivos propios terminan en `.js`** aunque el archivo sea `.ts`:

```ts
import routes from "./routes/index.js";
```

### Script de desarrollo

```json
"scripts": {
  "dev": "tsx watch src/server.ts"
}
```

Ejecuta `src/server.ts` con `tsx` y reinicia el servidor automáticamente al detectar cambios.

---

## tsconfig.json

Opciones principales:

| Opción | Valor | Qué hace |
|---|---|---|
| `module` | `nodenext` | Usa el sistema de módulos moderno de Node.js |
| `target` | `esnext` | Genera JavaScript con las funciones más recientes |
| `strict` | `true` | Activa todas las verificaciones estrictas de tipos |
| `noUncheckedIndexedAccess` | `true` | Obliga a validar que un elemento de un arreglo exista antes de usarlo |
| `exactOptionalPropertyTypes` | `true` | Diferencia entre una propiedad opcional y una con valor `undefined` |
| `verbatimModuleSyntax` | `true` | Exige `import type` cuando solo se importan tipos |
| `skipLibCheck` | `true` | No revisa los tipos de las librerías de `node_modules` |

Ejemplo de `import type`, requerido por `verbatimModuleSyntax`:

```ts
import type { Request, Response } from "express";
```

---

## prisma.config.ts

```ts
import "dotenv/config";
import { defineConfig } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
});
```

Carga las variables del `.env` para los comandos de Prisma (`migrate`, `generate`, `studio`) e indica dónde está el `schema.prisma`.

---

## .gitignore

```txt
node_modules
.env
/generated/prisma
```

Evita subir al repositorio las dependencias instaladas y las variables de entorno.

---

# Cómo se creó el proyecto

Registro de los comandos usados para crear el backend desde cero. **No es necesario ejecutarlos al clonar**; sirven como referencia.

| # | Comando | Para qué |
|---|---|---|
| 1 | `npm init -y` | Crea `package.json` |
| 2 | `npm install express cors dotenv bcryptjs jsonwebtoken prisma @prisma/client` | Dependencias principales |
| 3 | `npm install -D typescript ts-node-dev @types/node @types/express @types/cors` | TypeScript y sus tipos |
| 4 | `npx tsc --init` | Crea `tsconfig.json` |
| 5 | `npm install -D tsx` | Ejecutar TypeScript en desarrollo |
| 6 | `npx prisma init` | Crea `prisma/`, `.env` y `prisma.config.ts` |
| 7 | `npx prisma migrate dev --name init` | Primera migración (tabla `User`) |
| 8 | `npm install -D @types/jsonwebtoken` | Tipos de JWT |
| 9 | `npm install multer xlsx` | Recibir y leer archivos Excel |
| 10 | `npm install -D @types/multer` | Tipos de multer |
| 11 | `npm install socket.io` | Notificaciones en tiempo real |
| 12 | `npm install -D socket.io-client` | Probar Socket.IO desde el backend |
| 13 | `npm install prisma@6 @prisma/client@6` | Volver a Prisma 6 por incompatibilidad con la versión 7 |

Después de crear el proyecto se cambió `"type"` a `"module"` en `package.json` y se agregó el script `dev`.