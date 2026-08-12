# Documentación de modelos de tablas Prisma

## Descripción general

Este documento describe únicamente los modelos de tablas definidos en el archivo `schema.prisma`.

Los modelos documentados son:

```txt
User
PQR
PqrMessage
PqrChatRead
PqrMessageAttachment
Notification
```

---

# Modelo User

## Descripción

El modelo `User` representa a los usuarios registrados en el sistema.

```prisma
model User {
  id       Int    @id @default(autoincrement())
  name     String
  email    String @unique
  password String
  role     Role   @default(USER)

  pqrsCreated  PQR[] @relation("UserPqrs")
  pqrsAssigned PQR[] @relation("AgentPqrs")

  pqrMessages   PqrMessage[]
  notifications Notification[]
  pqrChatReads  PqrChatRead[]
}
```

## Descripción de campos

| Campo         | Tipo           | Descripción                                                        |
| ------------- | -------------- | ------------------------------------------------------------------ |
| id            | Int            | Identificador único del usuario                                    |
| name          | String         | Nombre del usuario                                                 |
| email         | String         | Correo electrónico único del usuario                               |
| password      | String         | Contraseña encriptada del usuario                                  |
| role          | Role           | Rol del usuario dentro del sistema                                 |
| pqrsCreated   | PQR[]          | Relación con las PQR creadas por el usuario                        |
| pqrsAssigned  | PQR[]          | Relación con las PQR asignadas al usuario cuando actúa como agente |
| pqrMessages   | PqrMessage[]   | Relación con los mensajes enviados por el usuario                  |
| notifications | Notification[] | Relación con las notificaciones asociadas al usuario               |
| pqrChatReads  | PqrChatRead[]  | Relación con los registros de lectura de chats del usuario         |

---

# Modelo PQR

## Descripción

El modelo `PQR` representa las solicitudes creadas por los usuarios.

```prisma
model PQR {
  id          Int         @id @default(autoincrement())
  caseType    PqrCaseType
  description String      @db.VarChar(500)
  status      PqrStatus   @default(PENDIENTE)
  createdAt   DateTime    @default(now())
  updatedAt   DateTime    @updatedAt

  userId Int
  user   User @relation("UserPqrs", fields: [userId], references: [id])

  assignedToId Int?
  assignedTo   User? @relation("AgentPqrs", fields: [assignedToId], references: [id])

  priority PqrPriority?

  rating        Int?
  ratingComment String?   @db.VarChar(300)
  ratedAt       DateTime?

  messages      PqrMessage[]
  notifications Notification[]
  chatReads     PqrChatRead[]
}
```

## Descripción de campos

| Campo         | Tipo           | Descripción                                                   |
| ------------- | -------------- | ------------------------------------------------------------- |
| id            | Int            | Identificador único de la PQR                                 |
| caseType      | PqrCaseType    | Tipo de caso de la PQR                                        |
| description   | String         | Descripción de la solicitud, máximo 500 caracteres            |
| status        | PqrStatus      | Estado actual de la PQR                                       |
| createdAt     | DateTime       | Fecha de creación de la PQR                                   |
| updatedAt     | DateTime       | Fecha de última actualización de la PQR                       |
| userId        | Int            | Identificador del usuario que creó la PQR                     |
| user          | User           | Relación con el usuario creador de la PQR                     |
| assignedToId  | Int?           | Identificador del agente asignado                             |
| assignedTo    | User?          | Relación con el agente asignado a la PQR                      |
| priority      | PqrPriority?   | Prioridad asignada a la PQR                                   |
| rating        | Int?           | Calificación dada por el usuario                              |
| ratingComment | String?        | Comentario opcional de la calificación, máximo 300 caracteres |
| ratedAt       | DateTime?      | Fecha en que la PQR fue calificada                            |
| messages      | PqrMessage[]   | Relación con los mensajes asociados a la PQR                  |
| notifications | Notification[] | Relación con las notificaciones relacionadas con la PQR       |
| chatReads     | PqrChatRead[]  | Relación con los registros de lectura del chat de la PQR      |

---

# Modelo PqrMessage

## Descripción

El modelo `PqrMessage` representa los mensajes enviados dentro del chat de una PQR.

```prisma
model PqrMessage {
  id        Int      @id @default(autoincrement())
  content   String?  @db.VarChar(500)
  createdAt DateTime @default(now())

  pqrId Int
  pqr   PQR @relation(fields: [pqrId], references: [id], onDelete: Cascade)

  senderId Int
  sender   User @relation(fields: [senderId], references: [id])

  attachments PqrMessageAttachment[]
}
```

## Descripción de campos

| Campo       | Tipo                   | Descripción                                             |
| ----------- | ---------------------- | ------------------------------------------------------- |
| id          | Int                    | Identificador único del mensaje                         |
| content     | String?                | Contenido del mensaje, máximo 500 caracteres            |
| createdAt   | DateTime               | Fecha de creación del mensaje                           |
| pqrId       | Int                    | Identificador de la PQR a la que pertenece el mensaje   |
| pqr         | PQR                    | Relación con la PQR a la que pertenece el mensaje       |
| senderId    | Int                    | Identificador del usuario que envió el mensaje          |
| sender      | User                   | Relación con el usuario que envió el mensaje            |
| attachments | PqrMessageAttachment[] | Relación con los archivos adjuntos asociados al mensaje |

---

# Modelo PqrChatRead

## Descripción

El modelo `PqrChatRead` representa la lectura del chat de una PQR por parte de un usuario.

Sirve para guardar cuándo un usuario revisó por última vez el chat de una PQR.

```prisma
model PqrChatRead {
  id         Int      @id @default(autoincrement())
  pqrId      Int
  userId     Int
  lastReadAt DateTime @default(now())

  pqr  PQR  @relation(fields: [pqrId], references: [id], onDelete: Cascade)
  user User @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@unique([pqrId, userId])
}
```

## Descripción de campos

| Campo      | Tipo     | Descripción                                  |
| ---------- | -------- | -------------------------------------------- |
| id         | Int      | Identificador único del registro             |
| pqrId      | Int      | Identificador de la PQR relacionada          |
| userId     | Int      | Identificador del usuario que revisó el chat |
| lastReadAt | DateTime | Fecha y hora de la última revisión del chat  |
| pqr        | PQR      | Relación con la PQR revisada                 |
| user       | User     | Relación con el usuario que revisó el chat   |

## Restricción única

```prisma
@@unique([pqrId, userId])
```

Esta restricción evita que exista más de un registro de lectura para el mismo usuario dentro de la misma PQR.

Ejemplo permitido:

```txt
PQR 8 - Usuario 3
PQR 8 - Usuario 5
```

Ejemplo no permitido:

```txt
PQR 8 - Usuario 3
PQR 8 - Usuario 3
```

---

# Modelo PqrMessageAttachment

## Descripción

El modelo `PqrMessageAttachment` representa los archivos adjuntos enviados en los mensajes del chat de una PQR.

```prisma
model PqrMessageAttachment {
  id           Int               @id @default(autoincrement())
  fileName     String
  originalName String
  fileUrl      String
  fileType     PqrAttachmentType
  mimeType     String
  fileSize     Int
  createdAt    DateTime          @default(now())

  messageId Int
  message   PqrMessage @relation(fields: [messageId], references: [id], onDelete: Cascade)
}
```

## Descripción de campos

| Campo        | Tipo              | Descripción                                                 |
| ------------ | ----------------- | ----------------------------------------------------------- |
| id           | Int               | Identificador único del archivo adjunto                     |
| fileName     | String            | Nombre generado para almacenar el archivo                   |
| originalName | String            | Nombre original del archivo subido                          |
| fileUrl      | String            | Ruta donde se encuentra almacenado el archivo               |
| fileType     | PqrAttachmentType | Tipo de archivo adjunto                                     |
| mimeType     | String            | Tipo MIME del archivo                                       |
| fileSize     | Int               | Tamaño del archivo                                          |
| createdAt    | DateTime          | Fecha de carga del archivo                                  |
| messageId    | Int               | Identificador del mensaje relacionado                       |
| message      | PqrMessage        | Relación con el mensaje al que pertenece el archivo adjunto |

---

# Modelo Notification

## Descripción

El modelo `Notification` representa las notificaciones internas generadas para los usuarios.

```prisma
model Notification {
  id        Int              @id @default(autoincrement())
  title     String
  message   String
  type      NotificationType
  isRead    Boolean          @default(false)
  userId    Int
  pqrId     Int?
  createdAt DateTime         @default(now())

  user User @relation(fields: [userId], references: [id])
  pqr  PQR? @relation(fields: [pqrId], references: [id])
}
```

## Descripción de campos

| Campo     | Tipo             | Descripción                                        |
| --------- | ---------------- | -------------------------------------------------- |
| id        | Int              | Identificador único de la notificación             |
| title     | String           | Título de la notificación                          |
| message   | String           | Mensaje de la notificación                         |
| type      | NotificationType | Tipo de notificación                               |
| isRead    | Boolean          | Indica si la notificación fue leída                |
| userId    | Int              | Identificador del usuario destinatario             |
| pqrId     | Int?             | Identificador opcional de la PQR relacionada       |
| createdAt | DateTime         | Fecha de creación de la notificación               |
| user      | User             | Relación con el usuario que recibe la notificación |
| pqr       | PQR?             | Relación con la PQR asociada a la notificación     |

---

# Conclusión

Este documento describe únicamente los modelos que representan tablas en la base de datos.

Los modelos permiten organizar la información de usuarios, PQR, mensajes, archivos adjuntos, notificaciones y registros de lectura del chat.
