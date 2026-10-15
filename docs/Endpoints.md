# Endpoints del backend

Documentación de todas las rutas que existen actualmente en el backend de PrestApp. Cada respuesta corresponde a lo que el código devuelve hoy.

---

# Información general

## URL base

Todas las rutas empiezan con `/api`:

```txt
http://localhost:4000/api
```

## Autenticación

Las rutas marcadas con 🔒 necesitan el token que entrega el login, enviado en el encabezado:

```http
Authorization: Bearer TOKEN
```

El token dura **1 día**. Después hay que iniciar sesión de nuevo.

## Formato de las respuestas

Todas las respuestas son JSON e incluyen un campo `message`.

| Código | Significado |
|---|---|
| `200` | Operación exitosa |
| `201` | Registro creado |
| `400` | Datos inválidos o incompletos, o una regla del negocio no se cumple |
| `401` | No hay sesión o el token no es válido |
| `403` | El usuario no tiene el rol necesario |
| `404` | El registro no existe |
| `500` | Error inesperado del servidor |

## Respuestas comunes de las rutas protegidas

Estas respuestas las devuelven los middlewares **antes** de llegar a cada ruta 🔒, por eso no se repiten en cada endpoint.

### Respuesta si no se envía el token — `401`

```json
{
  "message": "Acceso denegado. Token no proporcionado."
}
```

### Respuesta si el encabezado no tiene el formato `Bearer TOKEN` — `401`

```json
{
  "message": "Formato de token inválido."
}
```

### Respuesta si el token está vencido o alterado — `401`

```json
{
  "message": "Token inválido o expirado."
}
```

### Respuesta si el usuario no tiene el rol requerido — `403`

Por ejemplo, un `USER` intentando usar una ruta de `ADMIN`.

```json
{
  "message": "No tienes permisos para acceder a este recurso"
}
```

## Cómo probar en Postman

1. Hacer login con `POST /api/auth/login` y copiar el `token` de la respuesta.
2. En la petición protegida, ir a la pestaña **Authorization**, elegir **Bearer Token** y pegar el token.
3. Para enviar JSON: pestaña **Body** → **raw** → **JSON**.

---

# Índice

| Módulo | Método | Ruta | Acceso |
|---|---|---|---|
| [General](#general) | GET | `/api/health` | Público |
| [Autenticación](#autenticación) | POST | `/api/auth/register` | Público |
| | POST | `/api/auth/login` | Público |
| | PATCH | `/api/auth/password` | 🔒 USER, ADMIN |
| [Perfil](#perfil) | GET | `/api/profile` | 🔒 USER, ADMIN |
| [Usuarios](#usuarios) | GET | `/api/users` | 🔒 ADMIN |
| | PATCH | `/api/users/:id/role` | 🔒 ADMIN |
| | PATCH | `/api/users/:id/password` | 🔒 ADMIN |
| | POST | `/api/users/bulk` | 🔒 ADMIN |
| [Notificaciones](#notificaciones) | GET | `/api/notifications` | 🔒 USER, ADMIN |
| | GET | `/api/notifications/unread-count` | 🔒 USER, ADMIN |
| | PATCH | `/api/notifications/read-all` | 🔒 USER, ADMIN |
| | PATCH | `/api/notifications/:id/read` | 🔒 USER, ADMIN |
| [Clientes](#clientes) | GET | `/api/clients` | 🔒 USER, ADMIN |
| | GET | `/api/clients/:id` | 🔒 USER, ADMIN |
| | POST | `/api/clients` | 🔒 USER, ADMIN |
| | PUT | `/api/clients/:id` | 🔒 USER, ADMIN |
| | PATCH | `/api/clients/:id/status` | 🔒 USER, ADMIN |
| [Catálogos](#catálogos) | GET | `/api/common/identification-types` | 🔒 USER, ADMIN |

---

# General

| Método | Ruta | Descripción |
|---|---|---|
| GET | `/api/health` | Verifica que el servidor responde |

## Verificar el servidor

### Endpoint

```http
GET /api/health
```

### Acceso permitido

* Público

### Descripción

Permite comprobar que el backend está encendido y respondiendo. Útil después de instalar el proyecto o de iniciar el servidor.

### Respuesta exitosa — `200`

```json
{
  "message": "API funcionando correctamente"
}
```

---

# Autenticación

| Método | Ruta | Descripción | Acceso |
|---|---|---|---|
| POST | `/api/auth/register` | Registra un usuario nuevo | Público |
| POST | `/api/auth/login` | Inicia sesión y entrega el token | Público |
| PATCH | `/api/auth/password` | Cambia la contraseña del usuario autenticado | 🔒 USER, ADMIN |

## Registrar usuario

### Endpoint

```http
POST /api/auth/register
```

### Acceso permitido

* Público

### Descripción

Registra un usuario nuevo. Todos los usuarios creados por esta ruta quedan con rol `USER`; el rol `ADMIN` solo lo asigna otro administrador.

Funciones implementadas:

* Limpieza y normalización de datos.
* Validación de campos obligatorios.
* Validación del nombre.
* Validación del formato del correo electrónico.
* Validación de la longitud mínima de la contraseña.
* Verificación de que el correo no esté registrado.
* Encriptación de la contraseña con bcrypt.
* La contraseña nunca se devuelve en la respuesta.

### Campos del body

| Campo | Tipo | Obligatorio | Descripción |
|---|---|---|---|
| `name` | string | Sí | Nombre completo |
| `email` | string | Sí | Correo para iniciar sesión |
| `password` | string | Sí | Contraseña |

### Body

```json
{
  "name": "Juan Pérez",
  "email": "juan@gmail.com",
  "password": "123456"
}
```

### Validaciones implementadas

#### Nombre

* Es obligatorio.
* Solo permite letras, espacios, tildes y la letra ñ.
* Debe tener mínimo 3 caracteres.
* Se eliminan los espacios al inicio y al final.

#### Correo electrónico

* Es obligatorio.
* Debe tener un formato válido.
* Se convierte a minúsculas.
* Se eliminan los espacios al inicio y al final.
* No puede estar registrado previamente.

#### Contraseña

* Es obligatoria.
* Debe tener mínimo 6 caracteres.
* Se eliminan los espacios al inicio y al final.
* Se almacena encriptada con bcrypt.

### Respuesta exitosa — `201`

```json
{
  "message": "Usuario registrado correctamente",
  "user": {
    "id": 1,
    "name": "Juan Pérez",
    "email": "juan@gmail.com",
    "role": "USER",
    "createdAt": "2026-10-13T14:00:00.000Z",
    "updatedAt": "2026-10-13T14:00:00.000Z"
  }
}
```

### Respuesta si faltan campos — `400`

```json
{
  "message": "Todos los campos son obligatorios"
}
```

### Respuesta si el nombre contiene caracteres inválidos — `400`

```json
{
  "message": "El nombre solo puede contener letras"
}
```

### Respuesta si el nombre tiene menos de 3 caracteres — `400`

```json
{
  "message": "El nombre debe tener mínimo 3 caracteres"
}
```

### Respuesta si el correo no tiene formato válido — `400`

```json
{
  "message": "El correo electrónico no tiene un formato válido"
}
```

### Respuesta si la contraseña tiene menos de 6 caracteres — `400`

```json
{
  "message": "La contraseña debe tener mínimo 6 caracteres"
}
```

### Respuesta si el usuario ya existe — `400`

```json
{
  "message": "El usuario ya existe"
}
```

### Respuesta en caso de error — `500`

```json
{
  "message": "Error al registrar usuario"
}
```

---

## Iniciar sesión

### Endpoint

```http
POST /api/auth/login
```

### Acceso permitido

* Público

### Descripción

Autentica a un usuario registrado y entrega un token JWT para usar en las rutas protegidas.

Funciones implementadas:

* Validación de campos obligatorios.
* Comparación segura de la contraseña con bcrypt.
* Generación del token JWT con `id`, `email` y `role`, válido por 1 día.
* El mismo mensaje para correo inexistente y contraseña incorrecta, para no revelar qué correos están registrados.
* La contraseña nunca se devuelve en la respuesta.

### Campos del body

| Campo | Tipo | Obligatorio | Descripción |
|---|---|---|---|
| `email` | string | Sí | Correo registrado |
| `password` | string | Sí | Contraseña |

### Body

```json
{
  "email": "juan@gmail.com",
  "password": "123456"
}
```

### Respuesta exitosa — `200`

```json
{
  "message": "Login exitoso",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "name": "Juan Pérez",
    "email": "juan@gmail.com",
    "role": "USER",
    "createdAt": "2026-10-13T14:00:00.000Z",
    "updatedAt": "2026-10-13T14:00:00.000Z"
  }
}
```

### Respuesta si faltan campos — `400`

```json
{
  "message": "Email y contraseña son obligatorios"
}
```

### Respuesta si el correo o la contraseña son incorrectos — `400`

```json
{
  "message": "Credenciales inválidas"
}
```

### Respuesta en caso de error — `500`

```json
{
  "message": "Error en el login"
}
```

### Observaciones

* El correo se busca tal como se escribe, sin convertirlo a minúsculas. Como el registro lo guarda en minúsculas, iniciar sesión con `Juan@Gmail.com` responde "Credenciales inválidas". Pendiente de corregir.

---

## Cambiar contraseña del usuario autenticado

### Endpoint

```http
PATCH /api/auth/password
```

### Header requerido

```http
Authorization: Bearer TOKEN
```

### Acceso permitido

* USER
* ADMIN

### Descripción

Permite que un usuario cambie **su propia** contraseña conociendo la actual. El usuario se identifica por el token, no por el body.

Funciones implementadas:

* Validación de campos obligatorios.
* Verificación de la contraseña actual.
* Validación de que la nueva contraseña sea diferente a la actual.
* Encriptación de la nueva contraseña con bcrypt.

### Campos del body

| Campo | Tipo | Obligatorio | Descripción |
|---|---|---|---|
| `currentPassword` | string | Sí | Contraseña actual |
| `newPassword` | string | Sí | Contraseña nueva |

### Body

```json
{
  "currentPassword": "123456",
  "newPassword": "nueva123"
}
```

### Validaciones implementadas

* Ambas contraseñas son obligatorias.
* Se eliminan los espacios al inicio y al final de ambas.
* La nueva contraseña debe tener mínimo 6 caracteres.
* La contraseña actual debe ser correcta.
* La nueva contraseña debe ser diferente a la actual.

### Respuesta exitosa — `200`

```json
{
  "message": "Contraseña actualizada correctamente"
}
```

### Respuesta si faltan campos — `400`

```json
{
  "message": "La contraseña actual y la nueva contraseña son obligatorias"
}
```

### Respuesta si la nueva contraseña tiene menos de 6 caracteres — `400`

```json
{
  "message": "La nueva contraseña debe tener mínimo 6 caracteres"
}
```

### Respuesta si la contraseña actual es incorrecta — `400`

```json
{
  "message": "La contraseña actual es incorrecta"
}
```

### Respuesta si la nueva contraseña es igual a la actual — `400`

```json
{
  "message": "La nueva contraseña debe ser diferente a la contraseña actual"
}
```

### Respuesta si el usuario del token ya no existe — `400`

```json
{
  "message": "El usuario no existe"
}
```

### Respuesta en caso de error — `500`

```json
{
  "message": "Error al cambiar la contraseña"
}
```

---

# Perfil

| Método | Ruta | Descripción | Acceso |
|---|---|---|---|
| GET | `/api/profile` | Datos del usuario autenticado | 🔒 USER, ADMIN |

## Obtener perfil autenticado

### Endpoint

```http
GET /api/profile
```

### Header requerido

```http
Authorization: Bearer TOKEN
```

### Acceso permitido

* USER
* ADMIN

### Descripción

Devuelve los datos del usuario dueño del token. El frontend lo usa al abrir la aplicación para saber quién inició sesión y qué rol tiene.

### Respuesta exitosa — `200`

```json
{
  "message": "Perfil obtenido correctamente.",
  "user": {
    "id": 1,
    "name": "Juan Pérez",
    "email": "juan@gmail.com",
    "role": "USER",
    "createdAt": "2026-10-13T14:00:00.000Z",
    "updatedAt": "2026-10-13T14:00:00.000Z"
  }
}
```

### Respuesta si el usuario del token ya no existe — `404`

```json
{
  "message": "Usuario no encontrado."
}
```

### Respuesta en caso de error — `500`

```json
{
  "message": "Error al obtener el perfil."
}
```

---

# Usuarios

Administración de usuarios. **Todas las rutas de este módulo son solo para ADMIN.**

| Método | Ruta | Descripción | Acceso |
|---|---|---|---|
| GET | `/api/users` | Lista todos los usuarios | 🔒 ADMIN |
| PATCH | `/api/users/:id/role` | Cambia el rol de un usuario | 🔒 ADMIN |
| PATCH | `/api/users/:id/password` | Asigna una contraseña nueva a un usuario | 🔒 ADMIN |
| POST | `/api/users/bulk` | Registra usuarios desde un Excel | 🔒 ADMIN |

## Obtener usuarios

### Endpoint

```http
GET /api/users
```

### Header requerido

```http
Authorization: Bearer TOKEN_ADMIN
```

### Acceso permitido

* ADMIN

### Descripción

Devuelve todos los usuarios registrados, del más reciente al más antiguo. No incluye contraseñas.

### Respuesta exitosa — `200`

```json
{
  "message": "Usuarios obtenidos correctamente",
  "users": [
    {
      "id": 2,
      "name": "Ana Gómez",
      "email": "ana@gmail.com",
      "role": "USER"
    },
    {
      "id": 1,
      "name": "Juan Pérez",
      "email": "juan@gmail.com",
      "role": "ADMIN"
    }
  ]
}
```

### Respuesta en caso de error — `500`

```json
{
  "message": "Error al obtener los usuarios"
}
```

---

## Cambiar rol de usuario

### Endpoint

```http
PATCH /api/users/:id/role
```

### Ejemplo

```http
PATCH /api/users/2/role
```

### Header requerido

```http
Authorization: Bearer TOKEN_ADMIN
```

### Acceso permitido

* ADMIN

### Descripción

Cambia el rol de un usuario.

### Parámetros

| Parámetro | Tipo | Descripción |
|---|---|---|
| `id` | number | Id del usuario a modificar |

### Roles permitidos

```txt
USER
ADMIN
```

### Campos del body

| Campo | Tipo | Obligatorio | Descripción |
|---|---|---|---|
| `role` | string | Sí | `USER` o `ADMIN` |

### Body

```json
{
  "role": "ADMIN"
}
```

### Validaciones implementadas

* El `id` debe ser un número entero mayor a 0.
* El rol es obligatorio.
* El rol debe ser `USER` o `ADMIN`.
* El usuario debe existir.

### Respuesta exitosa — `200`

```json
{
  "message": "Rol del usuario actualizado correctamente",
  "user": {
    "id": 2,
    "name": "Ana Gómez",
    "email": "ana@gmail.com",
    "role": "ADMIN"
  }
}
```

### Respuesta si el id no es válido — `400`

```json
{
  "message": "El id del usuario no es válido"
}
```

### Respuesta si no se envía el rol — `400`

```json
{
  "message": "El rol es obligatorio"
}
```

### Respuesta si el rol no es válido — `400`

```json
{
  "message": "Rol no válido",
  "allowedRoles": ["USER", "ADMIN"]
}
```

### Respuesta si el usuario no existe — `404`

```json
{
  "message": "El usuario no existe"
}
```

### Respuesta en caso de error — `500`

```json
{
  "message": "Error al actualizar el rol del usuario"
}
```

---

## Restablecer contraseña de un usuario

### Endpoint

```http
PATCH /api/users/:id/password
```

### Ejemplo

```http
PATCH /api/users/2/password
```

### Header requerido

```http
Authorization: Bearer TOKEN_ADMIN
```

### Acceso permitido

* ADMIN

### Descripción

Permite que el administrador asigne una contraseña nueva a un usuario, por ejemplo cuando la olvidó. No necesita conocer la contraseña actual del usuario.

### Parámetros

| Parámetro | Tipo | Descripción |
|---|---|---|
| `id` | number | Id del usuario |

### Campos del body

| Campo | Tipo | Obligatorio | Descripción |
|---|---|---|---|
| `newPassword` | string | Sí | Contraseña nueva |

### Body

```json
{
  "newPassword": "temporal123"
}
```

### Validaciones implementadas

* El `id` debe ser un número entero mayor a 0.
* La nueva contraseña es obligatoria.
* Debe tener mínimo 6 caracteres.
* Debe ser diferente a la contraseña actual del usuario.
* Se almacena encriptada con bcrypt.

### Respuesta exitosa — `200`

```json
{
  "message": "Contraseña del usuario actualizada correctamente",
  "user": {
    "id": 2,
    "name": "Ana Gómez",
    "email": "ana@gmail.com",
    "role": "USER"
  }
}
```

### Respuesta si el id no es válido — `400`

```json
{
  "message": "El id del usuario no es válido"
}
```

### Respuesta si no se envía la nueva contraseña — `400`

```json
{
  "message": "La nueva contraseña es obligatoria"
}
```

### Respuesta si la nueva contraseña tiene menos de 6 caracteres — `400`

```json
{
  "message": "La nueva contraseña debe tener mínimo 6 caracteres"
}
```

### Respuesta si la nueva contraseña es igual a la actual — `400`

```json
{
  "message": "La nueva contraseña debe ser diferente a la contraseña actual"
}
```

### Respuesta si el usuario no existe — `404`

```json
{
  "message": "El usuario no existe"
}
```

### Respuesta en caso de error — `500`

```json
{
  "message": "Error al actualizar la contraseña del usuario"
}
```

---

## Carga masiva de usuarios

### Endpoint

```http
POST /api/users/bulk
```

### Header requerido

```http
Authorization: Bearer TOKEN_ADMIN
```

### Acceso permitido

* ADMIN

### Descripción

Registra varios usuarios a partir de un archivo Excel. El administrador define el rol de cada usuario en la columna `rol`.

**Funciona como todo o nada:** primero se valida el archivo completo. Si alguna fila tiene un error, **no se registra ningún usuario** y la respuesta indica qué filas corregir. Solo cuando todas las filas son válidas se crean todos los usuarios en una sola operación.

### Tipo de envío requerido

Este endpoint no recibe JSON. Se envía como:

```txt
multipart/form-data
```

### Campo requerido

| Campo | Tipo | Obligatorio | Descripción |
|---|---|---|---|
| `file` | File | Sí | Archivo Excel con los usuarios a registrar |

### Formato del archivo Excel

* Extensión `.xlsx` o `.xls`, máximo **2 MB**.
* Se lee únicamente la **primera hoja**.
* La primera fila debe tener los encabezados:

```txt
nombre | correo | contraseña | rol
```

#### Ejemplo

| nombre | correo | contraseña | rol |
|---|---|---|---|
| Ana Gómez | ana@gmail.com | 123456 | USER |
| José Peña | jose@gmail.com | 123456 | ADMIN |

La aplicación tiene un botón para descargar esta plantilla desde la pantalla de usuarios.

### Ejemplo en Postman

```txt
Método: POST
URL: http://localhost:4000/api/users/bulk
Authorization: Bearer Token → TOKEN_ADMIN
Body: form-data
Key: file
Type: File
Value: usuarios.xlsx
```

### Validaciones implementadas

#### Archivo

* Es obligatorio.
* Debe ser `.xlsx` o `.xls` y pesar máximo 2 MB.
* Debe contener al menos una hoja.
* Debe tener encabezados y las columnas `nombre`, `correo`, `contraseña` y `rol`.
* Debe contener al menos una fila de usuario.

#### Nombre

* Es obligatorio.
* Solo permite letras, espacios, tildes y la letra ñ.
* Debe tener mínimo 3 caracteres.
* Se eliminan los espacios al inicio y al final.

#### Correo electrónico

* Es obligatorio.
* Debe tener un formato válido.
* Se convierte a minúsculas y se eliminan los espacios al inicio y al final.
* No puede estar repetido dentro del archivo.
* No puede estar registrado previamente en la base de datos.

#### Contraseña

* Es obligatoria.
* Debe tener mínimo 6 caracteres.
* Se almacena encriptada con bcrypt.

#### Rol

* Es obligatorio.
* Se convierte a mayúsculas (`user` se acepta como `USER`).
* Debe ser `USER` o `ADMIN`.

#### Número de fila

El campo `row` de los errores corresponde a la fila del Excel: la fila 1 son los encabezados, así que el primer usuario es la fila 2.

### Respuesta exitosa — `201`

```json
{
  "message": "Carga masiva procesada correctamente",
  "result": {
    "totalRows": 2,
    "totalCreated": 2,
    "totalRowsWithErrors": 0,
    "totalErrors": 0,
    "createdUsers": [
      {
        "id": 3,
        "name": "Ana Gómez",
        "email": "ana@gmail.com",
        "role": "USER"
      },
      {
        "id": 4,
        "name": "José Peña",
        "email": "jose@gmail.com",
        "role": "ADMIN"
      }
    ],
    "errors": [],
    "message": "Todos los usuarios fueron registrados correctamente."
  }
}
```

### Respuesta si alguna fila tiene errores — `201`

La petición se procesó, pero **no se creó ningún usuario**. Los errores vienen en `result.errors`, agrupados por fila.

```json
{
  "message": "Carga masiva procesada correctamente",
  "result": {
    "totalRows": 2,
    "totalCreated": 0,
    "totalRowsWithErrors": 1,
    "totalErrors": 2,
    "createdUsers": [],
    "errors": [
      {
        "row": 3,
        "totalErrors": 2,
        "errors": [
          {
            "column": "nombre",
            "message": "El nombre debe tener mínimo 3 caracteres"
          },
          {
            "column": "correo",
            "message": "El correo electrónico no tiene un formato válido"
          }
        ]
      }
    ],
    "message": "El archivo contiene errores. Corrige la información y vuelve a subirlo."
  }
}
```

#### Mensajes posibles por columna

| Columna | Mensaje |
|---|---|
| `nombre` | El nombre es obligatorio |
| `nombre` | El nombre solo puede contener letras |
| `nombre` | El nombre debe tener mínimo 3 caracteres |
| `correo` | El correo electrónico es obligatorio |
| `correo` | El correo electrónico no tiene un formato válido |
| `correo` | Correo duplicado dentro del archivo |
| `correo` | El usuario ya existe |
| `contraseña` | La contraseña es obligatoria |
| `contraseña` | La contraseña debe tener mínimo 6 caracteres |
| `rol` | El rol es obligatorio |
| `rol` | Rol no válido. Los roles permitidos son USER y ADMIN |

### Respuesta si no se envía archivo — `400`

```json
{
  "message": "Debe subir un archivo Excel"
}
```

### Respuesta si el archivo no contiene hojas — `400`

```json
{
  "message": "El archivo Excel no contiene hojas"
}
```

### Respuesta si no se puede leer la hoja — `400`

```json
{
  "message": "No se pudo leer la hoja del archivo Excel"
}
```

### Respuesta si el archivo no contiene encabezados — `400`

```json
{
  "message": "El archivo Excel no contiene encabezados"
}
```

### Respuesta si faltan columnas requeridas — `400`

El mensaje indica cuáles faltan. Ejemplo cuando falta `rol`:

```json
{
  "message": "El archivo Excel no tiene las columnas requeridas: rol. Las columnas obligatorias son: nombre, correo, contraseña y rol."
}
```

### Respuesta si el archivo no contiene usuarios — `400`

```json
{
  "message": "El archivo Excel no contiene usuarios para registrar"
}
```

### Respuesta si el archivo no es Excel o pesa más de 2 MB

Multer rechaza el archivo antes de llegar al controlador. Como el backend todavía no tiene un manejador de errores para este caso, la respuesta es un error `500` en formato **HTML**, no JSON. Pendiente de corregir.

### Respuesta en caso de error — `500`

```json
{
  "message": "Error al procesar la carga masiva de usuarios"
}
```

---

# Notificaciones

Cada usuario solo ve y modifica **sus propias** notificaciones. Además de estas rutas, las notificaciones nuevas llegan en tiempo real por Socket.IO con el evento `new_notification` (ver `Arquitectura.md`).

| Método | Ruta | Descripción | Acceso |
|---|---|---|---|
| GET | `/api/notifications` | Lista mis notificaciones | 🔒 USER, ADMIN |
| GET | `/api/notifications/unread-count` | Cuenta las no leídas | 🔒 USER, ADMIN |
| PATCH | `/api/notifications/read-all` | Marca todas como leídas | 🔒 USER, ADMIN |
| PATCH | `/api/notifications/:id/read` | Marca una como leída | 🔒 USER, ADMIN |

## Obtener notificaciones

### Endpoint

```http
GET /api/notifications
```

### Header requerido

```http
Authorization: Bearer TOKEN
```

### Acceso permitido

* USER
* ADMIN

### Descripción

Devuelve todas las notificaciones del usuario dueño del token, de la más reciente a la más antigua.

### Respuesta exitosa — `200`

```json
{
  "message": "Notificaciones obtenidas correctamente.",
  "notifications": [
    {
      "id": 5,
      "title": "Bienvenido",
      "message": "Tu cuenta fue activada.",
      "type": "GENERAL",
      "isRead": false,
      "userId": 1,
      "createdAt": "2026-10-13T14:00:00.000Z"
    }
  ]
}
```

### Respuesta en caso de error — `500`

```json
{
  "message": "Error al obtener las notificaciones."
}
```

---

## Obtener cantidad de notificaciones no leídas

### Endpoint

```http
GET /api/notifications/unread-count
```

### Header requerido

```http
Authorization: Bearer TOKEN
```

### Acceso permitido

* USER
* ADMIN

### Descripción

Devuelve cuántas notificaciones sin leer tiene el usuario. El frontend lo usa para el número que aparece sobre la campana.

### Respuesta exitosa — `200`

```json
{
  "message": "Cantidad de notificaciones no leídas obtenida correctamente.",
  "count": 3
}
```

### Respuesta en caso de error — `500`

```json
{
  "message": "Error al obtener la cantidad de notificaciones."
}
```

---

## Marcar todas las notificaciones como leídas

### Endpoint

```http
PATCH /api/notifications/read-all
```

### Header requerido

```http
Authorization: Bearer TOKEN
```

### Acceso permitido

* USER
* ADMIN

### Descripción

Marca como leídas todas las notificaciones pendientes del usuario. No necesita body.

### Respuesta exitosa — `200`

```json
{
  "message": "Todas las notificaciones fueron marcadas como leídas.",
  "updatedCount": 3
}
```

### Respuesta si no había notificaciones pendientes — `200`

```json
{
  "message": "No tienes notificaciones pendientes por leer.",
  "updatedCount": 0
}
```

### Respuesta en caso de error — `500`

```json
{
  "message": "Error al marcar las notificaciones como leídas."
}
```

---

## Marcar una notificación como leída

### Endpoint

```http
PATCH /api/notifications/:id/read
```

### Ejemplo

```http
PATCH /api/notifications/5/read
```

### Header requerido

```http
Authorization: Bearer TOKEN
```

### Acceso permitido

* USER
* ADMIN

### Descripción

Marca una notificación como leída. Solo funciona con notificaciones del usuario dueño del token. No necesita body.

### Parámetros

| Parámetro | Tipo | Descripción |
|---|---|---|
| `id` | number | Id de la notificación |

### Respuesta exitosa — `200`

```json
{
  "message": "Notificación marcada como leída."
}
```

### Respuesta si el id no es válido — `400`

```json
{
  "message": "El id de la notificación no es válido."
}
```

### Respuesta si no existe o pertenece a otro usuario — `404`

```json
{
  "message": "La notificación no existe."
}
```

### Respuesta en caso de error — `500`

```json
{
  "message": "Error al marcar la notificación como leída."
}
```

---

# Clientes

Cada usuario (USER o ADMIN) administra **solo sus propios** clientes: las personas a quienes les presta dinero. El usuario se identifica por el token; el `userId` nunca se envía en el body.

Los clientes **no se eliminan**: se desactivan, para conservar su historial cuando tengan préstamos.

| Método | Ruta | Descripción | Acceso |
|---|---|---|---|
| GET | `/api/clients` | Lista mis clientes, con búsqueda y filtro por estado | 🔒 USER, ADMIN |
| GET | `/api/clients/:id` | Obtiene un cliente | 🔒 USER, ADMIN |
| POST | `/api/clients` | Registra un cliente | 🔒 USER, ADMIN |
| PUT | `/api/clients/:id` | Actualiza los datos de un cliente | 🔒 USER, ADMIN |
| PATCH | `/api/clients/:id/status` | Activa o desactiva un cliente | 🔒 USER, ADMIN |

---

## Obtener clientes

### Endpoint

```http
GET /api/clients
```

### Ejemplos

```http
GET /api/clients
GET /api/clients?search=juan
GET /api/clients?status=active
GET /api/clients?search=300&status=inactive
```

### Header requerido

```http
Authorization: Bearer TOKEN
```

### Acceso permitido

* USER
* ADMIN

### Descripción

Devuelve los clientes del usuario dueño del token, ordenados por nombre de la A a la Z.

### Parámetros de consulta (opcionales)

| Parámetro | Tipo | Descripción |
|---|---|---|
| `search` | string | Busca en el nombre, el número de identificación, el teléfono y el teléfono secundario. No distingue mayúsculas. |
| `status` | string | `active`, `inactive` o `all`. Si no se envía, se usa `all`. |

### Respuesta exitosa — `200`

```json
{
  "message": "Clientes obtenidos correctamente",
  "clients": [
    {
      "id": 1,
      "identificationNumber": "1023456",
      "fullName": "Juan Pérez",
      "phone": "3001234567",
      "secondaryPhone": null,
      "address": "Cra 10 # 20-30",
      "neighborhood": "Centro",
      "notes": null,
      "isActive": true,
      "createdAt": "2026-10-15T14:00:00.000Z",
      "updatedAt": "2026-10-15T14:00:00.000Z",
      "identificationType": {
        "id": 1,
        "code": "CC",
        "name": "Cédula de ciudadanía"
      }
    }
  ]
}
```

Si el usuario no tiene clientes, o ninguno coincide con la búsqueda, `clients` es una lista vacía `[]`.

### Respuesta si el estado no es válido — `400`

```json
{
  "message": "El estado no es válido. Use active, inactive o all"
}
```

### Respuesta en caso de error — `400`

```json
{
  "message": "Error al obtener los clientes"
}
```

---

## Obtener un cliente

### Endpoint

```http
GET /api/clients/:id
```

### Ejemplo

```http
GET /api/clients/1
```

### Header requerido

```http
Authorization: Bearer TOKEN
```

### Acceso permitido

* USER
* ADMIN

### Descripción

Devuelve un cliente del usuario dueño del token, con su tipo de identificación.

### Parámetros

| Parámetro | Tipo | Descripción |
|---|---|---|
| `id` | number | Id del cliente |

### Respuesta exitosa — `200`

```json
{
  "message": "Cliente obtenido correctamente",
  "client": {
    "id": 1,
    "identificationNumber": "1023456",
    "fullName": "Juan Pérez",
    "phone": "3001234567",
    "secondaryPhone": null,
    "address": "Cra 10 # 20-30",
    "neighborhood": "Centro",
    "notes": null,
    "isActive": true,
    "createdAt": "2026-10-15T14:00:00.000Z",
    "updatedAt": "2026-10-15T14:00:00.000Z",
    "identificationType": {
      "id": 1,
      "code": "CC",
      "name": "Cédula de ciudadanía"
    }
  }
}
```

### Respuesta si el id no es válido — `400`

```json
{
  "message": "El id del cliente no es válido"
}
```

### Respuesta si el cliente no existe o es de otro usuario — `400`

```json
{
  "message": "El cliente no existe"
}
```

### Respuesta en caso de error — `400`

```json
{
  "message": "Error al obtener el cliente"
}
```

---

## Registrar cliente

### Endpoint

```http
POST /api/clients
```

### Header requerido

```http
Authorization: Bearer TOKEN
```

### Acceso permitido

* USER
* ADMIN

### Descripción

Registra un cliente nuevo para el usuario dueño del token. El cliente queda activo.

Funciones implementadas:

* Limpieza y normalización de datos antes de guardar.
* Validación de campos obligatorios y de formato.
* Verificación de que el tipo de identificación exista y esté activo.
* Verificación de que el usuario no tenga otro cliente con el mismo número de identificación.
* Dos usuarios distintos **sí** pueden registrar a la misma persona como cliente.

### Campos del body

| Campo | Tipo | Obligatorio | Descripción |
|---|---|---|---|
| `identificationTypeId` | number | Sí | Id del tipo de identificación (ver `/api/common/identification-types`) |
| `identificationNumber` | string | Sí | Número de documento |
| `fullName` | string | Sí | Nombre completo |
| `phone` | string | Sí | Teléfono principal |
| `secondaryPhone` | string | No | Teléfono de referencia |
| `address` | string | Sí | Dirección |
| `neighborhood` | string | Sí | Barrio |
| `notes` | string | No | Observaciones |

### Body

```json
{
  "identificationTypeId": 1,
  "identificationNumber": "1023456",
  "fullName": "Juan Pérez",
  "phone": "3001234567",
  "secondaryPhone": "3209998877",
  "address": "Cra 10 # 20-30",
  "neighborhood": "Centro",
  "notes": "Trabaja en la panadería de la esquina"
}
```

### Validaciones implementadas

#### Tipo de identificación

* Es obligatorio y debe ser un número entero mayor a 0.
* Debe existir y estar activo.

#### Número de identificación

* Es obligatorio.
* Se eliminan todos los espacios y se convierte a mayúsculas (`" 10 23 45ab "` se guarda como `102345AB`).
* Debe tener entre 5 y 20 caracteres, solo letras y números.
* El usuario no puede tener otro cliente con el mismo número.

#### Nombre completo

* Es obligatorio.
* Se eliminan los espacios al inicio y al final, y los espacios dobles.
* Debe tener entre 3 y 150 caracteres.
* Solo permite letras, espacios, tildes y la letra ñ.

#### Teléfono y teléfono secundario

* El teléfono es obligatorio; el secundario es opcional.
* Se eliminan todos los espacios (`"300 123 4567"` se guarda como `3001234567`).
* Solo números, entre 7 y 15 dígitos.
* El teléfono secundario no puede ser igual al principal.
* Si el secundario se envía vacío, se guarda como `null`.

#### Dirección y barrio

* Ambos son obligatorios.
* Se eliminan los espacios al inicio y al final, y los espacios dobles.
* La dirección admite máximo 200 caracteres y el barrio máximo 100.

#### Notas

* Son opcionales; si se envían vacías se guardan como `null`.
* Máximo 500 caracteres.

### Respuesta exitosa — `201`

```json
{
  "message": "Cliente registrado correctamente",
  "client": {
    "id": 1,
    "identificationNumber": "1023456",
    "fullName": "Juan Pérez",
    "phone": "3001234567",
    "secondaryPhone": "3209998877",
    "address": "Cra 10 # 20-30",
    "neighborhood": "Centro",
    "notes": "Trabaja en la panadería de la esquina",
    "isActive": true,
    "createdAt": "2026-10-15T14:00:00.000Z",
    "updatedAt": "2026-10-15T14:00:00.000Z",
    "identificationType": {
      "id": 1,
      "code": "CC",
      "name": "Cédula de ciudadanía"
    }
  }
}
```

### Respuestas de validación — `400`

Se revisan en este orden y se responde el **primer** error encontrado:

| Caso | Mensaje |
|---|---|
| Falta el tipo de identificación o no es un número válido | El tipo de identificación es obligatorio |
| Falta el número de identificación | El número de identificación es obligatorio |
| Número de identificación con formato inválido | El número de identificación debe tener entre 5 y 20 caracteres, solo letras y números |
| Falta el nombre | El nombre completo es obligatorio |
| Nombre muy corto o muy largo | El nombre completo debe tener entre 3 y 150 caracteres |
| Nombre con números o símbolos | El nombre completo solo puede contener letras y espacios |
| Falta el teléfono | El teléfono es obligatorio |
| Teléfono con formato inválido | El teléfono debe tener entre 7 y 15 dígitos, solo números |
| Teléfono secundario con formato inválido | El teléfono secundario debe tener entre 7 y 15 dígitos, solo números |
| Teléfono secundario igual al principal | El teléfono secundario no puede ser igual al teléfono principal |
| Falta la dirección | La dirección es obligatoria |
| Dirección muy larga | La dirección no puede tener más de 200 caracteres |
| Falta el barrio | El barrio es obligatorio |
| Barrio muy largo | El barrio no puede tener más de 100 caracteres |
| Notas muy largas | Las notas no pueden tener más de 500 caracteres |

Ejemplo:

```json
{
  "message": "El barrio es obligatorio"
}
```

### Respuesta si el tipo de identificación no existe o está inactivo — `400`

```json
{
  "message": "El tipo de identificación no existe o está inactivo"
}
```

### Respuesta si el documento ya está registrado — `400`

```json
{
  "message": "Ya tienes un cliente registrado con ese número de identificación"
}
```

### Respuesta en caso de error — `400`

```json
{
  "message": "Error al registrar el cliente"
}
```

---

## Actualizar cliente

### Endpoint

```http
PUT /api/clients/:id
```

### Ejemplo

```http
PUT /api/clients/1
```

### Header requerido

```http
Authorization: Bearer TOKEN
```

### Acceso permitido

* USER
* ADMIN

### Descripción

Reemplaza los datos de un cliente del usuario dueño del token. Se deben enviar **todos** los campos, igual que al registrar; los opcionales que no se envíen quedan en `null`.

Funciones implementadas:

* Las mismas validaciones y limpieza de datos que al registrar.
* Verificación de que el cliente exista y pertenezca al usuario.
* Al revisar el documento repetido, el cliente que se edita no se compara consigo mismo: se puede guardar sin cambiar su número de identificación.

### Parámetros

| Parámetro | Tipo | Descripción |
|---|---|---|
| `id` | number | Id del cliente |

### Campos del body

Los mismos de [Registrar cliente](#registrar-cliente).

### Body

```json
{
  "identificationTypeId": 1,
  "identificationNumber": "1023456",
  "fullName": "Juan Pérez",
  "phone": "3011112222",
  "secondaryPhone": "",
  "address": "Cra 10 # 20-30",
  "neighborhood": "Centro",
  "notes": ""
}
```

### Validaciones implementadas

* El `id` debe ser un número entero mayor a 0.
* El cliente debe existir y pertenecer al usuario.
* Las mismas reglas de [Registrar cliente](#registrar-cliente).

### Respuesta exitosa — `200`

```json
{
  "message": "Cliente actualizado correctamente",
  "client": {
    "id": 1,
    "identificationNumber": "1023456",
    "fullName": "Juan Pérez",
    "phone": "3011112222",
    "secondaryPhone": null,
    "address": "Cra 10 # 20-30",
    "neighborhood": "Centro",
    "notes": null,
    "isActive": true,
    "createdAt": "2026-10-15T14:00:00.000Z",
    "updatedAt": "2026-10-15T15:30:00.000Z",
    "identificationType": {
      "id": 1,
      "code": "CC",
      "name": "Cédula de ciudadanía"
    }
  }
}
```

### Respuesta si el id no es válido — `400`

```json
{
  "message": "El id del cliente no es válido"
}
```

### Respuestas de validación — `400`

Las mismas de [Registrar cliente](#respuestas-de-validación--400).

### Respuesta si el cliente no existe o es de otro usuario — `400`

```json
{
  "message": "El cliente no existe"
}
```

### Respuesta si el tipo de identificación no existe o está inactivo — `400`

```json
{
  "message": "El tipo de identificación no existe o está inactivo"
}
```

### Respuesta si el documento ya lo tiene otro cliente — `400`

```json
{
  "message": "Ya tienes un cliente registrado con ese número de identificación"
}
```

### Respuesta en caso de error — `400`

```json
{
  "message": "Error al actualizar el cliente"
}
```

---

## Activar o desactivar cliente

### Endpoint

```http
PATCH /api/clients/:id/status
```

### Ejemplo

```http
PATCH /api/clients/1/status
```

### Header requerido

```http
Authorization: Bearer TOKEN
```

### Acceso permitido

* USER
* ADMIN

### Descripción

Cambia el estado de un cliente del usuario dueño del token. Un cliente inactivo se conserva con todos sus datos; solo deja de aparecer al filtrar por `status=active`.

### Parámetros

| Parámetro | Tipo | Descripción |
|---|---|---|
| `id` | number | Id del cliente |

### Campos del body

| Campo | Tipo | Obligatorio | Descripción |
|---|---|---|---|
| `isActive` | boolean | Sí | `true` para activar, `false` para desactivar |

### Body

```json
{
  "isActive": false
}
```

### Validaciones implementadas

* El `id` debe ser un número entero mayor a 0.
* `isActive` es obligatorio y debe ser `true` o `false` (no se acepta el texto `"false"`).
* El cliente debe existir y pertenecer al usuario.

### Respuesta exitosa al desactivar — `200`

```json
{
  "message": "Cliente desactivado correctamente",
  "client": {
    "id": 1,
    "fullName": "Juan Pérez",
    "isActive": false,
    "...": "demás campos del cliente"
  }
}
```

### Respuesta exitosa al activar — `200`

```json
{
  "message": "Cliente activado correctamente",
  "client": {
    "id": 1,
    "fullName": "Juan Pérez",
    "isActive": true,
    "...": "demás campos del cliente"
  }
}
```

### Respuesta si el id no es válido — `400`

```json
{
  "message": "El id del cliente no es válido"
}
```

### Respuesta si `isActive` no es válido — `400`

```json
{
  "message": "El campo isActive es obligatorio y debe ser true o false"
}
```

### Respuesta si el cliente no existe o es de otro usuario — `400`

```json
{
  "message": "El cliente no existe"
}
```

### Respuesta en caso de error — `400`

```json
{
  "message": "Error al actualizar el estado del cliente"
}
```

---

# Catálogos

Listas de valores que usan los formularios.

| Método | Ruta | Descripción | Acceso |
|---|---|---|---|
| GET | `/api/common/identification-types` | Tipos de documento activos | 🔒 USER, ADMIN |

## Obtener tipos de identificación

### Endpoint

```http
GET /api/common/identification-types
```

### Header requerido

```http
Authorization: Bearer TOKEN
```

### Acceso permitido

* USER
* ADMIN

### Descripción

Devuelve los tipos de documento **activos**, ordenados por nombre. Se usa para llenar listas desplegables, por ejemplo en el registro de clientes.

### Respuesta exitosa — `200`

```json
{
  "message": "Tipos de identificación obtenidos correctamente",
  "identificationTypes": [
    {
      "id": 1,
      "code": "CC",
      "name": "Cédula de ciudadanía"
    },
    {
      "id": 2,
      "code": "CE",
      "name": "Cédula de extranjería"
    }
  ]
}
```

### Respuesta en caso de error — `500`

```json
{
  "message": "Error al obtener los tipos de identificación"
}
```

---

# Plantilla para documentar un endpoint nuevo

1. Agregar la ruta al **Índice**.
2. Agregarla a la tabla de su módulo. Si el módulo es nuevo, crear su sección `#` con una tabla.
3. Copiar este bloque debajo de la tabla del módulo y completarlo con lo que **realmente** responde el código.

````markdown
## Nombre de la acción

### Endpoint

```http
MÉTODO /api/ruta
```

### Header requerido

```http
Authorization: Bearer TOKEN
```

### Acceso permitido

* USER
* ADMIN

### Descripción

Qué hace y para qué se usa.

### Parámetros

| Parámetro | Tipo | Descripción |
|---|---|---|
| `id` | number | … |

### Campos del body

| Campo | Tipo | Obligatorio | Descripción |
|---|---|---|---|
| `campo` | string | Sí | … |

### Body

```json
{ }
```

### Validaciones implementadas

* …

### Respuesta exitosa — `200`

```json
{ }
```

### Respuesta si … — `400`

```json
{
  "message": "…"
}
```

### Respuesta en caso de error — `500`

```json
{
  "message": "…"
}
```
````