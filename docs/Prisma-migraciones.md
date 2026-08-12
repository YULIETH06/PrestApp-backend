# Documentación de Prisma, creación de tablas, migraciones y alteraciones

## Descripción

Este documento registra el proceso utilizado en el proyecto para la creación, modificación y actualización de tablas en la base de datos mediante Prisma ORM.

El backend del proyecto utiliza Prisma como ORM para conectarse con MySQL y gestionar los modelos de datos desde el archivo `schema.prisma`.

Prisma permite trabajar la base de datos de una forma más organizada, ya que los modelos se definen en código y luego se convierten en tablas reales dentro de MySQL mediante migraciones.

---

# 1. Archivo principal de Prisma

## Ubicación

```txt
prisma/schema.prisma
```

## Descripción

El archivo `schema.prisma` es el archivo principal donde se define la estructura de la base de datos del proyecto.

En este archivo se crean los modelos, campos, relaciones y enumeraciones que Prisma convertirá posteriormente en tablas dentro de MySQL.

Ejemplo:

```prisma
model User {
  id       Int    @id @default(autoincrement())
  name     String
  email    String @unique
  password String
}
```

Este modelo representa una tabla llamada `User` dentro de la base de datos.

---

# 2. ¿Qué es un modelo en Prisma?

Un modelo en Prisma representa una tabla de la base de datos.

Por ejemplo:

```prisma
model User {
  id       Int    @id @default(autoincrement())
  name     String
  email    String @unique
  password String
}
```

Este modelo crea una tabla de usuarios con los siguientes campos:

| Campo | Tipo | Descripción |
|---|---|---|
| id | Int | Identificador único del usuario |
| name | String | Nombre del usuario |
| email | String | Correo electrónico único |
| password | String | Contraseña encriptada del usuario |

---

# 3. ¿Qué es un campo en Prisma?

Un campo en Prisma representa una columna dentro de una tabla.

Ejemplo:

```prisma
email String @unique
```

Este campo indica que la tabla tendrá una columna llamada `email`, de tipo texto, y que su valor no se puede repetir.

---

# 4. Tipos de datos comunes en Prisma

Prisma permite definir diferentes tipos de datos para los campos de los modelos.

| Tipo | Descripción |
|---|---|
| Int | Números enteros |
| String | Texto |
| Boolean | Verdadero o falso |
| DateTime | Fecha y hora |
| Float | Números decimales |
| enum | Lista de valores permitidos |

Ejemplo:

```prisma
createdAt DateTime @default(now())
```

Este campo guarda automáticamente la fecha y hora en que se crea un registro.

---

# 5. Atributos comunes en Prisma

Los atributos permiten definir reglas especiales para los campos.

| Atributo | Descripción |
|---|---|
| @id | Indica que el campo es clave primaria |
| @default | Define un valor por defecto |
| @unique | Evita valores repetidos |
| @updatedAt | Actualiza automáticamente la fecha cuando el registro cambia |
| @relation | Define relaciones entre tablas |

Ejemplo:

```prisma
id Int @id @default(autoincrement())
```

Este campo será la clave primaria de la tabla y aumentará automáticamente.

---

# 6. Creación de enums en Prisma

## Descripción

Un `enum` permite definir una lista fija de valores permitidos para un campo.

En el proyecto se creó el enum `Role` para manejar los roles del sistema.

```prisma
enum Role {
  USER
  ADMIN
}
```

Este enum permite que el sistema solo acepte dos tipos de roles:

| Rol | Descripción |
|---|---|
| USER | Usuario normal del sistema |
| ADMIN | Administrador del sistema |

---

# 7. ¿Qué es una migración en Prisma?

Una migración es el proceso mediante el cual Prisma convierte los cambios realizados en el archivo `schema.prisma` en cambios reales dentro de la base de datos MySQL.

Cuando se agrega, elimina o modifica un modelo o campo, Prisma necesita aplicar esos cambios a la base de datos.

---

# 8. Comando para crear una migración

Para aplicar el cambio del campo `role` en la tabla `User`, se ejecutó el siguiente comando:

```bash
npx prisma migrate dev --name add_role_to_user
```

El comando realiza las siguientes acciones:

1. Lee el archivo `schema.prisma`.
2. Detecta los cambios realizados en los modelos.
3. Crea una nueva carpeta de migración dentro de `prisma/migrations`.
4. Genera un archivo SQL con las instrucciones necesarias.
5. Aplica los cambios en la base de datos MySQL.
6. Actualiza el historial de migraciones del proyecto.

---

# 9. Carpeta de migraciones

Después de ejecutar el comando de migración, Prisma crea una carpeta dentro de:

```txt
prisma/migrations
```

Ejemplo:

```txt
prisma/migrations/
└── 20260512153000_add_role_to_user/
    └── migration.sql
```

Dentro del archivo `migration.sql` queda registrada la instrucción SQL que Prisma ejecutó en MySQL.

---

# 10. ¿Qué es el archivo migration.sql?

El archivo `migration.sql` contiene las instrucciones SQL generadas por Prisma para modificar la base de datos.

Por ejemplo, cuando se agrega un campo nuevo, Prisma genera una instrucción SQL para alterar la tabla correspondiente.

Este archivo permite tener un historial claro de los cambios aplicados a la base de datos.

---

# 11. ¿Qué es Prisma Client?

Prisma Client es la herramienta que permite consultar la base de datos desde el código TypeScript.

Ejemplo:

```ts
const user = await prisma.user.findUnique({
  where: {
    email,
  },
});
```

Prisma Client permite usar métodos como:

```ts
prisma.user.findMany()
prisma.user.findUnique()
prisma.user.create()
prisma.user.update()
prisma.user.delete()
```

---

# 12. Comando para actualizar Prisma Client

Después de modificar el archivo `schema.prisma`, también se debe actualizar Prisma Client.

Para eso se ejecuta:

```bash
npx prisma generate
```

El comando actualiza los tipos de Prisma que utiliza TypeScript.

Esto permite que el código reconozca los nuevos campos agregados al modelo.

Por ejemplo, antes TypeScript reconocía el usuario así:

```ts
{
  id: number;
  name: string;
  email: string;
  password: string;
}
```

Después de agregar el campo `role` y ejecutar `npx prisma generate`, TypeScript reconoce el usuario así:

```ts
{
  id: number;
  name: string;
  email: string;
  password: string;
  role: Role;
}
```

---

# 13. Diferencia entre migrate dev y generate

| Comando | Función principal | Qué actualiza |
|---|---|---|
| `npx prisma migrate dev --name nombre_migracion` | Aplica cambios en la base de datos | MySQL |
| `npx prisma generate` | Actualiza Prisma Client | TypeScript / Prisma Client |

---

## Ejemplo práctico de la diferencia

Cuando se agregó el campo:

```prisma
role Role @default(USER)
```

Prisma necesitaba dos procesos:

## Primero: actualizar la base de datos

```bash
npx prisma migrate dev --name add_role_to_user
```

Esto permitió que MySQL tuviera realmente la columna `role`.

## Segundo: actualizar Prisma Client

```bash
npx prisma generate
```

Esto permitió que TypeScript reconociera `user.role` dentro del código.