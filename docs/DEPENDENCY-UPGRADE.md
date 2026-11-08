# Actualizacion de dependencias - 5 de noviembre de 2026

Node 26.13.0 LTS; npm 12.2.2; pnpm 12.16.1. NVM conserva Node 20.12.2 y 24.15.0. Versiones estables verificadas contra los registros.

## Inventario

| Paquete | Antes (instalado) | Final |
| --- | --- | --- |
| bcrypt | 5.1.1 | 6.0.0 |
| cookie-parser | 1.4.7 | Retirado |
| cors | 2.8.5 | 2.8.6 |
| express | 4.21.2 | 5.3.0 |
| graphql | 16.14.2 | 17.1.0 |
| graphql-http | 1.23.1 | 1.23.1 |
| graphql-ws | 5.16.2 | 6.4.1 |
| handlebars | 4.7.8 | Retirado |
| helmet | 7.2.0 | 8.3.0 |
| jsonwebtoken | 9.0.2 | 9.0.3 |
| moment | 2.30.1 | 2.31.0 |
| nodemailer | 6.10.0 | 10.3.1 |
| pg | 8.14.1 | 8.23.1 |
| uuid | 9.0.1 | Retirado |
| ws | 8.22.1 | 8.22.1 |
| @electric-sql/pglite | 0.5.14 | 0.5.15 |
| nodemon | 3.1.9 | 3.1.14 |

## Migraciones

- Express 5: factory de aplicacion separada del arranque y fallback 404 sin comodin. Se conservan URLs, payloads, autenticacion y esquema publico.
- graphql-ws/use/ws y GraphQL 17 manteniendo CommonJS.
- node:crypto.randomUUID(); retirados uuid, cookie-parser y handlebars sin uso.
- pnpm allowBuilds para bcrypt y lockfile incorporado al control de versiones. Overrides de picomatch y nodemon>minimatch.
- Pruebas limitadas a test/**/*.test.js, sin detectar app/routes/test.js como prueba.

## Seguridad

Auditoria completa de produccion y desarrollo: 0 vulnerabilidades.

## Despliegue futuro

Vercel ofrece Node 26.x y soporte WebSocket. El adaptador legacy de vercel.json requiere validacion separada de despliegue; el pub/sub del chat sigue siendo por proceso y una instancia local no acredita entrega entre varias instancias. Fuentes: https://vercel.com/docs/functions/runtimes/node-js/node-js-versions y https://vercel.com/changelog/websocket-support-is-now-generally-available.

## Verificaciones

pnpm install --frozen-lockfile --prefer-offline: aprobado. 11/11 pruebas con HTTP/WebSocket y PGlite, autenticacion/permisos, reconexion y pedidos cerrados; Express 5/rutas/404/errores, UUID/JWT y bcrypt con hashes existentes; correo en memoria sin envio. pnpm outdated devuelve {} y la auditoria devuelve 0 vulnerabilidades.
