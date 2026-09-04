# Documentación de Modelos Prisma — Presta App

## Descripción general

Este documento describe los modelos y enums definidos actualmente en `prisma/schema.prisma`.

El esquema de Presta App contiene las entidades necesarias para:

- Usuarios y autenticación.
- PQR.
- Chat y adjuntos.
- Lectura de chats.
- Notificaciones.
- Catálogo de tipos de identificación.

---

# Enums

## `Role`

```prisma
enum Role {
  USER
  ADMIN
  AGENT
}
```

| Valor | Descripción |
| --- | --- |
| `USER` | Usuario general |
| `ADMIN` | Administrador |
| `AGENT` | Agente encargado de atender PQR |

## `PqrStatus`

```prisma
enum PqrStatus {
  PENDIENTE
  EN_PROCESO
  CERRADA
}
```

## `PqrCaseType`

```prisma
enum PqrCaseType {
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
}
```

## `PqrPriority`

```prisma
enum PqrPriority {
  BAJA
  MEDIA
  ALTA
  URGENTE
}
```

## `NotificationType`

```prisma
enum NotificationType {
  NEW_PQR
  STATUS_CHANGE
  PRIORITY_CHANGE
  PQR_CLOSED
  PQR_RATED
  PQR_TAKEN
  PQR_ASSIGNED
  PQR_UNASSIGNED
}
```

## `PqrAttachmentType`

```prisma
enum PqrAttachmentType {
  IMAGE
  DOCUMENT
}
```

---

# Modelo `IdentificationType`

Representa el catálogo de tipos de identificación.

```prisma
model IdentificationType {
  id       Int     @id @default(autoincrement())
  code     String  @unique @db.VarChar(20)
  name     String  @unique @db.VarChar(100)
  isActive Boolean @default(true)

  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
```

| Campo | Tipo | Descripción |
| --- | --- | --- |
| `id` | `Int` | Identificador único |
| `code` | `String` | Código único, máximo 20 caracteres |
| `name` | `String` | Nombre único, máximo 100 caracteres |
| `isActive` | `Boolean` | Indica si puede utilizarse |
| `createdAt` | `DateTime` | Fecha de creación |
| `updatedAt` | `DateTime` | Fecha de última modificación |

Restricciones:

```prisma
code String @unique
name String @unique
```

Actualmente no tiene relaciones con otros modelos del esquema.

---

# Modelo `User`

Representa a los usuarios registrados.

```prisma
model User {
  id       Int    @id @default(autoincrement())
  name     String
  email    String @unique
  password String
  role     Role   @default(USER)

  createdAt DateTime @default(now())
  updatedAt DateTime @default(now()) @updatedAt

  pqrsCreated  PQR[] @relation("UserPqrs")
  pqrsAssigned PQR[] @relation("AgentPqrs")

  pqrMessages   PqrMessage[]
  notifications Notification[]
  pqrChatReads  PqrChatRead[]
}
```

| Campo | Tipo | Descripción |
| --- | --- | --- |
| `id` | `Int` | Identificador único |
| `name` | `String` | Nombre del usuario |
| `email` | `String` | Correo electrónico único |
| `password` | `String` | Contraseña encriptada |
| `role` | `Role` | Rol general del sistema |
| `createdAt` | `DateTime` | Fecha de creación |
| `updatedAt` | `DateTime` | Fecha de actualización |
| `pqrsCreated` | `PQR[]` | PQR creadas por el usuario |
| `pqrsAssigned` | `PQR[]` | PQR asignadas al usuario como agente |
| `pqrMessages` | `PqrMessage[]` | Mensajes enviados |
| `notifications` | `Notification[]` | Notificaciones recibidas |
| `pqrChatReads` | `PqrChatRead[]` | Registros de lectura |

---

# Modelo `PQR`

Representa las peticiones, quejas, reclamos o solicitudes.

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
  ratingComment String? @db.VarChar(300)
  ratedAt       DateTime?

  messages      PqrMessage[]
  notifications Notification[]
  chatReads     PqrChatRead[]
}
```

| Campo | Tipo | Descripción |
| --- | --- | --- |
| `id` | `Int` | Identificador único |
| `caseType` | `PqrCaseType` | Tipo de caso |
| `description` | `String` | Descripción, máximo 500 caracteres |
| `status` | `PqrStatus` | Estado actual |
| `createdAt` | `DateTime` | Fecha de creación |
| `updatedAt` | `DateTime` | Fecha de actualización |
| `userId` | `Int` | Usuario creador |
| `assignedToId` | `Int?` | Agente asignado |
| `priority` | `PqrPriority?` | Prioridad |
| `rating` | `Int?` | Calificación |
| `ratingComment` | `String?` | Comentario de calificación, máximo 300 caracteres |
| `ratedAt` | `DateTime?` | Fecha de calificación |
| `messages` | `PqrMessage[]` | Mensajes del chat |
| `notifications` | `Notification[]` | Notificaciones relacionadas |
| `chatReads` | `PqrChatRead[]` | Lecturas del chat |

---

# Modelo `PqrMessage`

Representa un mensaje dentro del chat.

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

Un mensaje puede contener texto, adjuntos o ambos.

---

# Modelo `PqrChatRead`

Registra la última lectura del chat por usuario.

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

La restricción:

```prisma
@@unique([pqrId, userId])
```

garantiza un único registro de lectura por usuario y PQR.

---

# Modelo `PqrMessageAttachment`

Representa los archivos adjuntos de los mensajes.

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

| Campo | Descripción |
| --- | --- |
| `fileName` | Nombre generado para almacenar el archivo |
| `originalName` | Nombre original |
| `fileUrl` | Ruta del archivo |
| `fileType` | `IMAGE` o `DOCUMENT` |
| `mimeType` | Tipo MIME |
| `fileSize` | Tamaño en bytes |
| `messageId` | Mensaje relacionado |

---

# Modelo `Notification`

Representa las notificaciones internas.

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

Las notificaciones están asociadas con usuarios y, opcionalmente, con una PQR.

---

# Relaciones principales

```txt
User
├── crea -> PQR
├── atiende -> PQR
├── envía -> PqrMessage
├── recibe -> Notification
└── registra lectura -> PqrChatRead

PQR
├── tiene -> PqrMessage
├── tiene -> Notification
└── tiene -> PqrChatRead

PqrMessage
└── tiene -> PqrMessageAttachment
```
