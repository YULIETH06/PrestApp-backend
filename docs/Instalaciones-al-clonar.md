# Configuración del Proyecto Clonado

Esta guía explica cómo configurar y ejecutar el backend localmente después de clonar el repositorio.

---

# 1. Clonar el repositorio

```bash
git clone + url
```

---

# 2. Instalar dependencias

```bash
npm install
```

## Descripción

Este comando instalará automáticamente todas las dependencias definidas en:

```txt
package.json
```

Incluyendo:

- Express
- Prisma
- TypeScript
- JWT
- Cors
- Dotenv
- TSX
- Tipados de TypeScript

---

# 3. Configurar variables de entorno

Crear un archivo:

```txt
.env
```

## Ejemplo

```env
DATABASE_URL="mysql://usuario:password@localhost:3306/backend_inc"
JWT_SECRET="secret_key"
PORT=3000
FRONTEND_URL="http://localhost:5173"
```

## Descripción

Las variables de entorno permiten configurar datos importantes del proyecto sin escribirlos directamente en el código.

La variable:

```env
DATABASE_URL="mysql://usuario:password@localhost:3306/backend_inc"
```

se utiliza para conectar el backend con la base de datos MySQL. En esta variable se especifica el usuario, la contraseña, el servidor, el puerto y el nombre de la base de datos.

La variable:

```env
JWT_SECRET="secret_key"
```

se utiliza para firmar y validar los tokens de autenticación JWT. Esta clave permite proteger las sesiones de los usuarios dentro del sistema.

La variable:

```env
PORT=3000
```

indica el puerto en el que se ejecutará el servidor backend.

La variable:

```env
FRONTEND_URL="http://localhost:5173"
```

indica la dirección donde se ejecuta el frontend. Esta variable se utiliza principalmente para permitir la comunicación entre el frontend y el backend, por ejemplo, en la configuración de CORS.

---

# 4. Generar Prisma Client

## Comando

```bash
npx prisma generate
```

## Descripción

Genera automáticamente el cliente de Prisma necesario para conectarse a la base de datos.

---

# 5. Ejecutar migraciones

## Comando

```bash
npx prisma migrate dev
```

## Descripción

Sincroniza la base de datos con el archivo:

```txt
prisma/schema.prisma
```

---

# 6. Iniciar el servidor

## Comando

```bash
npm run dev
```

---

# Requisitos Previos

Antes de ejecutar el proyecto, asegúrate de tener instalado:

- Node.js
- MySQL
- Git
- npm

---

# Scripts Disponibles

| Script | Descripción |
|---|---|
| npm run dev | Ejecuta el servidor en desarrollo |
| npx prisma studio | Abre interfaz visual de Prisma |
| npx prisma generate | Genera Prisma Client |
| npx prisma migrate dev | Ejecuta migraciones |