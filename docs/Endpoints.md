# Endpoints funcionales

Actualmente el backend cuenta con endpoints funcionales para validación, autenticación, manejo seguro de usuarios mediante JWT, administración de PQR y consulta del historial de mensajes del chat.

---

## Health Check

```http
GET /api/health
```

### Descripción

Endpoint utilizado para verificar el correcto funcionamiento de la API.

---

### Respuesta exitosa

```json
{
  "message": "API funcionando correctamente"
}
```

---

# Registrar usuario

## Endpoint

```http
POST /api/auth/register
```

## Descripción

Endpoint encargado del registro de nuevos usuarios.

Funciones implementadas:

* Limpieza y normalización de datos.
* Validación de campos obligatorios.
* Validación de nombre.
* Validación de formato de correo electrónico.
* Validación de longitud mínima de contraseña.
* Verificación de email existente.
* Encriptación segura de contraseña con bcrypt.
* Registro en MySQL mediante Prisma.
* Protección de contraseña en respuestas.

---

## Validaciones implementadas

### Nombre

* Es obligatorio.
* Solo permite letras.
* Debe tener mínimo 3 caracteres.
* Se eliminan espacios innecesarios.

### Correo electrónico

* Es obligatorio.
* Debe tener un formato válido.
* Se convierte automáticamente a minúsculas.
* Se eliminan espacios innecesarios.
* No puede estar registrado previamente.

### Contraseña

* Es obligatoria.
* Debe tener mínimo 6 caracteres.
* Se eliminan espacios innecesarios.
* Se almacena encriptada mediante bcrypt.

---

## Body

```json
{
  "name": "Juan",
  "email": "juan@gmail.com",
  "password": "123456"
}
```

---

## Respuesta exitosa

```json
{
  "message": "Usuario registrado correctamente",
  "user": {
    "id": 1,
    "name": "Juan",
    "email": "juan@gmail.com",
    "role": "USER"
  }
}
```

---

## Respuesta si faltan campos

```json
{
  "message": "Todos los campos son obligatorios"
}
```

---

## Respuesta si el nombre contiene caracteres inválidos

```json
{
  "message": "El nombre solo puede contener letras"
}
```

---

## Respuesta si el nombre tiene menos de 3 caracteres

```json
{
  "message": "El nombre debe tener mínimo 3 caracteres"
}
```

---

## Respuesta si el correo no tiene formato válido

```json
{
  "message": "El correo electrónico no tiene un formato válido"
}
```

---

## Respuesta si la contraseña tiene menos de 6 caracteres

```json
{
  "message": "La contraseña debe tener mínimo 6 caracteres"
}
```

---

## Respuesta si el usuario ya existe

```json
{
  "message": "El usuario ya existe"
}
```

---

## Respuesta en caso de error

```json
{
  "message": "Error al registrar usuario"
}
```

---

# Carga masiva de usuarios

## Endpoint

```http
POST /api/auth/register/bulk
```

## Descripción

Endpoint encargado de registrar usuarios mediante carga masiva desde un archivo Excel.

Esta funcionalidad permite subir un archivo con varios usuarios y procesarlos de forma automática. El sistema lee el archivo, valida la información de cada fila y registra los usuarios en la base de datos.

En esta carga masiva, el administrador puede definir el rol de cada usuario mediante la columna `role`.

---

## Tipo de envío requerido

Este endpoint no recibe datos en formato JSON.

Debe enviarse mediante:

```txt
multipart/form-data
```

---

## Formato del archivo Excel

El archivo debe tener las siguientes columnas en la primera fila:

```txt
nombre | correo | contraseña | rol
```

### Ejemplo

| name       | email                                   | contraseña | rol   |
| ---------- | --------------------------------------- | ---------- | ----- |
| Juan Pérez | [juan@gmail.com](mailto:juan@gmail.com) | 123456     | USER  |
| Ana María  | [ana@gmail.com](mailto:ana@gmail.com)   | 123456     | AGENT |
| José Peña  | [jose@gmail.com](mailto:jose@gmail.com) | 123456     | ADMIN |

---

## Campo requerido

| Campo | Tipo | Obligatorio | Descripción                                |
| ----- | ---- | ----------- | ------------------------------------------ |
| file  | File | Sí          | Archivo Excel con los usuarios a registrar |

---

## Ejemplo en Postman

```txt
Método: POST
URL: http://localhost:4000/api/auth/register/bulk
Body: form-data
Key: file
Type: File
Value: usuarios.xlsx
```

---

## Validaciones implementadas

### Archivo

* El archivo es obligatorio.
* Debe ser un archivo Excel.
* Solo se permiten archivos con extensión `.xlsx` o `.xls`.
* Debe contener al menos una hoja.
* Debe contener usuarios para registrar.
* Debe tener las columnas requeridas: `nombre`, `correo`, `contraseña` y `rol`.

### Nombre

* Es obligatorio.
* Solo permite letras, espacios, tildes y la letra ñ.
* Debe tener mínimo 3 caracteres.
* Se eliminan espacios innecesarios al inicio y al final.

### Correo electrónico

* Es obligatorio.
* Debe tener un formato válido.
* Se convierte automáticamente a minúsculas.
* Se eliminan espacios innecesarios al inicio y al final.
* No puede estar repetido dentro del archivo.
* No puede estar registrado previamente en la base de datos.

### Rol

* Es obligatorio.
* Se convierte automáticamente a mayúsculas.
* Debe corresponder a uno de los roles permitidos.

Roles permitidos:

```txt
USER
ADMIN
AGENT
```

### Contraseña

* Es obligatoria.
* Debe tener mínimo 6 caracteres.
* Se almacena encriptada mediante bcrypt.

---

## Respuesta exitosa

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
        "id": 32,
        "name": "lolauno",
        "email": "louno@gmail.com",
        "role": "USER"
      },
      {
        "id": 31,
        "name": "pello",
        "email": "pellouno@gmail.com",
        "role": "AGENT"
      }
    ],
    "errors": [],
    "message": "Todos los usuarios fueron registrados correctamente."
  }
}
```

---

## Respuesta si no se envía archivo

```json
{
  "message": "Debe subir un archivo Excel"
}
```

---

## Respuesta si el tipo de archivo no es válido

```json
{
  "message": "Solo se permiten archivos Excel"
}
```

---

## Respuesta si el archivo no contiene encabezados

```json
{
  "message": "El archivo Excel no contiene encabezados"
}
```

## Respuesta si faltan columnas requeridas

```json
{
  "message": "El archivo Excel no tiene las columnas requeridas: role. Las columnas obligatorias son: name, email, password y role."
}
```

---
## Respuesta si el archivo no contiene hojas

```json
{
  "message": "El archivo Excel no contiene hojas"
}
```

## Respuesta si no se puede leer la hoja

```json
{
  "message": "No se pudo leer la hoja del archivo Excel"
}
```

## Respuesta si el archivo no contiene usuarios

```json
{
  "message": "El archivo Excel no contiene usuarios para registrar"
}
```

## Respuesta si una fila tiene campos incompletos

```json
{
  "row": 2,
  "email": "ana@gmail.com",
  "message": "Todos los campos son obligatorios"
}
```

## Respuesta si el nombre contiene caracteres inválidos

```json
{
"row": 3,
"totalErrors": 1,
"errors": [
  {
    "column": "name",
    "message": "El nombre solo puede contener letras"
  }
]
}
```

## Respuesta si el correo no tiene formato válido

```json
{
"row": 3,
"totalErrors": 1,
"errors": [
  {
    "column": "email",
    "message": "El correo electrónico no tiene un formato válido"
  }
]
}
```

## Respuesta si el rol no es válido

```json
{
"row": 3,
"totalErrors": 1,
"errors": [
  {
    "column": "role",
    "message": "Rol no válido. Los roles permitidos son USER, ADMIN y AGENT"
  }
]
}
```

## Respuesta si el correo está duplicado dentro del archivo

```json
{
"row": 3,
"totalErrors": 1,
"errors": [
  {
    "column": "email",
    "message": "Correo duplicado dentro del archivo"
  }
]
}
```

## Respuesta si el usuario ya existe

```json
{
"row": 3,
"totalErrors": 1,
"errors": [
  {
    "column": "email",
    "message": "El usuario ya existe"
  }
]
}
```

## Respuesta si la contraseña tiene menos de 6 caracteres

```json
{
"row": 3,
"totalErrors": 1,
"errors": [
  {
    "column": "password",
    "message": "La contraseña debe tener mínimo 6 caracteres"
  }
]
}
```

## Respuesta en caso de error

```json
{
  "message": "Error al procesar la carga masiva de usuarios"
}
```

---

# Obtener usuarios

## Endpoint protegido para ADMIN

```http
GET /api/users
```

## Descripción

Endpoint privado encargado de obtener todos los usuarios registrados en el sistema.

Esta ruta permite al administrador visualizar los usuarios existentes y sus roles actuales.

Por seguridad, la respuesta no debe incluir la contraseña del usuario.

---

## Header requerido

```http
Authorization: Bearer TOKEN_ADMIN
```

---

## Acceso permitido

* ADMIN

---

## Respuesta exitosa

```json
{
  "message": "Usuarios obtenidos correctamente",
  "users": [
    {
      "id": 1,
      "name": "Juan",
      "email": "juan@gmail.com",
      "role": "USER"
    }
  ]
}
```

---

## Respuesta token inválido

```json
{
  "message": "Token inválido o expirado."
}
```

---

## Respuesta en caso de error

```json
{
  "message": "Error al obtener los usuarios"
}
```

---

# Obtener agentes

## Endpoint protegido para ADMIN

```http
GET /api/users/agents
```

## Descripción

Endpoint privado encargado de obtener únicamente los usuarios con rol `AGENT`.

Esta ruta permite al administrador consultar la lista de agentes disponibles para asignar o reasignar una PQR.

---

## Header requerido

```http
Authorization: Bearer TOKEN_ADMIN
```

---

## Acceso permitido

* ADMIN

---

## Respuesta exitosa

```json
{
  "message": "Agentes obtenidos correctamente",
  "agents": [
    {
      "id": 5,
      "name": "Carlos Agente",
      "email": "carlos@gmail.com",
      "role": "AGENT"
    },
    {
      "id": 8,
      "name": "María Agente",
      "email": "maria@gmail.com",
      "role": "AGENT"
    }
  ]
}
```

---

## Respuesta token inválido

```json
{
  "message": "Token inválido o expirado."
}
```

---

## Respuesta si el usuario no es ADMIN

```json
{
  "message": "No tienes permisos para acceder a esta ruta"
}
```

---

## Respuesta en caso de error

```json
{
  "message": "Error al obtener los agentes"
}
```


---

# Cambiar rol de usuario

## Endpoint protegido para ADMIN

```http
PATCH /api/users/:id/role
```

## Ejemplo

```http
PATCH /api/users/2/role
```

## Descripción

Endpoint privado encargado de cambiar el rol de un usuario registrado en el sistema.

Esta ruta solo puede ser utilizada por usuarios autenticados con rol `ADMIN`.

Permite asignar roles según la función que tendrá cada usuario dentro del sistema.

---

## Header requerido

```http
Authorization: Bearer TOKEN_ADMIN
Content-Type: application/json
```

---

## Acceso permitido

* ADMIN

---

## Parámetros

| Parámetro | Tipo   | Descripción                                                 |
| --------- | ------ | ----------------------------------------------------------- |
| id        | number | Identificador del usuario al que se le desea cambiar el rol |

---

## Roles permitidos

```txt
USER
ADMIN
AGENT
```

---

## Body

```json
{
  "role": "AGENT"
}
```

---

## Respuesta exitosa

```json
{
  "message": "Rol del usuario actualizado correctamente",
  "user": {
    "id": 2,
    "name": "Carlos",
    "email": "carlos@gmail.com",
    "role": "AGENT"
  }
}
```

---

## Respuesta si el id no es válido

```json
{
  "message": "El id del usuario no es válido"
}
```

---

## Respuesta si no se envía el rol

```json
{
  "message": "El rol es obligatorio"
}
```

---

## Respuesta si el rol no es válido

```json
{
  "message": "Rol no válido",
  "allowedRoles": [
    "USER",
    "ADMIN",
    "AGENT"
  ]
}
```

---

## Respuesta si el usuario no existe

```json
{
  "message": "El usuario no existe"
}
```

---

## Respuesta en caso de error

```json
{
  "message": "Error al actualizar el rol del usuario"
}
```

---

# Login de usuario JWT

## Endpoint

```http
POST /api/users/login
```

## Descripción

Endpoint encargado de autenticar usuarios registrados mediante JWT.

Funciones implementadas:

* Validación de email.
* Validación de contraseña.
* Comparación segura con bcrypt.
* Generación de token JWT.
* Retorno del usuario autenticado.
* Protección de credenciales sensibles.

---

## Body

```json
{
  "email": "juan@gmail.com",
  "password": "123456"
}
```

---

## Respuesta exitosa

```json
{
  "message": "Login exitoso",
  "token": "JWT_TOKEN",
  "user": {
    "id": 1,
    "name": "Juan",
    "email": "juan@gmail.com",
    "role": "USER"
  }
}
```

---

## Respuesta credenciales inválidas

```json
{
  "message": "Credenciales inválidas"
}
```

---

## Respuesta en caso de error

```json
{
  "message": "Error al iniciar sesión"
}
```

---

# Perfil autenticado

## Endpoint protegido

```http
GET /api/profile
```

## Descripción

Endpoint privado encargado de obtener la información del usuario autenticado mediante token JWT.

La ruta utiliza middleware JWT para restringir el acceso únicamente a usuarios autenticados.

---

## Header requerido

```http
Authorization: Bearer TOKEN
```

---

## Respuesta exitosa

```json
{
  "message": "Perfil obtenido correctamente.",
  "user": {
    "id": 5,
    "name": "Marlon",
    "email": "marlon@gmail.com",
    "role": "USER"
  }
}
```

---

# Crear PQR

## Endpoint protegido

```http
POST /api/pqrs
```

## Descripción

Endpoint privado encargado de registrar una nueva PQR asociada al usuario autenticado.

Al crear una PQR, el sistema crea automáticamente un primer mensaje dentro del chat de la solicitud usando la descripción registrada por el usuario.

Si el usuario adjunta una imagen o documento al momento de crear la PQR, ese archivo queda asociado al primer mensaje del chat como evidencia inicial.

---

## Tipos de envío permitidos

Este endpoint puede recibir la información de dos formas:

```txt
application/json
multipart/form-data
```

Se usa `application/json` cuando la PQR se crea sin archivo.

Se usa `multipart/form-data` cuando la PQR se crea con una imagen o documento adjunto.

---

## Body sin archivo

```json
{
  "caseType": "SAP",
  "description": "Esta es una PQR creada desde Postman para probar el módulo."
}
```

---

## Body con archivo

Debe enviarse mediante:

```txt
multipart/form-data
```

| Campo       | Tipo | Obligatorio | Descripción                                       |
| ----------- | ---- | ----------- | ------------------------------------------------- |
| caseType    | Text | Sí          | Tipo de caso de la PQR                            |
| description | Text | Sí          | Descripción de la solicitud                       |
| file        | File | No          | Imagen o documento adjunto como evidencia inicial |

---

# Tipos de caso disponibles

```txt
SAP
BEAS
TERMINAL
CORREO
INTRANET
SOPORTE_EQUIPOS
SOPORTE_RED
MI_PORTAL_SAP
LEGALISAPP
NUEVAS_SOLICITUDES
```

---

## Archivos permitidos como evidencia inicial

Formatos permitidos:

```txt
JPG
JPEG
PNG
WEBP
PDF
```

Tipos MIME permitidos:

```txt
image/jpeg
image/png
image/webp
application/pdf
```

Tamaño máximo permitido:

```txt
5 MB
```

---

## Notificación automática

Cuando un usuario crea una nueva PQR, el sistema genera automáticamente una notificación para los usuarios con rol `ADMIN` y `AGENT`.

| Destinatario | Tipo    | Mensaje                                             |
| ------------ | ------- | --------------------------------------------------- |
| ADMIN        | NEW_PQR | Juan Pérez (juan@gmail.com) creó una nueva PQR #10. |
| AGENT        | NEW_PQR | Juan Pérez (juan@gmail.com) creó una nueva PQR #10. |

El usuario que crea la PQR no recibe esta notificación.

---

## Respuesta exitosa sin archivo

```json
{
  "message": "PQR creada correctamente",
  "pqr": {
    "id": 1,
    "caseType": "SAP",
    "description": "Esta es una PQR creada desde Postman para probar el módulo.",
    "status": "PENDIENTE",
    "createdAt": "2026-05-12T00:00:00.000Z",
    "updatedAt": "2026-05-12T00:00:00.000Z",
    "userId": 1,
    "assignedToId": null,
    "priority": null,
    "rating": null,
    "ratingComment": null,
    "ratedAt": null,
    "user": {
          "id": 1,
          "name": "goria",
          "email": "yulid@gmail.com",
          "role": "USER"
        }
  }
}
```

---

## Respuesta exitosa con archivo

```json
{
  "message": "PQR creada correctamente",
  "pqr": {
    "id": 1,
    "caseType": "SAP",
    "description": "Esta es una PQR creada desde Postman para probar el módulo.",
    "status": "PENDIENTE",
    "createdAt": "2026-05-12T00:00:00.000Z",
    "updatedAt": "2026-05-12T00:00:00.000Z",
    "userId": 1,
    "assignedToId": null,
    "priority": null,
    "rating": null,
    "ratingComment": null,
    "ratedAt": null,
    "user": {
          "id": 1,
          "name": "goria",
          "email": "yulid@gmail.com",
          "role": "USER"
        }
  }
}
```

---

## Respuesta si `caseType` y `description` no son enviados

```json
{
  "message": "El tipo de caso y la descripción son obligatorios"
}
```

---

## Respuesta si el `caseType` no es válido

```json
{
  "message": "Tipo de caso no válido",
  "allowedCaseTypes": [
    "SAP",
    "BEAS",
    "TERMINAL",
    "CORREO",
    "INTRANET",
    "SOPORTE_EQUIPOS",
    "SOPORTE_RED",
    "MI_PORTAL_SAP",
    "LEGALISAPP",
    "NUEVAS_SOLICITUDES",
  ]
}
```

---

## Respuesta si la descripción supera los 500 caracteres

```json
{
  "message": "La descripción no puede superar los 500 caracteres"
}
```

---

## Respuesta si el archivo no es válido

```json
{
  "message": "Solo se permiten imágenes JPG, PNG, WEBP o documentos PDF"
}
```

---

## Respuesta en caso de error

```json
{
  "message": "Error al crear la PQR"
}
```

---

# Obtener PQR del usuario autenticado

## Endpoint protegido

```http
GET /api/pqrs/my
```

## Descripción

Endpoint privado encargado de obtener las PQR registradas por el usuario autenticado.

---

## Header requerido

```http
Authorization: Bearer TOKEN
```

---

## Respuesta exitosa

```json
{
  "message": "PQR obtenidas correctamente",
  "pqrs": [
    {
      "id": 1,
      "caseType": "SAP",
      "description": "Esta es una PQR creada desde Postman para probar el módulo.",
      "status": "PENDIENTE",
      "createdAt": "2026-05-28T00:00:00.000Z",
      "updatedAt": "2026-05-28T00:00:00.000Z",
      "userId": 1,
      "unreadMessagesCount": 2
    }
  ]
}
```

---

# Obtener todas las PQR

## Endpoint protegido para ADMIN

```http
GET /api/pqrs
```

## Descripción

Endpoint privado encargado de obtener todas las PQR registradas en el sistema.

Esta ruta está protegida por autenticación JWT y validación de rol, por lo tanto, solo puede ser utilizada por usuarios con rol `ADMIN`.

---

## Header requerido

```http
Authorization: Bearer TOKEN_ADMIN
```

---

## Acceso permitido

* ADMIN

---

## Respuesta exitosa

```json
{
  "message": "Todas las PQR obtenidas correctamente",
  "pqrs": [
    {
      "id": 1,
      "caseType": "SAP",
      "description": "Esta es una PQR creada desde Postman.",
      "status": "PENDIENTE",
      "createdAt": "2026-05-28T00:00:00.000Z",
      "updatedAt": "2026-05-28T00:00:00.000Z",
      "userId": 1,
      "assignedToId": 2,
      "user": {
        "id": 1,
        "name": "Juan",
        "email": "juan@gmail.com",
        "role": "USER"
      },
      "assignedTo": {
        "id": 2,
        "name": "Agente María",
        "email": "agente@gmail.com",
        "role": "AGENT"
      }
    }
  ]
}
```

---

# Obtener PQR disponibles para AGENT

## Endpoint protegido para ADMIN / AGENT

```http
GET /api/pqrs/available
```

## Descripción

Endpoint privado encargado de obtener las PQR que aún no tienen responsable asignado.

Una PQR disponible debe cumplir con las siguientes condiciones:

* No tener responsable asignado.
* Tener el campo `assignedToId` en `null`.

---

## Header requerido

```http
Authorization: Bearer TOKEN_AGENT
```

---

## Acceso permitido

* ADMIN
* AGENT

---

## Respuesta exitosa

```json
{
  "message": "PQR disponibles obtenidas correctamente",
  "pqrs": [
    {
      "id": 1,
      "caseType": "SAP",
      "description": "No puedo ingresar al sistema.",
      "status": "PENDIENTE",
      "createdAt": "2026-05-28T00:00:00.000Z",
      "updatedAt": "2026-05-28T00:00:00.000Z",
      "userId": 3,
      "assignedToId": null,
      "user": {
        "id": 3,
        "name": "Juan",
        "email": "juan@gmail.com",
        "role": "USER"
      }
    }
  ]
}
```

---

# Tomar una PQR disponible

## Endpoint protegido para ADMIN / AGENT

```http
PATCH /api/pqrs/:id/take
```

## Ejemplo

```http
PATCH /api/pqrs/1/take
```

## Descripción

Endpoint privado encargado de permitir que un usuario con rol `AGENT` tome una PQR disponible para atenderla.

Cuando el agente toma una PQR, el sistema guarda el id del usuario autenticado en el campo `assignedToId`.

Este endpoint no requiere body, porque el usuario responsable se obtiene desde el token JWT.

---

## Header requerido

```http
Authorization: Bearer TOKEN_AGENT
```

---

## Acceso permitido

* ADMIN
* AGENT

---

## Notificación automática

Cuando un agente toma una PQR disponible, el sistema genera automáticamente dos notificaciones.

| Destinatario         | Tipo      | Mensaje                                                                                  |
| -------------------- | --------- | ---------------------------------------------------------------------------------------- |
| ADMIN                | PQR_TAKEN | Carlos Agente (carlos@gmail.com) tomó la PQR #10 creada por Juan Pérez (juan@gmail.com). |
| USER dueño de la PQR | PQR_TAKEN | Tu solicitud #10 ya fue tomada por un agente.                                            |

Tomar una PQR no cambia automáticamente el estado de la solicitud. Solo se actualiza el campo `assignedToId`.

---

## Respuesta exitosa

```json
{
  "message": "PQR tomada correctamente",
  "pqr": {
    "id": 1,
    "caseType": "SAP",
    "description": "No puedo ingresar al sistema.",
    "status": "PENDIENTE",
    "createdAt": "2026-05-28T00:00:00.000Z",
    "updatedAt": "2026-05-28T00:00:00.000Z",
    "userId": 3,
    "assignedToId": 5,
    "user": {
      "id": 3,
      "name": "Juan",
      "email": "juan@gmail.com",
      "role": "USER"
    },
    "assignedTo": {
      "id": 5,
      "name": "Carlos Agente",
      "email": "carlos@gmail.com",
      "role": "AGENT"
    }
  }
}
```

---

# Asignar o reasignar una PQR

## Endpoint protegido para ADMIN

```http
PATCH /api/pqrs/:id/assign
```

## Descripción

Endpoint privado encargado de permitir que un usuario con rol `ADMIN` asigne o reasigne una PQR a un agente específico.

Si la PQR no tiene agente asignado, el sistema la asigna por primera vez.

Si la PQR ya tiene un agente asignado, el sistema reemplaza el responsable anterior por el nuevo agente seleccionado.

---

## Header requerido

```http
Authorization: Bearer TOKEN_ADMIN
Content-Type: application/json
```

---

## Acceso permitido

* ADMIN

---

## Parámetros

| Parámetro | Tipo   | Descripción                             |
| --------- | ------ | --------------------------------------- |
| id        | number | Identificador de la PQR que se asignará |

---

## Body

```json
{
  "agentId": 5
}
```

---

## Campos del body

| Campo   | Tipo   | Obligatorio | Descripción                                  |
| ------- | ------ | ----------- | -------------------------------------------- |
| agentId | number | Sí          | Identificador del agente que recibirá la PQR |

---

## Notificación automática

Cuando un ADMIN asigna o reasigna una PQR, el sistema genera notificaciones según el caso.

### Asignación por primera vez

| Destinatario         | Tipo         | Mensaje                                       |
| -------------------- | ------------ | --------------------------------------------- |
| AGENT asignado       | PQR_ASSIGNED | Se te asignó la PQR #10.                      |
| USER dueño de la PQR | PQR_TAKEN    | Tu solicitud #10 ya fue tomada por un agente. |

### Reasignación a otro agente

| Destinatario   | Tipo           | Mensaje                           |
| -------------- | -------------- | --------------------------------- |
| Nuevo AGENT    | PQR_ASSIGNED   | Se te asignó la PQR #10.          |
| AGENT anterior | PQR_UNASSIGNED | Ya no tienes asignada la PQR #10. |

---

## Respuesta exitosa

```json
{
  "message": "Responsable de la PQR actualizado correctamente",
  "pqr": {
    "id": 1,
    "caseType": "SAP",
    "description": "No puedo ingresar al sistema.",
    "status": "PENDIENTE",
    "createdAt": "2026-05-28T00:00:00.000Z",
    "updatedAt": "2026-06-18T00:00:00.000Z",
    "userId": 3,
    "assignedToId": 5,
    "user": {
      "id": 3,
      "name": "Juan",
      "email": "juan@gmail.com",
      "role": "USER"
    },
    "assignedTo": {
      "id": 5,
      "name": "Carlos Agente",
      "email": "carlos@gmail.com",
      "role": "AGENT"
    }
  }
}
```

---

## Respuesta si el id de la PQR no es válido

```json
{
  "message": "El id de la PQR no es válido"
}
```

---

## Respuesta si no se envía el agente

```json
{
  "message": "El agente es obligatorio"
}
```

---

## Respuesta si el id del agente no es válido

```json
{
  "message": "El id del agente no es válido"
}
```

---

## Respuesta si la PQR no existe

```json
{
  "message": "La PQR no existe"
}
```

---

## Respuesta si el agente no existe

```json
{
  "message": "El agente no existe"
}
```

---

## Respuesta si el usuario seleccionado no es AGENT

```json
{
  "message": "El usuario seleccionado no tiene rol AGENT"
}
```

---

## Respuesta si la PQR está cerrada

```json
{
  "message": "No se puede asignar o reasignar una PQR cerrada"
}
```

---

# Desasignar una PQR

## Endpoint protegido para ADMIN

```http
PATCH /api/pqrs/:id/unassign
```

## Ejemplo

```http
PATCH /api/pqrs/1/unassign
```

## Descripción

Endpoint privado encargado de permitir que un usuario con rol `ADMIN` quite el agente asignado de una PQR.

Al desasignar una PQR, el campo `assignedToId` queda en `null`, por lo tanto la solicitud vuelve a quedar disponible para ser tomada o asignada nuevamente.

---

## Header requerido

```http
Authorization: Bearer TOKEN_ADMIN
```

---

## Acceso permitido

* ADMIN

---

## Parámetros

| Parámetro | Tipo   | Descripción                                |
| --------- | ------ | ------------------------------------------ |
| id        | number | Identificador de la PQR que se desasignará |

---

## Body

Este endpoint no requiere body.

---

## Notificación automática

Cuando un ADMIN desasigna una PQR, el sistema notifica al agente que fue retirado.

| Destinatario   | Tipo           | Mensaje                           |
| -------------- | -------------- | --------------------------------- |
| AGENT anterior | PQR_UNASSIGNED | Ya no tienes asignada la PQR #10. |

---

## Respuesta exitosa

```json
{
  "message": "PQR desasignada correctamente",
  "pqr": {
    "id": 1,
    "caseType": "SAP",
    "description": "No puedo ingresar al sistema.",
    "status": "PENDIENTE",
    "createdAt": "2026-05-28T00:00:00.000Z",
    "updatedAt": "2026-06-18T00:00:00.000Z",
    "userId": 3,
    "assignedToId": null,
    "user": {
      "id": 3,
      "name": "Juan",
      "email": "juan@gmail.com",
      "role": "USER"
    },
    "assignedTo": null
  }
}
```

---

## Respuesta si el id de la PQR no es válido

```json
{
  "message": "El id de la PQR no es válido"
}
```

---

## Respuesta si la PQR no existe

```json
{
  "message": "La PQR no existe"
}
```

---

## Respuesta si la PQR no tiene agente asignado

```json
{
  "message": "La PQR no tiene agente asignado"
}
```

---

## Respuesta si la PQR está cerrada

```json
{
  "message": "No se puede desasignar una PQR cerrada"
}
```


---

# Obtener PQR asignadas al AGENT autenticado

## Endpoint protegido para ADMIN / AGENT

```http
GET /api/pqrs/assigned/my
```

## Descripción

Endpoint privado encargado de obtener las PQR que fueron tomadas o asignadas al usuario autenticado.

Esta ruta permite que un usuario con rol `AGENT` consulte únicamente las PQR que tiene bajo su responsabilidad.

---

## Header requerido

```http
Authorization: Bearer TOKEN_AGENT
```

---

## Acceso permitido

* ADMIN
* AGENT

---

## Respuesta exitosa

```json
{
  "message": "PQR asignadas obtenidas correctamente",
  "pqrs": [
    {
      "id": 1,
      "caseType": "SAP",
      "description": "No puedo ingresar al sistema.",
      "status": "EN_PROCESO",
      "createdAt": "2026-05-28T00:00:00.000Z",
      "updatedAt": "2026-05-28T00:00:00.000Z",
      "userId": 3,
      "assignedToId": 5,
      "unreadMessagesCount": 1,
      "user": {
        "id": 3,
        "name": "Juan",
        "email": "juan@gmail.com",
        "role": "USER"
      },
      "assignedTo": {
        "id": 5,
        "name": "Carlos Agente",
        "email": "carlos@gmail.com",
        "role": "AGENT"
      }
    }
  ]
}
```

---

# Cambiar estado de una PQR

## Endpoint protegido para ADMIN / AGENT

```http
PATCH /api/pqrs/:id/status
```

## Ejemplo

```http
PATCH /api/pqrs/1/status
```

## Descripción

Endpoint privado encargado de cambiar el estado de una PQR existente.

Permite actualizar el seguimiento de una solicitud según el proceso de atención.

---

## Header requerido

```http
Authorization: Bearer TOKEN_ADMIN
Content-Type: application/json
```

---

## Acceso permitido

* ADMIN
* AGENT

---

## Parámetros

| Parámetro | Tipo   | Descripción                                     |
| --------- | ------ | ----------------------------------------------- |
| id        | number | Identificador de la PQR que se desea actualizar |

---

## Estados permitidos

- PENDIENTE
- EN_PROCESO
- CERRADA

---

## Body

```json
{
  "status": "EN_PROCESO"
}
```

---

## Notificación automática

Cuando una PQR cambia a estado `CERRADA`, el sistema genera automáticamente una notificación para el usuario dueño de la PQR.

| Destinatario         | Tipo       | Mensaje                                                                |
| -------------------- | ---------- | ---------------------------------------------------------------------- |
| USER dueño de la PQR | PQR_CLOSED | Tu solicitud #10 fue cerrada. Por favor califica la atención recibida. |

La notificación solo se genera cuando la PQR pasa a estado `CERRADA`.

Si la PQR ya estaba cerrada y se vuelve a enviar el mismo estado, no se debe crear una notificación repetida.

---

## Respuesta exitosa

```json
{
  "message": "Estado de la PQR actualizado correctamente",
  "pqr": {
    "id": 1,
    "caseType": "SAP",
    "description": "Esta es una PQR creada desde Postman.",
    "status": "EN_PROCESO",
    "createdAt": "2026-05-28T00:00:00.000Z",
    "updatedAt": "2026-05-28T00:00:00.000Z",
    "userId": 1
  }
}
```

---

## Respuesta si el id no es válido

```json
{
  "message": "El id de la PQR no es válido"
}
```

---

## Respuesta si no se envía estado

```json
{
  "message": "El estado es obligatorio"
}
```

---

## Respuesta si la PQR no existe

```json
{
  "message": "La PQR no existe"
}
```

---

## Respuesta si el estado no es válido

```json
{
  "message": "Estado no válido",
  "allowedStatus": [
    "PENDIENTE",
    "EN_PROCESO",
    "CERRADA"
  ]
}
```

---

# Cambiar prioridad de una PQR

## Endpoint protegido para ADMIN / AGENT

```http
PATCH /api/pqrs/:id/priority
```

## Ejemplo

```http
PATCH /api/pqrs/1/priority
```

## Descripción

Endpoint privado encargado de cambiar la prioridad de una PQR existente.

Esta ruta permite que un usuario con rol `ADMIN` o `AGENT` actualice la prioridad de una PQR, siempre que cumpla con las validaciones correspondientes.

---

## Header requerido

```http
Authorization: Bearer TOKEN_AGENT
Content-Type: application/json
```

---

## Acceso permitido

- ADMIN
- AGENT

---

## Parámetros

| Parámetro | Tipo   | Descripción                                                    |
| --------- | ------ | -------------------------------------------------------------- |
| id        | number | Identificador de la PQR a la que se desea cambiar la prioridad |

---

## Prioridades permitidas

- BAJA
- MEDIA
- ALTA
- URGENTE

---

## Body

```json
{
  "priority": "ALTA"
}
```

---

## Respuesta exitosa

```json
{
  "message": "Prioridad de la PQR actualizada correctamente",
  "pqr": {
    "id": 1,
    "caseType": "SAP",
    "description": "La plataforma presenta errores al cargar los reportes.",
    "status": "EN_PROCESO",
    "createdAt": "2026-05-28T00:00:00.000Z",
    "updatedAt": "2026-05-28T00:00:00.000Z",
    "userId": 2,
    "assignedToId": 3,
    "priority": "ALTA",
    "rating": null,
    "ratingComment": null,
    "ratedAt": null
  }
}
```

---

## Respuesta si el id no es válido

```json
{
  "message": "El id de la PQR no es válido"
}
```

---

## Respuesta si no se envía prioridad

```json
{
  "message": "La prioridad es obligatoria"
}
```

---

## Respuesta si la prioridad no es válida

```json
{
  "message": "Prioridad no válida",
  "allowedPriorities": [
    "BAJA",
    "MEDIA",
    "ALTA",
    "URGENTE"
  ]
}
```

---

## Respuesta si la PQR no existe

```json
{
  "message": "La PQR no existe"
}
```

---

## Respuesta si la PQR está cerrada

```json
{
  "message": "No se puede cambiar la prioridad de una PQR cerrada"
}
```

---

## Respuesta si el AGENT intenta cambiar una PQR no asignada a él

```json
{
  "message": "Solo puedes cambiar la prioridad de las PQR asignadas a ti"
}
```

---

## Respuesta en caso de error

```json
{
  "message": "Error al actualizar la prioridad de la PQR"
}
```

---

# Obtener historial de mensajes de una PQR

## Endpoint protegido

```http
GET /api/pqrs/:id/messages
```

## Descripción

Endpoint protegido encargado de obtener el historial de mensajes de una PQR.

Este endpoint se utiliza para cargar los mensajes anteriores cuando el usuario abre el detalle de una PQR.

Los mensajes pueden contener solo texto, solo archivos adjuntos o texto acompañado de un archivo.

---

## Header requerido

```http
Authorization: Bearer TOKEN
```

---

## Acceso permitido

* USER dueño de la PQR.
* AGENT asignado a la PQR.
* ADMIN según reglas del sistema.

---

## Parámetros

| Parámetro | Tipo   | Descripción             |
| --------- | ------ | ----------------------- |
| id        | number | Identificador de la PQR |

---

## Respuesta exitosa sin mensajes

```json
{
  "message": "Mensajes obtenidos correctamente",
  "messages": []
}
```

---

## Respuesta exitosa con mensajes de texto

```json
{
  "message": "Mensajes obtenidos correctamente",
  "messages": [
    {
      "id": 1,
      "content": "Hola, este es un mensaje de prueba desde Socket.IO.",
      "createdAt": "2026-06-04T20:30:00.000Z",
      "pqrId": 1,
      "senderId": 2,
      "sender": {
        "id": 2,
        "name": "Juan",
        "email": "juan@gmail.com",
        "role": "USER"
      },
      "attachments": []
    }
  ]
}
```

---

## Respuesta exitosa con mensaje y archivo adjunto

```json
{
  "message": "Mensajes obtenidos correctamente",
  "messages": [
    {
      "id": 93,
      "content": null,
      "createdAt": "2026-06-04T22:41:24.099Z",
      "pqrId": 1,
      "senderId": 2,
      "sender": {
        "id": 2,
        "name": "goria",
        "email": "yulid@gmail.com",
        "role": "USER"
      },
      "attachments": [
        {
          "id": 1,
          "fileName": "1780612884091-volante.pdf",
          "originalName": "Volante.pdf",
          "fileUrl": "/uploads/pqr/1780612884091-volante.pdf",
          "fileType": "DOCUMENT",
          "mimeType": "application/pdf",
          "fileSize": 78205,
          "createdAt": "2026-06-04T22:41:24.099Z",
          "messageId": 93
        }
      ]
    }
  ]
}
```

---

## Notas importantes

El campo `content` puede ser `null` cuando el usuario envía únicamente una imagen o documento.

El campo `attachments` siempre se devuelve como un arreglo. Si el mensaje no tiene archivos, se devuelve vacío.

```json
"attachments": []
```

Si el mensaje tiene un archivo, se devuelve dentro del arreglo `attachments`.

---

## Respuesta si el id no es válido

```json
{
  "message": "El id de la PQR no es válido"
}
```

---

## Respuesta si la PQR no existe

```json
{
  "message": "La PQR no existe"
}
```

---

## Respuesta si el USER no es dueño de la PQR

```json
{
  "message": "Solo puedes ver los mensajes de tus PQR"
}
```

---

## Respuesta si el AGENT no tiene asignada la PQR

```json
{
  "message": "Solo puedes ver los mensajes de las PQR asignadas a ti"
}
```

---

# Marcar chat de PQR como leído

## Endpoint protegido

```http
PATCH /api/pqrs/:id/messages/read
```

## Descripción

Endpoint protegido encargado de marcar como leído el chat de una PQR para el usuario autenticado.

Este endpoint se utiliza cuando el usuario o agente abre el chat de una PQR. El sistema guarda la fecha y hora de la última lectura.

---

## Header requerido

```http
Authorization: Bearer TOKEN_ADMIN
```

---

## Acceso permitido

* USER dueño de la PQR.
* AGENT asignado a la PQR.
* ADMIN según reglas del sistema.

---

## Parámetros

| Parámetro | Tipo   | Descripción             |
| --------- | ------ | ----------------------- |
| id        | number | Identificador de la PQR |

---

## Respuesta exitosa

```json
{
  "message": "Chat marcado como leído correctamente"
}
```

---

## Respuesta si el id no es válido

```json
{
  "message": "El id de la PQR no es válido"
}
```

---

## Respuesta si el usuario no está autenticado

```json
{
   "message": "Usuario no autenticado"
}
```

---

##  Respuesta si la PQR no existe

```json
{
   "message": "La PQR no existe"
}
```

---

##  Respuesta si el USER no es dueño de la PQR

```json
{
   "message":  "Solo puedes marcar como leído el chat de tus PQR"
}
```

----

##  Respuesta si el AGENT no tiene asignada la PQR

```json
{
   "message": "Solo puedes marcar como leído el chat de las PQR asignadas a ti"
}
```

---

# Enviar mensaje con archivo adjunto en una PQR

## Endpoint protegido

```http
POST /api/pqrs/:id/messages/attachment
```

## Descripción

Endpoint protegido encargado de enviar un mensaje con archivo adjunto dentro del chat de una PQR.

Este endpoint permite enviar imágenes o documentos asociados a un mensaje del chat.

El mensaje puede contener:

```txt
Solo archivo
Solo texto
Texto + archivo
```

Cuando se envía solo un archivo, el campo `content` se guarda como `null`.

---

## Tipo de envío requerido

Este endpoint no recibe datos en formato JSON.

Debe enviarse mediante:

```txt
multipart/form-data
```

---

## Header requerido

```http
Authorization: Bearer TOKEN
```

No se debe agregar manualmente el header `Content-Type`, ya que Postman o el frontend lo generan automáticamente al usar `multipart/form-data`.

---

## Acceso permitido

* USER dueño de la PQR.
* AGENT asignado a la PQR.
* ADMIN según reglas del sistema.

---

## Parámetros

| Parámetro | Tipo   | Descripción             |
| --------- | ------ | ----------------------- |
| id        | number | Identificador de la PQR |

---

## Campos del form-data

| Campo   | Tipo | Obligatorio | Descripción                               |
| ------- | ---- | ----------- | ----------------------------------------- |
| file    | File | Sí          | Imagen o documento que se desea adjuntar. |
| content | Text | No          | Mensaje opcional que acompaña al archivo. |

---

## Tipos de archivo permitidos

```txt
image/jpeg
image/png
image/webp
application/pdf
```

Formatos permitidos:

```txt
JPG
PNG
WEBP
PDF
```

---

## Tamaño máximo permitido

```txt
5 MB
```

---

## Ejemplo en Postman

```txt
Método: POST
URL: http://localhost:4000/api/pqrs/1/messages/attachment

Headers:
Authorization: Bearer TOKEN

Body:
form-data
```

| Key     | Type | Value                       |
| ------- | ---- | --------------------------- |
| file    | File | evidencia.png o soporte.pdf |
| content | Text | Adjunto evidencia del caso. |

---

## Respuesta exitosa con documento

```json
{
  "message": "Mensaje con archivo enviado correctamente",
  "pqrMessage": {
    "id": 93,
    "content": null,
    "createdAt": "2026-06-04T22:41:24.099Z",
    "pqrId": 1,
    "senderId": 2,
    "sender": {
      "id": 2,
      "name": "goria",
      "email": "yulid@gmail.com",
      "role": "USER"
    },
    "attachments": [
      {
        "id": 1,
        "fileName": "1780612884091-volante.pdf",
        "originalName": "Volante.pdf",
        "fileUrl": "/uploads/pqr/1780612884091-volante.pdf",
        "fileType": "DOCUMENT",
        "mimeType": "application/pdf",
        "fileSize": 78205,
        "createdAt": "2026-06-04T22:41:24.099Z",
        "messageId": 93
      }
    ]
  }
}
```

---

## Respuesta exitosa con imagen

```json
{
  "message": "Mensaje con archivo enviado correctamente",
  "pqrMessage": {
    "id": 94,
    "content": "Adjunto evidencia del error.",
    "createdAt": "2026-06-04T22:45:00.000Z",
    "pqrId": 1,
    "senderId": 2,
    "sender": {
      "id": 2,
      "name": "goria",
      "email": "yulid@gmail.com",
      "role": "USER"
    },
    "attachments": [
      {
        "id": 2,
        "fileName": "1780614180957-github.png",
        "originalName": "github.png",
        "fileUrl": "/uploads/pqr/1780614180957-github.png",
        "fileType": "IMAGE",
        "mimeType": "image/png",
        "fileSize": 120000,
        "createdAt": "2026-06-04T22:45:00.000Z",
        "messageId": 94
      }
    ]
  }
}
```

---

## Respuesta si no se envía archivo

```json
{
  "message": "El archivo es obligatorio"
}
```

---

## Respuesta si el archivo no es válido

```json
{
  "message": "Solo se permiten imágenes JPG, PNG, WEBP o documentos PDF"
}
```

---

## Respuesta si el mensaje supera los 500 caracteres

```json
{
  "message": "El mensaje no puede superar los 500 caracteres"
}
```

---

## Respuesta si el id no es válido

```json
{
  "message": "El id de la PQR no es válido"
}
```

---

## Respuesta si la PQR no existe

```json
{
  "message": "La PQR no existe"
}
```

---

## Respuesta si la PQR está cerrada

```json
{
  "message": "No se pueden enviar mensajes en una PQR cerrada"
}
```

---

## Respuesta si el USER no es dueño de la PQR

```json
{
  "message": "Solo puedes enviar mensajes en las PQR creadas por ti"
}
```

---

## Respuesta si el AGENT no tiene asignada la PQR

```json
{
  "message": "Solo puedes enviar mensajes en las PQR asignadas a ti"
}
```

---

# Calificar una PQR cerrada

## Endpoint protegido para USER

```http
PATCH /api/pqrs/:id/rate
```

## Ejemplo

```http
PATCH /api/pqrs/1/rate
```

## Descripción

Endpoint privado encargado de permitir que un usuario califique una PQR creada por él, siempre que la PQR se encuentre en estado `CERRADA`.

Esta ruta permite registrar una calificación del servicio recibido y, de manera opcional, un comentario sobre la atención brindada.

---

## Header requerido

```http
Authorization: Bearer TOKEN_USER
Content-Type: application/json
```

---

## Acceso permitido

* USER
  
---

## Parámetros

| Parámetro | Tipo   | Descripción                                    |
| --------- | ------ | ---------------------------------------------- |
| id        | number | Identificador de la PQR que se desea calificar |

---

## Body

```json
{
  "rating": 5,
  "ratingComment": "La atención fue rápida y clara."
}
```

---

## Notificación automática

Cuando un usuario califica una PQR cerrada, el sistema genera automáticamente una notificación para los usuarios con rol `ADMIN` y para el `AGENT` asignado a la PQR.

| Destinatario   | Tipo      | Mensaje                                                          |
| -------------- | --------- | ---------------------------------------------------------------- |
| ADMIN          | PQR_RATED | Juan Pérez (juan@gmail.com) calificó la PQR #10 con 5 estrellas. |
| AGENT asignado | PQR_RATED | Juan Pérez (juan@gmail.com) calificó la PQR #10 con 5 estrellas. |

Si la PQR no tiene agente asignado, la notificación solo se genera para los usuarios con rol `ADMIN`.

---

## Campos del body

| Campo         | Tipo   | Obligatorio | Descripción                                                           |
| ------------- | ------ | ----------- | --------------------------------------------------------------------- |
| rating        | number | Sí          | Calificación asignada por el usuario. Debe estar entre 1 y 5          |
| ratingComment | string | No          | Comentario opcional sobre la atención recibida. Máximo 300 caracteres |

---

## Respuesta exitosa

```json
{
  "message": "PQR calificada correctamente",
  "pqr": {
    "id": 4,
    "caseType": "OTRO",
    "description": "La plataforma muestra errores constantes durante el proceso de registro.",
    "status": "CERRADA",
    "createdAt": "2026-05-28T10:30:00.000Z",
    "updatedAt": "2026-05-28T22:19:48.774Z",
    "userId": 2,
    "assignedToId": null,
    "priority": "MEDIA",
    "rating": 5,
    "ratingComment": "La atención fue rápida y clara.",
    "ratedAt": "2026-05-28T22:19:48.773Z"
  }
}
```

---

## Respuesta si el id no es válido

```json
{
  "message": "El id de la PQR no es válido"
}
```

---

## Respuesta si no se envía calificación

```json
{
  "message": "La calificación es obligatoria"
}
```

---

## Respuesta si la calificación no está entre 1 y 5

```json
{
  "message": "La calificación debe estar entre 1 y 5"
}
```

---

## Respuesta si el comentario supera los 300 caracteres

```json
{
  "message": "El comentario no puede superar los 300 caracteres"
}
```

---

## Respuesta si la PQR no existe

```json
{
  "message": "La PQR no existe"
}
```

---

## Respuesta si la PQR no pertenece al usuario autenticado

```json
{
  "message": "Solo puedes calificar las PQR creadas por ti"
}
```

---

## Respuesta si la PQR no está cerrada

```json
{
  "message": "Solo puedes calificar una PQR cerrada"
}
```

---

## Respuesta si la PQR ya fue calificada

```json
{
  "message": "Esta PQR ya fue calificada"
}
```

---

## Respuesta en caso de error

```json
{
  "message": "Error al calificar la PQR"
}
```

---

# Notificaciones

El backend ahora cuenta con un módulo de notificaciones internas para informar a los usuarios sobre acciones importantes relacionadas con las PQR.

Las notificaciones se guardan en la base de datos y cada usuario autenticado puede consultar únicamente las notificaciones asociadas a su cuenta.

---

## Tipos de notificación

```txt
NEW_PQR
STATUS_CHANGE
PRIORITY_CHANGE
PQR_CLOSED
PQR_RATED
PQR_TAKEN
PQR_ASSIGNED
PQR_UNASSIGNED
```

| Tipo            | Descripción                                                                                  |
| --------------- | -------------------------------------------------------------------------------------------- |
| NEW_PQR         | Se genera cuando un usuario crea una nueva PQR.                                              |
| STATUS_CHANGE   | Se reserva para notificar cambios de estado de una PQR.                                      |
| PRIORITY_CHANGE | Se reserva para notificar cambios de prioridad de una PQR.                                   |
| PQR_CLOSED      | Se genera cuando una PQR cambia a estado CERRADA.                                            |
| PQR_RATED       | Se genera cuando un usuario califica una PQR cerrada.                                        |
| PQR_TAKEN       | Se genera cuando un agente toma una PQR o cuando se asigna por primera vez al usuario dueño. |
| PQR_ASSIGNED    | Se genera cuando un ADMIN asigna o reasigna una PQR a un agente.                             |
| PQR_UNASSIGNED  | Se genera cuando un ADMIN retira una PQR a un agente.                                        |

---

# Obtener notificaciones del usuario autenticado

## Endpoint protegido

```http
GET /api/notifications
```

## Descripción

Endpoint encargado de obtener todas las notificaciones del usuario autenticado.

Cada usuario solo puede consultar sus propias notificaciones.

---

## Header requerido

```http
Authorization: Bearer TOKEN
```

---

## Acceso permitido

```txt
USER
ADMIN
AGENT
```

---

## Respuesta exitosa

```json
{
  "message": "Notificaciones obtenidas correctamente.",
  "notifications": [
    {
      "id": 1,
      "title": "Nueva PQR creada",
      "message": "Juan Pérez (juan@gmail.com) creó una nueva PQR #10.",
      "type": "NEW_PQR",
      "isRead": false,
      "userId": 2,
      "pqrId": 10,
      "createdAt": "2026-06-03T15:30:00.000Z"
    }
  ]
}
```

---

## Respuesta si no tiene notificaciones

```json
{
  "message": "Notificaciones obtenidas correctamente.",
  "notifications": []
}
```

---

# Obtener cantidad de notificaciones no leídas

## Endpoint protegido

```http
GET /api/notifications/unread-count
```

## Descripción

Endpoint encargado de obtener la cantidad de notificaciones no leídas del usuario autenticado.

---

## Header requerido

```http
Authorization: Bearer TOKEN
```

---

## Acceso permitido

```txt
USER
ADMIN
AGENT
```

---

## Respuesta exitosa

```json
{
  "message": "Cantidad de notificaciones no leídas obtenida correctamente.",
  "count": 3
}
```

---

## Respuesta si no tiene notificaciones no leídas

```json
{
  "message": "Cantidad de notificaciones no leídas obtenida correctamente.",
  "count": 0
}
```

---

# Marcar una notificación como leída

## Endpoint protegido

```http
PATCH /api/notifications/:id/read
```

## Ejemplo

```http
PATCH /api/notifications/1/read
```

## Descripción

Endpoint encargado de marcar una notificación específica como leída.

La notificación solo puede ser marcada como leída si pertenece al usuario autenticado.

---

## Header requerido

```http
Authorization: Bearer TOKEN
```

---

## Acceso permitido

```txt
USER
ADMIN
AGENT
```

---

## Parámetros

| Parámetro | Tipo   | Descripción                                                      |
| --------- | ------ | ---------------------------------------------------------------- |
| id        | number | Identificador de la notificación que se desea marcar como leída. |

---

## Respuesta exitosa

```json
{
  "message": "Notificación marcada como leída."
}
```

---

## Respuesta si el id no es válido

```json
{
  "message": "El id de la notificación no es válido."
}
```

---

## Respuesta si la notificación no existe o no pertenece al usuario

```json
{
  "message": "La notificación no existe."
}
```

---

# Marcar todas las notificaciones como leídas

## Endpoint protegido

```http
PATCH /api/notifications/read-all
```

## Descripción

Endpoint encargado de marcar como leídas todas las notificaciones pendientes del usuario autenticado.

---

## Header requerido

```http
Authorization: Bearer TOKEN
```

---

## Acceso permitido

```txt
USER
ADMIN
AGENT
```

---

## Respuesta exitosa

```json
{
  "message": "Todas las notificaciones fueron marcadas como leídas.",
  "updatedCount": 4
}
```

---

## Respuesta si no tiene notificaciones pendientes

```json
{
  "message": "No tienes notificaciones pendientes por leer.",
  "updatedCount": 0
}
```


---

# Resumen actualizado de endpoints funcionales

| Método | Endpoint                          | Descripción                                                | Acceso               |
| ------ | --------------------------------- | ---------------------------------------------------------- | -------------------- |
| GET    | /api/health                       | Verifica el funcionamiento de la API                       | Público              |
| GET    | /api/users                        | Obtiene todos los usuarios registrados                     | ADMIN                |
| POST   | /api/auth/register                | Registra un nuevo usuario                                  | Público              |
| POST   | /api/auth/register/bulk           | Registra usuarios mediante carga masiva desde Excel        | ADMIN                |
| POST   | /api/auth/login                   | Inicia sesión y genera token JWT                           | Público              |
| GET    | /api/profile                      | Obtiene el perfil del usuario autenticado                  | Usuario autenticado  |
| POST   | /api/pqrs                         | Crea una nueva PQR                                         | USER / ADMIN         |
| GET    | /api/pqrs/my                      | Obtiene las PQR del usuario autenticado                    | USER / ADMIN         |
| GET    | /api/pqrs                         | Obtiene todas las PQR del sistema                          | ADMIN                |
| GET    | /api/pqrs/available               | Obtiene las PQR pendientes sin responsable                 | ADMIN / AGENT        |
| GET    | /api/pqrs/assigned/my             | Obtiene las PQR asignadas al AGENT autenticado             | ADMIN / AGENT        |
| PATCH  | /api/pqrs/:id/take                | Permite que un AGENT tome una PQR disponible               | ADMIN / AGENT        |
| PATCH  | /api/pqrs/:id/status              | Cambia el estado de una PQR                                | ADMIN / AGENT        |
| PATCH  | /api/users/:id/role               | Cambia el rol de un usuario                                | ADMIN                |
| PATCH  | /api/pqrs/:id/priority            | Cambia la prioridad de una PQR                             | ADMIN / AGENT        |
| GET    | /api/pqrs/:id/messages            | Obtiene el historial de mensajes de una PQR                | USER / AGENT / ADMIN |
| PATCH  | /api/pqrs/:id/messages/read       | Marca como leído el chat de una PQR                        | USER / AGENT         |
| PATCH  | /api/pqrs/:id/rate                | Permite calificar una PQR cerrada                          | USER                 |
| GET    | /api/notifications                | Obtiene las notificaciones del usuario autenticado         | USER / ADMIN / AGENT |
| GET    | /api/notifications/unread-count   | Obtiene la cantidad de notificaciones no leídas            | USER / ADMIN / AGENT |
| PATCH  | /api/notifications/:id/read       | Marca una notificación como leída                          | USER / ADMIN / AGENT |
| PATCH  | /api/notifications/read-all       | Marca todas las notificaciones como leídas                 | USER / ADMIN / AGENT |
| POST   | /api/pqrs/:id/messages/attachment | Envía un mensaje con imagen o documento adjunto en una PQR | USER / AGENT / ADMIN |
| PATCH  | /api/pqrs/:id/assign              | Asigna o reasigna una PQR a un agente específico           | ADMIN                |
| PATCH  | /api/pqrs/:id/unassign            | Desasigna una PQR y la deja nuevamente disponible          | ADMIN                |
| GET    | /api/users/agents                 | Obtiene únicamente los usuarios con rol AGENT              | ADMIN                |

---

# Eventos Socket.IO funcionales

| Evento           | Descripción                                                           | Uso     |
| ---------------- | --------------------------------------------------------------------- | ------- |
| connection       | Conecta un usuario autenticado al socket                              | Backend |
| join_pqr         | Une al usuario a la sala de una PQR                                   | Cliente |
| joined_pqr       | Confirma que el usuario ingresó al chat                               | Backend |
| send_pqr_message | Envía un mensaje dentro de una PQR                                    | Cliente |
| new_pqr_message  | Recibe un nuevo mensaje de texto o con archivo adjunto en tiempo real | Backend |
| socket_error     | Informa errores de autenticación, permisos o validación               | Backend |
| disconnect       | Detecta la desconexión del usuario                                    | Backend |

---

# Eventos que generan notificaciones

| Acción                          | Quién ejecuta | Quién recibe                          | Tipo de notificación          |
| Crear una PQR                   | USER          | ADMIN y AGENT                         | NEW_PQR                       |
| Tomar una PQR                   | AGENT         | ADMIN y USER dueño de la PQR          | PQR_TAKEN                     |
| Cerrar una PQR                  | ADMIN o AGENT | USER dueño de la PQR                  | PQR_CLOSED                    |
| Calificar una PQR               | USER          | ADMIN y AGENT asignado                | PQR_RATED                     |
| Asignar una PQR por primera vez | ADMIN         | AGENT asignado y USER dueño de la PQR | PQR_ASSIGNED / PQR_TAKEN      |
| Reasignar una PQR               | ADMIN         | Nuevo AGENT y AGENT anterior          | PQR_ASSIGNED / PQR_UNASSIGNED |
| Desasignar una PQR              | ADMIN         | AGENT retirado                        | PQR_UNASSIGNED                |