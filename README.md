# Reto tecnico


## Descripción

Este proyecto sigue la arquitectura hexagonal y está desarrollado con Node.js, Fastify y TypeScript. Implementa una estructura modular y escalable para garantizar mantenibilidad y flexibilidad.


## Requisitos
- Node.js >= 20.x
- npm
- Docker (opcional, para redis)

## Instalación

Clona el repositorio y ejecuta:
```bash
yarn install # o npm install o pnpm install
```

## Configuración

Crea un archivo `.env` en la raíz del proyecto y configura las variables necesarias:
```ini
PORT=

JWT_SECRET=

MYSQL_HOST=
MYSQL_PORT=
MYSQL_USER=
MYSQL_PASS=
MYSQL_DB_NAME=

REDIS_HOST=
REDIS_PORT=
```

## Ejecutar el Proyecto

Para iniciar en modo desarrollo:
```bash
npm run dev
```
Para iniciar en producción:
```bash
npm run build && npm run start
```

## Carpeta resources
1. Script para construir la base de datos en MySQL 
2. Colección de POSTMAN con los enpoints

## Documentación con Swagger
Ruta
```bash
/swagger/docs
```

## Pruebas

Ejecutar pruebas unitarias:
```bash
npm run test
```

## Estilo de Código

Este proyecto sigue las reglas de ESLint y Prettier. Para formatear el código:
```bash
npm run lint
```