# FullStack III - API REST Backend

API REST desarrollada con Node.js y Express para la asignatura FullStack III (Actividad 3.2). Implementa autenticación con JWT y persistencia de datos en MongoDB Atlas.

---

## Tecnologías

| Tecnología | Versión | Descripción |
|---|---|---|
| Node.js | >= 18.x | Entorno de ejecución JavaScript |
| Express | ^5.2.1 | Framework web para Node.js |
| MongoDB Atlas | Cloud | Base de datos NoSQL en la nube |
| Mongoose | ^9.6.3 | ODM para MongoDB |
| JSON Web Token | ^9.0.3 | Autenticación basada en tokens |
| express-jwt | ^8.5.1 | Middleware de validación JWT |
| bcrypt | ^6.0.0 | Hashing de contraseñas |
| cors | ^2.8.6 | Habilitación de CORS |

---

## Requisitos previos

Antes de instalar el proyecto asegúrate de tener lo siguiente instalado en tu máquina:

- **Node.js** >= 18.x — [Descargar aquí](https://nodejs.org/)
- **npm** >= 9.x (viene incluido con Node.js)
- Conexión a internet (la base de datos está en MongoDB Atlas)

Para verificar que tienes Node.js y npm instalados:

```bash
node --version
npm --version
```

---

## Instalación

### 1. Clonar el repositorio

```bash
git clone <URL_DEL_REPOSITORIO>
cd back
```

### 2. Instalar dependencias

```bash
npm install
```

Esto instalará todas las dependencias declaradas en `package.json`.

---

## Ejecución del proyecto

### Modo desarrollo (con hot reload)

```bash
npm run dev
```

Utiliza el flag `--watch` nativo de Node.js. El servidor se reinicia automáticamente cuando detecta cambios en los archivos.

### Modo producción

```bash
npm start
```

El servidor quedará disponible en:

```
http://localhost:8080
```

---

## Endpoints de la API

Base URL: `http://localhost:8080/api/v1`

### Autenticación

| Método | Ruta | Descripción | Auth requerida |
|---|---|---|---|
| `POST` | `/user/register` | Registrar nuevo usuario | No |
| `POST` | `/user/login` | Iniciar sesión y obtener token | No |
| `GET` | `/user/profile/:id` | Obtener perfil por ID | Sí (Bearer Token) |

### Body para registro (`POST /user/register`)

```json
{
  "name": "Juan",
  "lastname": "Pérez",
  "email": "juan@correo.com",
  "password": "tuContraseña123",
  "rol": "admin"
}
```

### Body para login (`POST /user/login`)

```json
{
  "email": "juan@correo.com",
  "password": "tuContraseña123"
}
```

Respuesta exitosa del login:

```json
{
  "token": "<JWT_TOKEN>",
  "user": {
    "_id": "...",
    "name": "Juan",
    "lastname": "Pérez",
    "email": "juan@correo.com",
    "rol": "admin"
  }
}
```

### Ruta protegida (`GET /user/profile/:id`)

Requiere el token en el header de la petición:

```
Authorization: Bearer <JWT_TOKEN>
```

---

## Estructura del proyecto

```
back/
├── api.js                          # Punto de entrada, configuración del servidor
├── package.json
└── src/
    ├── controller/
    │   └── user.controller.js      # Lógica de autenticación y usuarios
    ├── model/
    │   └── user.model.js           # Esquema de usuario en Mongoose
    └── routes/
        └── user.routes.js          # Definición de rutas
```

---

## Notas importantes

- La cadena de conexión a MongoDB Atlas está definida directamente en `api.js`. Para ambientes productivos se recomienda moverla a una variable de entorno.
- El servidor usa `dns.setServers(['8.8.8.8', '8.8.4.4'])` para forzar la resolución DNS a través de Google, necesario para que Node.js resuelva correctamente los registros SRV de MongoDB Atlas en algunas redes.
