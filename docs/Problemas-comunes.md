# Historial de incidentes del backend

## Descripción

Este documento registra los errores que se han presentado en el backend, su causa y cómo se resolvieron. Sirve para no repetir errores y para resolver rápido si vuelven a aparecer, por ejemplo al clonar el proyecto en otro equipo.

También incluye los **problemas conocidos pendientes**: fallas detectadas que todavía no se han corregido.

---

# Índice

| # | Incidente | Fecha | Estado |
|---|---|---|---|
| 001 | [Error al ejecutar TSX](#incidente-001--error-al-ejecutar-tsx) | 2026-05-08 | ✅ Resuelto |
| 002 | [Error Prisma Client Runtime](#incidente-002--error-prisma-client-runtime) | 2026-05-08 | ✅ Resuelto |
| 003 | [Migración bloqueada al quitar un valor de un enum](#incidente-003--migración-bloqueada-al-quitar-un-valor-de-un-enum) | 2026-10-08 | ✅ Resuelto |
| 004 | [Errores de TypeScript después de eliminar el módulo PQR](#incidente-004--errores-de-typescript-después-de-eliminar-el-módulo-pqr) | 2026-10-08 | ✅ Resuelto |

| Problemas conocidos pendientes |
|---|
| [P-01 El login distingue mayúsculas en el correo](#p-01--el-login-distingue-mayúsculas-en-el-correo) |
| [P-02 Carga masiva responde HTML si el archivo no es Excel](#p-02--carga-masiva-responde-html-si-el-archivo-no-es-excel) |
| [P-03 El servicio de notificaciones todavía usa pqrId](#p-03--el-servicio-de-notificaciones-todavía-usa-pqrid) |

---

# Incidente #001 — Error al ejecutar TSX

## Fecha

2026-05-08

## Descripción del incidente

Al ejecutar el backend se presentó un error con el comando `tsx` que impedía iniciar el servidor en modo desarrollo.

## Error presentado

```txt
"tsx" no se reconoce como un comando interno o externo,
programa o archivo por lotes ejecutable.
```

## Causa identificada

El paquete `tsx` no estaba instalado en las dependencias de desarrollo del proyecto.

## Solución aplicada

```bash
npm install -D tsx
```

### Resultado de la instalación

```txt
added 5 packages, and audited 254 packages in 6s
```

## Validación realizada

```bash
npm run dev
```

El servidor inició correctamente.

## Resultado final

- Ejecución correcta del servidor backend.
- Reinicio automático habilitado mediante `tsx watch`.
- Ejecución directa de archivos TypeScript.

## Observaciones

Después de clonar el proyecto o actualizar dependencias, verificar que `npm install` termine sin errores; así se instalan también las dependencias de desarrollo.

---

# Incidente #002 — Error Prisma Client Runtime

## Fecha

2026-05-08

## Descripción del incidente

Al iniciar el backend se presentó un error de Prisma Client que impedía levantar el servidor.

## Error presentado

```txt
Error: Cannot find module
'@prisma/client/runtime/library.js'
```

## Causa identificada

El cliente de Prisma no estaba generado correctamente debido a:

- Incompatibilidad con Prisma v7.
- Archivos dañados dentro de `node_modules`.
- Prisma Client no generado después de la instalación.
- Configuración del datasource en `schema.prisma` no compatible con la versión 7.

## Solución aplicada

### 1. Desinstalar Prisma

```bash
npm uninstall prisma @prisma/client
```

### 2. Limpiar dependencias

```powershell
Remove-Item -Recurse -Force node_modules
Remove-Item package-lock.json
```

### 3. Instalar Prisma v6

```bash
npm install prisma@6 @prisma/client@6
```

### 4. Generar el cliente

```bash
npx prisma generate
```

### Resultado obtenido

```txt
✔ Generated Prisma Client
```

## Validación realizada

```bash
npm run dev
```

El servidor inició y las APIs respondieron correctamente.

## Resultado final

- Prisma Client generado correctamente.
- Conexión funcional con MySQL.
- Backend sin errores de ejecución.

## Observaciones

Prisma v7 trae cambios importantes en la configuración del datasource. Se recomienda:

- Mantener **Prisma v6** en este proyecto.
- Ejecutar `npx prisma generate` después de cada `npm install`.
- Usar la combinación:

```txt
Node.js v20 LTS
Prisma v6
```

---

# Incidente #003 — Migración bloqueada al quitar un valor de un enum

## Fecha

2026-10-08

## Descripción del incidente

Al eliminar el módulo PQR se quitó el valor `AGENT` del enum `Role` en `schema.prisma`. Prisma advirtió que la migración podía fallar si había usuarios con ese rol.

## Error presentado

Advertencia al ejecutar `npx prisma migrate dev --name remove_pqr`:

```txt
⚠️  Warnings for the current datasource:

  • The values [AGENT] on the enum `User_role` will be removed.
    If these variants are still used in the database, this will fail.
```

## Causa identificada

MySQL no puede quitar un valor de un enum mientras alguna fila lo esté usando. Había usuarios con rol `AGENT` y notificaciones con tipos de PQR (`NEW_PQR`, `PQR_CLOSED`…) que también se iban a eliminar.

## Solución aplicada

### 1. Respaldo de la base de datos

Antes de una migración que borra tablas o valores, se hace un respaldo.

### 2. Actualizar las filas que usaban los valores eliminados

```sql
UPDATE User SET role = 'USER' WHERE role = 'AGENT';
DELETE FROM Notification;
```

### 3. Ejecutar la migración

```bash
npx prisma migrate dev --name remove_pqr
```

### Resultado obtenido

```txt
Applying migration `20261008211926_remove_pqr`
Your database is now in sync with your schema.
✔ Generated Prisma Client (v6.19.3)
```

## Resultado final

- Tablas de PQR eliminadas.
- Rol `AGENT` eliminado; los agentes quedaron como `USER`.
- Base de datos sincronizada con el nuevo `schema.prisma`.

## Observaciones

Antes de quitar un valor de un enum o borrar una columna, revisar qué filas lo usan y actualizarlas primero. Leer siempre las advertencias que muestra Prisma antes de confirmar la migración.

---

# Incidente #004 — Errores de TypeScript después de eliminar el módulo PQR

## Fecha

2026-10-08

## Descripción del incidente

Después de borrar las carpetas del módulo PQR, `npx tsc --noEmit` mostró 4 errores en archivos de usuarios que no tenían relación aparente con PQR.

## Error presentado

```txt
src/controllers/users/userBulk.controller.ts:16:18 - error TS2339:
Property 'file' does not exist on type 'Request<...>'.

src/routes/users/user.routes.ts:19:3 - error TS2305:
Module '"../../middlewares/index.js"' has no exported member 'uploadExcel'.

src/services/users/user.service.ts:66:24 - error TS2339:
Property 'AGENT' does not exist on type '{ USER: "USER"; ADMIN: "ADMIN"; }'.
```

## Causa identificada

- El middleware `uploadExcel`, usado por la carga masiva de usuarios, estaba definido **dentro** del archivo de adjuntos de PQR (`pqrAttachmentUpload.middleware.ts`) y se borró con él.
- TypeScript solo reconoce `req.file` cuando algún archivo del proyecto importa `multer`. Ese archivo era el único que lo hacía.
- La función `getAgentsService` (lista de agentes para asignar PQR) seguía usando `Role.AGENT`.

## Solución aplicada

### 1. Crear el middleware de Excel en su propio archivo

```txt
src/middlewares/uploads/excelUpload.middleware.ts
```

Y exportarlo en `src/middlewares/index.ts`:

```ts
export * from "./uploads/excelUpload.middleware.js";
```

### 2. Eliminar la lista de agentes

Se borraron `getAgentsService`, el controlador `getAgents` y la ruta `GET /api/users/agents`.

### 3. Quitar AGENT de las validaciones de texto

- `allowedRoles` en `user.controller.ts` quedó con `USER` y `ADMIN`.
- El mensaje de rol inválido en `userBulk.service.ts` quedó: "Los roles permitidos son USER y ADMIN".

## Validación realizada

```bash
npx tsc --noEmit
npm run dev
```

Sin errores y con el servidor funcionando.

## Resultado final

- Carga masiva de usuarios funcionando con su propio middleware.
- Ninguna referencia al rol `AGENT` en el código.

## Observaciones

Antes de borrar un archivo, revisar **qué exporta y quién lo usa**. Un archivo puede tener código de otros módulos aunque su nombre no lo indique.

---

# Problemas conocidos pendientes

Fallas detectadas al documentar el backend que todavía no se han corregido. Al resolver una, se pasa a la lista de incidentes con su número.

## P-01 — El login distingue mayúsculas en el correo

### Descripción

El registro guarda el correo en minúsculas, pero el login lo busca tal como se escribe.

### Cómo reproducirlo

1. Registrar un usuario con `juan@gmail.com`.
2. Iniciar sesión con `Juan@Gmail.com`.
3. Responde `400 — Credenciales inválidas`.

### Solución propuesta

En `loginUserService` (`auth.service.ts`), convertir el correo a minúsculas y quitar espacios antes de buscarlo, igual que en el registro.

---

## P-02 — Carga masiva responde HTML si el archivo no es Excel

### Descripción

Si en `POST /api/users/bulk` se envía un archivo que no es Excel o que pesa más de 2 MB, multer lo rechaza antes de llegar al controlador. Como no hay un manejador de errores, Express responde un error `500` en formato HTML en vez de un JSON con `message`.

### Solución propuesta

Crear un middleware de errores en `src/middlewares/errors/` que convierta los errores de multer en una respuesta `400` con `message`, y registrarlo al final de `app.ts`.

---

## P-03 — El servicio de notificaciones todavía usa pqrId

### Descripción

`notification.service.ts` envía `pqrId: data.pqrId ?? null` al crear notificaciones, y `notification.interface.ts` todavía declara `pqrId?: number`. La columna `pqrId` ya no existe en la base de datos.

TypeScript no lo detecta, pero **Prisma fallará** con `Unknown argument pqrId` la primera vez que se intente crear una notificación. Hoy no se nota porque ningún módulo crea notificaciones.

### Solución propuesta

Eliminar `pqrId` de las dos funciones de `notification.service.ts` y de la interfaz `CreateNotificationData`.

---

# Plantilla para un incidente nuevo

Agregar el incidente al **Índice** y copiar este bloque antes de "Problemas conocidos pendientes".

````markdown
# Incidente #00X — Título corto

## Fecha

AAAA-MM-DD

## Descripción del incidente

Qué estaba haciendo y qué pasó.

## Error presentado

```txt
Mensaje exacto del error
```

## Causa identificada

Por qué ocurrió.

## Solución aplicada

Pasos y comandos ejecutados.

## Validación realizada

Cómo se comprobó que quedó resuelto.

## Resultado final

- …

## Observaciones

Qué hacer para que no vuelva a pasar.
````