# 🧱 backend-api-articles

API RESTful desarrollada con **Node.js** y **TypeScript** para la gestión de artículos. Diseñada con un enfoque en **escalabilidad**, **mantenibilidad** y **buenas prácticas de desarrollo backend**.

---

## 📌 Descripción del Proyecto

Este proyecto consiste en la construcción de una API para gestionar artículos. Cada artículo contiene un identificador único, nombre, marca, estado de activación y fecha de última modificación.

Se implementan las siguientes operaciones:

- **CREATE:** Crear nuevos artículos, obligando a completar los campos `name` y `brand`.
- **READ:**
  - Obtener todos los artículos.
  - Filtro por nombre (parcial o exacto) y estado activo/inactivo.
  - Obtener artículo por ID.
- **UPDATE:** Actualizar uno o más campos (`name`, `brand`, `is_active`), excepto el identificador.
- **DELETE:** Eliminación lógica de artículos a través de un campo booleano `is_active`.

---

## 🛠️ Tecnologías Utilizadas

Esta API está construida con un stack moderno y robusto, garantizando **escalabilidad**, **mantenimiento** y una excelente **experiencia de desarrollo**.

- **Node.js**: Entorno de ejecución de JavaScript del lado del servidor.
- **TypeScript**: Lenguaje que extiende JavaScript añadiendo tipado estático, mejorando la calidad del código y la detección temprana de errores.
- **Express.js**: Framework de Node.js rápido y minimalista, ideal para construir APIs RESTful.
- **MySQL**: Sistema de gestión de bases de datos relacional utilizado para almacenar y gestionar la información de los artículos.
- **Zod**: Biblioteca de declaración y validación de esquemas TypeScript-first, utilizada para asegurar la integridad de los datos de entrada.
- **Tsyringe**: Contenedor ligero de Inversión de Control (IoC), que facilita la inyección de dependencias y la modularidad del código.
- **Swagger / Swagger-UI / Swagger-JSDoc**: Herramientas para la documentación interactiva de la API, permitiendo visualizar y probar los endpoints directamente desde el navegador.
- **Winston**: Biblioteca de logging versátil para Node.js, utilizada para un registro estructurado y configurable de eventos y errores.
- **Dotenv**: Carga variables de entorno desde un archivo `.env` a `process.env`, manteniendo configuraciones sensibles fuera del control de versiones.
- **ts-node**: Permite ejecutar archivos TypeScript directamente sin necesidad de transpilar previamente, agilizando el desarrollo.

---

## 📁 Estructura del Proyecto

El proyecto sigue una arquitectura organizada en **capas**, promoviendo la separación de responsabilidades y facilitando el mantenimiento y la escalabilidad.

```
├── src/
│ ├── config/
│ │ ├── swagger.ts               # Configuración de Swagger
│ │ └── database.ts              # Configuración específica de la conexión a la base de datos
│ ├── controllers/
│ │ └── article.controller.ts    # Lógica de las solicitudes HTTP
│ ├── scripts/
│ │ └── migrate.ts                # Script para manejar migraciones de base de datos
│ ├── middlewares/
│ │ ├── auth.middleware.ts        # Autenticación con API Key
│ │ └── validation.middleware.ts  # Validación con Zod
│ │ └── error.middleware.ts       # Middleware para el manejo centralizado de errores
│ │ └─requestLogger.middleware.ts # Middleware para registrar las solicitudes HTTP entrantes
│ ├── models/
│ │ └── Article.ts                # Definiciones de tipo y esquemas de validación
│ ├── repositories/
│ │ ├
│ │ └── article.repository.ts      # Implementación con MySQL
│ ├── routes/
│ │ └── article.routes.ts         # Rutas de la API y Swagger JSDoc
│ ├── services/
│ │ └── article.service.ts        # Lógica de negocio
│ ├── utils/
│ │ └── logger.ts                 # Configuración de Winston
│ ├── app.ts                      # Configuración de Express
│ └── server.ts                   # Punto de entrada de la aplicación
├── .env.example                  # Archivo de ejemplo con variables de entorno
├── package.json                  # Dependencias y scripts
├── tsconfig.json                 # Configuración de TypeScript
└── README.md                     # Documentación del proyecto
```
---

## ⚙️ Instrucciones de Configuración y Ejecución

### Prerrequisitos
Antes de empezar, asegúrate de tener instalado lo siguiente:

- **Node.js** (versión 18.x o superior)
- **npm** (viene con Node.js) o **Yarn**
- **MySQL Server** (versión 8.0 o superior)

### 1. Clonar el repositorio

```bash
git clone https://github.com/pablo-peralta-cba/backend-api-articulos.git
cd backend-api-articulos
```

### 2. Instalar dependencias
```bash
npm install
```

### 3. Configurar variables de entorno
Renombrá el archivo .env.example a .env y completá las variables necesarias:

```
PORT=3000                               #Puerto donde se ejecuta la API
DB_HOST=localhost                       #Host del servidor MySQL
DB_USER=root                            #Usuario de la base de datos
DB_PASSWORD=tu_contraseña               #Contraseña del usuario de la base de datos
DB_NAME=nombre_de_base_de_datos         #Nombre de la base de datos donde se guardan artículos
DB_PORT=3306                            #Puerto donde se ejecuta la base de datos
API_KEY=tu_api_key_segura               #Clave requerida para autenticar los endpoints protegidos
```
### 4. Configurar e Inicializar la base de datos
Asegurate de tener una base de datos MySQL creada y las tablas necesarias de acuerdo al modelo de Article.

- **Crear la Base de Datos:** Crea una base de datos MySQL. Puedes usar un cliente como MySQL Workbench, DBeaver o la línea de comandos:

```
CREATE DATABASE IF NOT EXISTS `articulos_db`;
USE `articulos_db`;
```

- **Ejecutar Migraciones (método recomendado)**
Una vez configuradas las variables de entorno y creada la base de datos, ejecuta el script de migración para crear automáticamente la tabla articles:
```
npm run db:migrate
```

Este comando ejecutará _src/scripts/migrate.ts_ que se encargará de configurar la tabla **articles** con la siguiente estructura:

```
CREATE TABLE IF NOT EXISTS `articles` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `name` VARCHAR(255) NOT NULL,
    `brand` VARCHAR(255) NOT NULL,
    `modified_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    `is_active` BOOLEAN DEFAULT TRUE
);
```

### 5. Iniciar el servidor
Modo desarrollo:

```
Copiar
Editar
npm run dev
```

Modo producción (compilado):

```
Copiar
Editar
npm run build
npm start
```

Una vez que el servidor esté en ejecución, podrás acceder a la API.

---


## 🔌 Uso de la API (Endpoints)
La API proporciona los siguientes endpoints para la gestión de artículos. Todos los endpoints de la API base comienzan con /api.


### 🔐 Autenticación

La mayoría de las rutas requieren autenticación mediante una **API Key** enviada en el encabezado x-api-key de la solicitud:

```
x-api-key: tu_api_key_segura
```


### 📄 Documentación Interactiva
Una vez que el servidor esté en ejecución, puedes acceder a la documentación interactiva de Swagger en:

```
http://localhost:3000/api-docs
```

Desde ahí, puedes ver la estructura detallada de los endpoints, probarlos directamente y examinar ejemplos de respuestas.



### 📌 Endpoints Principales

|**Método**| **Endpoint**                 | **Descripción**                                                                                     | **Requiere autenticación** |
| :-----   | :--------------------------- | :-------------------------------------------------------------------------------------------------- | :------------------------- |
| GET      | /api/articles                | Obtiene una lista de artículos, separados en activos e inactivos, con filtros opcionales de nombre. | No                         |
| GET      | /api/articles/:id            | Obtiene un artículo específico por su ID.                                                           | No                         |
| POST     | /api/articles                | Crea un nuevo artículo.                                                                             | Sí                         |
| PATCH    | /api/articles/:id            | Actualiza uno o más campos del artículo especificado por su ID.                                     | Sí                         |
| PATCH    | /api/articles/:id/deactivate | Desactiva lógicamente un artículo por su ID (no se elimina físicamente).                            | Sí                         |


---


## 📄 Licencia

Este proyecto está licenciado bajo los términos de la licencia MIT. Ver el archivo [LICENSE](./LICENSE) para más detalles.

## 📫 Contacto

Si tenés dudas o sugerencias, podés escribirme a: [pablofedericoperalta@gmail.com](mailto:pablofedericoperalta@gmail.com)